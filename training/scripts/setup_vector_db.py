#!/usr/bin/env python3
"""
Vector Database Setup for StoryForge Custom Model Training
Handles various datasets from training-datasets folder and creates embeddings
"""

import os
import json
import sqlite3
import numpy as np
from pathlib import Path
from typing import List, Dict, Any, Optional
import hashlib
from datetime import datetime

try:
    import chromadb
    from chromadb.config import Settings
except ImportError:
    print("ChromaDB not installed. Install with: pip install chromadb")
    exit(1)

try:
    from sentence_transformers import SentenceTransformer
except ImportError:
    print("SentenceTransformers not installed. Install with: pip install sentence-transformers")
    exit(1)

class StoryForgeVectorDB:
    """Vector database manager for StoryForge training datasets"""
    
    def __init__(self, db_path: str = "training/vector-db"):
        self.db_path = Path(db_path)
        self.db_path.mkdir(parents=True, exist_ok=True)
        
        # Initialize ChromaDB
        self.client = chromadb.PersistentClient(
            path=str(self.db_path),
            settings=Settings(anonymized_telemetry=False)
        )
        
        # Initialize sentence transformer for embeddings
        self.encoder = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Create collections for different data types
        self.collections = {
            'stories': self._get_or_create_collection('children_stories'),
            'dialogues': self._get_or_create_collection('story_dialogues'),
            'characters': self._get_or_create_collection('character_descriptions'),
            'prompts': self._get_or_create_collection('story_prompts'),
            'metadata': self._get_or_create_collection('training_metadata')
        }
        
        print(f"✅ Vector database initialized at {self.db_path}")
    
    def _get_or_create_collection(self, name: str):
        """Get or create a ChromaDB collection"""
        try:
            return self.client.get_collection(name)
        except ValueError:
            return self.client.create_collection(name)
    
    def process_training_datasets(self, datasets_path: str = "training-datasets"):
        """Process all datasets from training-datasets folder"""
        datasets_path = Path(datasets_path)
        
        if not datasets_path.exists():
            print(f"❌ Training datasets folder not found: {datasets_path}")
            return
        
        print(f"📁 Processing datasets from {datasets_path}")
        
        # Process different file types
        for file_path in datasets_path.rglob("*"):
            if file_path.is_file():
                self._process_file(file_path)
        
        print("✅ Dataset processing completed")
    
    def _process_file(self, file_path: Path):
        """Process individual dataset files"""
        file_ext = file_path.suffix.lower()
        
        try:
            if file_ext == '.json':
                self._process_json_file(file_path)
            elif file_ext == '.txt':
                self._process_text_file(file_path)
            elif file_ext == '.csv':
                self._process_csv_file(file_path)
            else:
                print(f"⚠️  Unsupported file type: {file_path}")
        except Exception as e:
            print(f"❌ Error processing {file_path}: {e}")
    
    def _process_json_file(self, file_path: Path):
        """Process JSON dataset files"""
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if isinstance(data, list):
            for i, item in enumerate(data):
                self._add_story_item(item, f"{file_path.stem}_{i}")
        elif isinstance(data, dict):
            self._add_story_item(data, file_path.stem)
    
    def _process_text_file(self, file_path: Path):
        """Process plain text files"""
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Split into chunks for better processing
        chunks = self._split_text_into_chunks(content)
        
        for i, chunk in enumerate(chunks):
            self._add_text_chunk(chunk, f"{file_path.stem}_chunk_{i}")
    
    def _process_csv_file(self, file_path: Path):
        """Process CSV dataset files"""
        import csv
        
        with open(file_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for i, row in enumerate(reader):
                self._add_story_item(row, f"{file_path.stem}_{i}")
    
    def _split_text_into_chunks(self, text: str, chunk_size: int = 1000) -> List[str]:
        """Split text into manageable chunks"""
        words = text.split()
        chunks = []
        
        for i in range(0, len(words), chunk_size):
            chunk = ' '.join(words[i:i + chunk_size])
            chunks.append(chunk)
        
        return chunks
    
    def _add_story_item(self, item: Dict[str, Any], item_id: str):
        """Add a story item to the appropriate collection"""
        # Determine content type and collection
        if 'story' in item or 'text' in item or 'content' in item:
            content = item.get('story', item.get('text', item.get('content', '')))
            collection = self.collections['stories']
            metadata = {
                'type': 'story',
                'age_group': item.get('age_group', 'unknown'),
                'genre': item.get('genre', 'unknown'),
                'length': len(content),
                'source_id': item_id
            }
        elif 'character' in item or 'name' in item:
            content = str(item)
            collection = self.collections['characters']
            metadata = {
                'type': 'character',
                'source_id': item_id
            }
        elif 'prompt' in item:
            content = item['prompt']
            collection = self.collections['prompts']
            metadata = {
                'type': 'prompt',
                'source_id': item_id
            }
        else:
            content = str(item)
            collection = self.collections['stories']
            metadata = {
                'type': 'general',
                'source_id': item_id
            }
        
        # Generate embedding and add to collection
        if content and len(content.strip()) > 0:
            embedding = self.encoder.encode([content])[0].tolist()
            
            collection.add(
                embeddings=[embedding],
                documents=[content],
                metadatas=[metadata],
                ids=[item_id]
            )
            
            print(f"✅ Added item: {item_id}")
    
    def _add_text_chunk(self, chunk: str, chunk_id: str):
        """Add a text chunk to stories collection"""
        if len(chunk.strip()) > 0:
            embedding = self.encoder.encode([chunk])[0].tolist()
            
            metadata = {
                'type': 'text_chunk',
                'length': len(chunk),
                'source_id': chunk_id
            }
            
            self.collections['stories'].add(
                embeddings=[embedding],
                documents=[chunk],
                metadatas=[metadata],
                ids=[chunk_id]
            )
    
    def search_similar_content(self, query: str, collection_name: str = 'stories', n_results: int = 5):
        """Search for similar content in the vector database"""
        if collection_name not in self.collections:
            print(f"❌ Collection {collection_name} not found")
            return []
        
        query_embedding = self.encoder.encode([query])[0].tolist()
        
        results = self.collections[collection_name].query(
            query_embeddings=[query_embedding],
            n_results=n_results
        )
        
        return results
    
    def get_collection_stats(self):
        """Get statistics for all collections"""
        stats = {}
        
        for name, collection in self.collections.items():
            try:
                count = collection.count()
                stats[name] = count
            except Exception as e:
                stats[name] = f"Error: {e}"
        
        return stats
    
    def export_training_data(self, output_path: str = "training/processed_data.json"):
        """Export processed data for model training"""
        export_data = {
            'metadata': {
                'created_at': datetime.now().isoformat(),
                'collections': self.get_collection_stats()
            },
            'data': {}
        }
        
        for name, collection in self.collections.items():
            try:
                # Get all documents from collection
                results = collection.get()
                export_data['data'][name] = {
                    'documents': results['documents'],
                    'metadatas': results['metadatas'],
                    'ids': results['ids']
                }
            except Exception as e:
                print(f"❌ Error exporting {name}: {e}")
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(export_data, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Training data exported to {output_path}")

def main():
    """Main function to set up vector database"""
    print("🚀 Setting up StoryForge Vector Database...")
    
    # Initialize vector database
    vector_db = StoryForgeVectorDB()
    
    # Process training datasets
    vector_db.process_training_datasets()
    
    # Print statistics
    stats = vector_db.get_collection_stats()
    print("\n📊 Collection Statistics:")
    for name, count in stats.items():
        print(f"  {name}: {count} items")
    
    # Export training data
    vector_db.export_training_data()
    
    print("\n✅ Vector database setup completed!")

if __name__ == "__main__":
    main() 
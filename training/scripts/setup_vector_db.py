#!/usr/bin/env python3
"""
Vector Database Setup for StoryForge Custom Model Training
Processes structured datasets, creates vector embeddings, and stores them using ChromaDB
"""

import os
import json
import csv
from pathlib import Path
from typing import List, Dict, Any
from datetime import datetime

# External dependencies
try:
    import chromadb
    from chromadb.config import Settings
    from chromadb.errors import NotFoundError
except ImportError:
    print("ChromaDB not installed. Install with: pip install chromadb")
    exit(1)

try:
    from sentence_transformers import SentenceTransformer
except ImportError:
    print("SentenceTransformers not installed. Install with: pip install sentence-transformers")
    exit(1)


class StoryForgeVectorDB:
    def __init__(self, db_path: str = "training/vector-db"):
        self.db_path = Path(db_path)
        self.db_path.mkdir(parents=True, exist_ok=True)

        self.client = chromadb.PersistentClient(
            path=str(self.db_path),
            settings=Settings(anonymized_telemetry=False)
        )

        self.encoder = SentenceTransformer('all-MiniLM-L6-v2')

        self.collections = {
            'stories': self._get_or_create_collection('children_stories'),
            'dialogues': self._get_or_create_collection('story_dialogues'),
            'characters': self._get_or_create_collection('character_descriptions'),
            'prompts': self._get_or_create_collection('story_prompts'),
            'metadata': self._get_or_create_collection('training_metadata')
        }

        print(f"✅ Vector DB initialized at {self.db_path}")

    def _get_or_create_collection(self, name: str):
        try:
            return self.client.get_collection(name)
        except NotFoundError:
            return self.client.create_collection(name)

    def process_training_datasets(self, datasets_path: str = "../../training-datasets"):
        datasets_path = Path(datasets_path)

        if not datasets_path.exists():
            print(f"Folder not found: {datasets_path}")
            return

        print(f"Processing files in {datasets_path}")

        for file_path in datasets_path.rglob("*"):
            if file_path.is_file() and not file_path.name.startswith("."):
                self._process_file(file_path)

        print("All datasets processed.")

    def _process_file(self, file_path: Path):
        ext = file_path.suffix.lower()
        try:
            if ext == ".json":
                self._process_json_file(file_path)
            elif ext == ".csv":
                self._process_csv_file(file_path)
            elif ext == ".txt":
                self._process_text_file(file_path)
            else:
                print(f"⚠️ Skipping unsupported file: {file_path}")
        except Exception as e:
            print(f"❌ Error processing {file_path}: {e}")

    def _process_json_file(self, file_path: Path):
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        if isinstance(data, list):
            for i, item in enumerate(data):
                self._add_to_collection(item, f"{file_path.stem}_{i}")
        elif isinstance(data, dict):
            self._add_to_collection(data, file_path.stem)

    def _process_csv_file(self, file_path: Path):
        with open(file_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for i, row in enumerate(reader):
                self._add_to_collection(row, f"{file_path.stem}_{i}")

    def _process_text_file(self, file_path: Path):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        chunks = self._split_text(content)
        for i, chunk in enumerate(chunks):
            self._add_text_chunk(chunk, f"{file_path.stem}_chunk_{i}")

    def _split_text(self, text: str, chunk_size: int = 1000) -> List[str]:
        words = text.split()
        return [' '.join(words[i:i+chunk_size]) for i in range(0, len(words), chunk_size)]

    def _add_to_collection(self, item: Dict[str, Any], item_id: str):
        content = item.get('story') or item.get('text') or item.get('content') or str(item)
        content = content.strip()
        if not content:
            return

        if 'story' in item or 'text' in item:
            collection = self.collections['stories']
            metadata = {
                'type': 'story',
                'length': len(content),
                'genre': item.get('genre', 'unknown'),
                'age_group': item.get('age_group', 'unknown'),
                'source_id': item_id
            }
        elif 'character' in item or 'name' in item:
            collection = self.collections['characters']
            metadata = {'type': 'character', 'source_id': item_id}
        elif 'prompt' in item:
            collection = self.collections['prompts']
            metadata = {'type': 'prompt', 'source_id': item_id}
        else:
            collection = self.collections['stories']
            metadata = {'type': 'general', 'source_id': item_id}

        embedding = self.encoder.encode([content])[0].tolist()
        collection.add(
            embeddings=[embedding],
            documents=[content],
            metadatas=[metadata],
            ids=[item_id]
        )
        print(f"Added {item_id} to {collection.name}")

    def _add_text_chunk(self, chunk: str, chunk_id: str):
        embedding = self.encoder.encode([chunk])[0].tolist()
        metadata = {'type': 'text_chunk', 'length': len(chunk), 'source_id': chunk_id}
        self.collections['stories'].add(
            embeddings=[embedding],
            documents=[chunk],
            metadatas=[metadata],
            ids=[chunk_id]
        )

    def get_collection_stats(self):
        stats = {}
        for name, col in self.collections.items():
            try:
                stats[name] = col.count()
            except Exception as e:
                stats[name] = f"Error: {e}"
        return stats

    def export_training_data(self, output_path: str = "training/processed_data.json"):
        output = {
            'metadata': {
                'created_at': datetime.now().isoformat(),
                'collections': self.get_collection_stats()
            },
            'data': {}
        }
        for name, col in self.collections.items():
            try:
                col_data = col.get()
                output['data'][name] = {
                    'documents': col_data['documents'],
                    'metadatas': col_data['metadatas'],
                    'ids': col_data['ids']
                }
            except Exception as e:
                print(f"Could not export {name}: {e}")

        Path(output_path).parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2, ensure_ascii=False)
        print(f"Exported training data to {output_path}")


def main():
    print("Setting up StoryForge Vector Database...")
    db = StoryForgeVectorDB()
    db.process_training_datasets()
    print("\nCollection Stats:")
    for name, count in db.get_collection_stats().items():
        print(f"  - {name}: {count} items")
    db.export_training_data()
    print("\nVector database setup complete.")


if __name__ == "__main__":
    main()

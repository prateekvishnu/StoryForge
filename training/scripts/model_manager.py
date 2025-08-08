#!/usr/bin/env python3
"""
Model Manager for StoryForge Custom Model
Handles loading, inference, and management of the fine-tuned model
"""

import os
import json
import torch
from pathlib import Path
from typing import Dict, List, Optional, Union
from datetime import datetime

try:
    from transformers import (
        AutoTokenizer,
        AutoModelForCausalLM,
        GenerationConfig
    )
    from peft import PeftModel
except ImportError as e:
    print(f"❌ Required libraries not installed: {e}")
    print("Install with: pip install transformers peft torch")
    exit(1)

class StoryForgeModelManager:
    """Manager for StoryForge custom model inference"""
    
    def __init__(self, model_path: str = "training/models/storyforge-phi3-fine-tuned"):
        self.model_path = Path(model_path)
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = None
        self.tokenizer = None
        self.generation_config = None
        
        print(f"🚀 StoryForge Model Manager initialized")
        print(f"📁 Model path: {self.model_path}")
        print(f"🔧 Device: {self.device}")
    
    def load_model(self):
        """Load the fine-tuned model and tokenizer"""
        if not self.model_path.exists():
            raise FileNotFoundError(f"Model not found at {self.model_path}")
        
        print("📦 Loading fine-tuned model...")
        
        # Check if this is a PEFT model
        adapter_config_path = self.model_path / "adapter_config.json"
        is_peft_model = adapter_config_path.exists()
        
        if is_peft_model:
            print("🔧 Loading PEFT (LoRA) model...")
            
            # Load adapter config to get base model name
            with open(adapter_config_path, 'r') as f:
                adapter_config = json.load(f)
            
            base_model_name = adapter_config.get("base_model_name_or_path", "microsoft/Phi-3.5-mini-instruct")
            
            # Load base model
            base_model = AutoModelForCausalLM.from_pretrained(
                base_model_name,
                torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
                device_map="auto" if torch.cuda.is_available() else None,
                trust_remote_code=True
            )
            
            # Load PEFT model
            self.model = PeftModel.from_pretrained(base_model, self.model_path)
            
            # Load tokenizer from the fine-tuned model directory
            self.tokenizer = AutoTokenizer.from_pretrained(
                self.model_path,
                trust_remote_code=True
            )
        else:
            print("🔧 Loading full fine-tuned model...")
            
            # Load full model
            self.model = AutoModelForCausalLM.from_pretrained(
                self.model_path,
                torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
                device_map="auto" if torch.cuda.is_available() else None,
                trust_remote_code=True
            )
            
            # Load tokenizer
            self.tokenizer = AutoTokenizer.from_pretrained(
                self.model_path,
                trust_remote_code=True
            )
        
        # Ensure pad token is set
        if self.tokenizer.pad_token is None:
            self.tokenizer.pad_token = self.tokenizer.eos_token
        
        # Set up generation config
        self.setup_generation_config()
        
        # Set model to evaluation mode
        self.model.eval()
        
        print("✅ Model loaded successfully!")
    
    def setup_generation_config(self):
        """Set up generation configuration for story creation"""
        self.generation_config = GenerationConfig(
            max_new_tokens=1024,
            min_new_tokens=50,
            temperature=0.7,
            top_p=0.9,
            top_k=50,
            repetition_penalty=1.1,
            do_sample=True,
            pad_token_id=self.tokenizer.pad_token_id,
            eos_token_id=self.tokenizer.eos_token_id,
            no_repeat_ngram_size=3
        )
    
    def generate_story(self, 
                      prompt: str, 
                      age_group: str = "7-10", 
                      genre: str = "adventure",
                      max_length: int = 800,
                      temperature: float = 0.7) -> str:
        """Generate a story based on the given prompt"""
        if self.model is None:
            raise RuntimeError("Model not loaded. Call load_model() first.")
        
        # Format the prompt for the model
        formatted_prompt = self.format_story_prompt(prompt, age_group, genre)
        
        # Tokenize input
        inputs = self.tokenizer.encode(
            formatted_prompt,
            return_tensors="pt",
            truncation=True,
            max_length=1024
        ).to(self.device)
        
        # Update generation config
        gen_config = GenerationConfig(
            max_new_tokens=max_length,
            min_new_tokens=50,
            temperature=temperature,
            top_p=0.9,
            top_k=50,
            repetition_penalty=1.1,
            do_sample=True,
            pad_token_id=self.tokenizer.pad_token_id,
            eos_token_id=self.tokenizer.eos_token_id,
            no_repeat_ngram_size=3
        )
        
        # Generate story
        with torch.no_grad():
            outputs = self.model.generate(
                inputs,
                generation_config=gen_config,
                attention_mask=torch.ones_like(inputs)
            )
        
        # Decode the generated text
        generated_text = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        
        # Extract only the generated story (remove the prompt)
        story = self.extract_story_from_output(generated_text, formatted_prompt)
        
        # Post-process the story
        story = self.post_process_story(story, age_group)
        
        return story
    
    def format_story_prompt(self, prompt: str, age_group: str, genre: str) -> str:
        """Format the input prompt for the model"""
        formatted_prompt = f"""<|system|>
You are a helpful AI assistant that creates engaging, age-appropriate stories for children aged {age_group}. Your stories should be safe, educational, and entertaining.
<|end|>
<|user|>
Create a {genre} story suitable for children aged {age_group}. {prompt}
<|end|>
<|assistant|>"""
        
        return formatted_prompt
    
    def extract_story_from_output(self, generated_text: str, original_prompt: str) -> str:
        """Extract the story content from the model output"""
        # Remove the original prompt
        if original_prompt in generated_text:
            story = generated_text.replace(original_prompt, "").strip()
        else:
            story = generated_text.strip()
        
        # Remove any remaining special tokens
        story = story.replace("<|end|>", "").strip()
        
        return story
    
    def post_process_story(self, story: str, age_group: str) -> str:
        """Post-process the generated story for quality"""
        # Basic cleanup
        lines = story.split('\n')
        processed_lines = []
        
        for line in lines:
            line = line.strip()
            if line and not line.startswith('<|') and not line.startswith('Human:') and not line.startswith('Assistant:'):
                processed_lines.append(line)
        
        processed_story = '\n\n'.join(processed_lines)
        
        # Ensure appropriate length
        sentences = processed_story.split('.')
        if len(sentences) < 3:
            # Story is too short, might need regeneration
            processed_story += " The adventure continued with many exciting discoveries ahead!"
        
        return processed_story.strip()
    
    def generate_interactive_story(self, 
                                 prompt: str, 
                                 age_group: str = "7-10",
                                 choices_count: int = 3) -> Dict[str, Union[str, List[str]]]:
        """Generate an interactive story with choices"""
        # Generate the main story
        story_prompt = f"{prompt} Make this an interactive story that ends with choices for the reader."
        story = self.generate_story(story_prompt, age_group, "adventure", max_length=600)
        
        # Generate choices
        choices_prompt = f"""<|system|>
You are creating choices for an interactive children's story. Generate exactly {choices_count} appropriate choices.
<|end|>
<|user|>
Based on this story: "{story[:200]}..." 
Create {choices_count} exciting but age-appropriate choices for children aged {age_group}.
<|end|>
<|assistant|>
Here are the choices:
A)"""
        
        inputs = self.tokenizer.encode(
            choices_prompt,
            return_tensors="pt",
            truncation=True,
            max_length=1024
        ).to(self.device)
        
        with torch.no_grad():
            outputs = self.model.generate(
                inputs,
                max_new_tokens=200,
                temperature=0.8,
                top_p=0.9,
                do_sample=True,
                pad_token_id=self.tokenizer.pad_token_id,
                eos_token_id=self.tokenizer.eos_token_id
            )
        
        choices_text = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        choices = self.extract_choices(choices_text)
        
        return {
            "story": story,
            "choices": choices
        }
    
    def extract_choices(self, choices_text: str) -> List[str]:
        """Extract choices from the generated text"""
        choices = []
        lines = choices_text.split('\n')
        
        for line in lines:
            line = line.strip()
            if line.startswith(('A)', 'B)', 'C)', 'D)', '1.', '2.', '3.', '4.')):
                # Clean up the choice text
                choice = line[2:].strip() if line[1] == ')' else line[2:].strip()
                if choice:
                    choices.append(choice)
        
        # Ensure we have at least 3 choices
        if len(choices) < 3:
            default_choices = [
                "Continue the adventure",
                "Explore a different path",
                "Ask for help from a friend"
            ]
            choices.extend(default_choices[:3-len(choices)])
        
        return choices[:3]  # Return only first 3 choices
    
    def get_model_info(self) -> Dict[str, any]:
        """Get information about the loaded model"""
        if not self.model_path.exists():
            return {"error": "Model not found"}
        
        info = {
            "model_path": str(self.model_path),
            "model_loaded": self.model is not None,
            "device": str(self.device),
            "model_size": "3.7B parameters (Phi-3.5 Mini)"
        }
        
        # Try to load training metrics if available
        metrics_path = self.model_path / "training_metrics.json"
        if metrics_path.exists():
            with open(metrics_path, 'r') as f:
                training_metrics = json.load(f)
            info["training_metrics"] = training_metrics
        
        return info
    
    def test_model(self) -> bool:
        """Test if the model is working correctly"""
        if self.model is None:
            print("❌ Model not loaded")
            return False
        
        try:
            test_story = self.generate_story(
                "Tell me about a brave little mouse", 
                age_group="7-10", 
                genre="adventure",
                max_length=200
            )
            
            if len(test_story.strip()) > 20:
                print("✅ Model test successful!")
                print(f"📝 Sample story: {test_story[:100]}...")
                return True
            else:
                print("❌ Model test failed - generated text too short")
                return False
                
        except Exception as e:
            print(f"❌ Model test failed: {e}")
            return False

def main():
    """Main function for testing the model manager"""
    print("🧪 Testing StoryForge Model Manager")
    print("=" * 50)
    
    # Initialize model manager
    manager = StoryForgeModelManager()
    
    # Check if model exists
    if not manager.model_path.exists():
        print(f"❌ Model not found at {manager.model_path}")
        print("Please run fine_tune_model.py first to create the model")
        return
    
    # Load model
    try:
        manager.load_model()
    except Exception as e:
        print(f"❌ Failed to load model: {e}")
        return
    
    # Test model
    if manager.test_model():
        print("\n🎉 Model is ready for use!")
        
        # Show model info
        info = manager.get_model_info()
        print(f"\n📊 Model Information:")
        for key, value in info.items():
            print(f"  {key}: {value}")
    else:
        print("\n❌ Model test failed")

if __name__ == "__main__":
    main() 
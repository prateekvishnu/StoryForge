#!/usr/bin/env python3
"""
Fine-tuning Script for StoryForge Custom Model
Fine-tunes a 3.7B parameter model (Phi-3.5 Mini) for children's story generation
"""

import os
import json
import torch
import logging
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, field
from datasets import load_from_disk

import argparse


try:
    from transformers import (
        AutoTokenizer, 
        AutoModelForCausalLM,
        TrainingArguments,
        Trainer,
        DataCollatorForLanguageModeling,
        EarlyStoppingCallback
    )
    from datasets import Dataset
    import wandb
except ImportError as e:
    print(f"Required libraries not installed: {e}")
    print("Install with: pip install transformers datasets torch wandb accelerate peft")
    exit(1)

try:
    from peft import (
        LoraConfig,
        get_peft_model,
        TaskType,
        PeftModel
    )
except ImportError:
    print("PEFT not installed. Install with: pip install peft")
    exit(1)

@dataclass
class ModelConfig:
    """Configuration for model fine-tuning"""
    model_name: str = "Qwen/Qwen2.5-0.5B-Instruct"  # 0.5B parameter model (open access)
    max_length: int = 2048  # Qwen2.5 supports up to 32K context
    learning_rate: float = 3e-4  # Higher learning rate for very small model
    batch_size: int = 8  # Large batch size for 0.5B model
    gradient_accumulation_steps: int = 2  # Small accumulation for very small model
    num_epochs: int = 4  # More epochs for better training
    warmup_steps: int = 100
    save_steps: int = 500
    eval_steps: int = 500
    logging_steps: int = 50
    output_dir: str = "training/models/storyforge-qwen-fine-tuned"
    use_lora: bool = True
    lora_r: int = 16  # Appropriate LoRA rank for smaller model
    lora_alpha: int = 32  # Appropriate LoRA alpha for smaller model
    lora_dropout: float = 0.1

class StoryForgeTrainer:
    """Fine-tuning trainer for StoryForge custom model"""
    
    def __init__(self, config: ModelConfig):
        self.config = config
        Path("training/logs").mkdir(parents=True, exist_ok=True)
        self.setup_logging()
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        print(f"Using device: {self.device}")
        
        # Create output directories
        Path(config.output_dir).mkdir(parents=True, exist_ok=True)
        Path("training/logs").mkdir(parents=True, exist_ok=True)
        
    def setup_logging(self):
        """Set up logging configuration"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(f'training/logs/training_{datetime.now().strftime("%Y%m%d_%H%M%S")}.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
    
    def load_model_and_tokenizer(self):
        """Load the base model and tokenizer"""
        self.logger.info(f"Loading model: {self.config.model_name}")
        
        # Load tokenizer
        self.tokenizer = AutoTokenizer.from_pretrained(
            self.config.model_name,
            trust_remote_code=True,
            padding_side="right"
        )
        
        # Add pad token if not present
        if self.tokenizer.pad_token is None:
            self.tokenizer.pad_token = self.tokenizer.eos_token
        
        # Load model
        self.model = AutoModelForCausalLM.from_pretrained(
            self.config.model_name,
            torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
            device_map="auto" if torch.cuda.is_available() else None,
            trust_remote_code=True,
            attn_implementation="eager",  # Use eager attention to avoid cache issues
            use_cache=False  # Disable KV cache for training
        )
        
        # Enable gradient checkpointing to save memory
        try:
            self.model.gradient_checkpointing_enable()
            self.logger.info("Gradient checkpointing enabled")
        except Exception as e:
            self.logger.warning(f"Could not enable gradient checkpointing: {e}")
            self.logger.info("Training will continue without gradient checkpointing")
        
        # Apply LoRA if enabled
        if self.config.use_lora:
            self.apply_lora()
        
        self.logger.info("Model and tokenizer loaded successfully")
    
    def validate_config(self):
        """Validate training configuration"""
        self.logger.info("Validating configuration...")
        
        # Check batch size and gradient accumulation
        effective_batch_size = self.config.batch_size * self.config.gradient_accumulation_steps
        self.logger.info(f"Effective batch size: {effective_batch_size}")
        
        if effective_batch_size < 8:
            self.logger.warning("Effective batch size is small. Consider increasing batch_size or gradient_accumulation_steps")
        
        # Check learning rate
        if self.config.learning_rate > 1e-3:
            self.logger.warning("Learning rate seems high. Consider using a lower learning rate (e.g., 1e-4)")
        
        # Check output directory
        if Path(self.config.output_dir).exists():
            self.logger.warning(f"Output directory {self.config.output_dir} already exists. Will overwrite.")
        
        self.logger.info("Configuration validation completed")
    
    def apply_lora(self):
        """Apply LoRA (Low-Rank Adaptation) for efficient fine-tuning"""
        self.logger.info("Applying LoRA configuration...")
        
        lora_config = LoraConfig(
            task_type=TaskType.CAUSAL_LM,
            r=self.config.lora_r,
            lora_alpha=self.config.lora_alpha,
            lora_dropout=self.config.lora_dropout,
            target_modules=["q_proj", "v_proj", "k_proj", "o_proj", "gate_proj", "up_proj", "down_proj"]
        )
        
        self.model = get_peft_model(self.model, lora_config)
        self.model.print_trainable_parameters()
    
    def load_training_data(self) -> Dataset:
        """Load and prepare training data from vector database export"""
        data_path = "training/processed_data.json"
        
        if not Path(data_path).exists():
            self.logger.error(f"Training data not found at {data_path}")
            self.logger.info("Please run setup_vector_db.py first to process training datasets")
            raise FileNotFoundError(f"Training data not found: {data_path}")
        
        self.logger.info(f"Loading training data from {data_path}")
        
        with open(data_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Extract stories and prompts for training
        training_texts = []
        
        # Process stories
        if 'stories' in data['data']:
            stories_data = data['data']['stories']
            for doc, metadata in zip(stories_data['documents'], stories_data['metadatas']):
                if len(doc.strip()) > 50:  # Filter out very short texts
                    training_texts.append(self.format_training_text(doc, metadata))
        
        # Process prompts
        if 'prompts' in data['data']:
            prompts_data = data['data']['prompts']
            for doc, metadata in zip(prompts_data['documents'], prompts_data['metadatas']):
                if len(doc.strip()) > 20:
                    training_texts.append(self.format_prompt_text(doc, metadata))
        
        self.logger.info(f"Prepared {len(training_texts)} training examples")
        
        # Create dataset
        dataset = Dataset.from_dict({"text": training_texts})
        
        # Split into train/validation
        train_val_split = dataset.train_test_split(test_size=0.1, seed=42)
        
        return train_val_split["train"], train_val_split["test"]
    
    def format_training_text(self, story: str, metadata: Dict) -> str:
        """Format story text for training with appropriate prompts"""
        age_group = metadata.get('age_group', '7-10')
        genre = metadata.get('genre', 'adventure')
        
        # Create a structured prompt for the model using Llama-3.1 format
        prompt = f"""<|begin_of_text|><|start_header_id|>system<|end_header_id|>

You are a helpful AI assistant that creates engaging, age-appropriate stories for children aged {age_group}. Your stories should be safe, educational, and entertaining.<|eot_id|><|start_header_id|>user<|end_header_id|>

Create a {genre} story suitable for children aged {age_group}.<|eot_id|><|start_header_id|>assistant<|end_header_id|>

{story.strip()}<|eot_id|><|end_of_text|>"""
        
        return prompt
    
    def format_prompt_text(self, prompt: str, metadata: Dict) -> str:
        """Format prompt text for training"""
        formatted_prompt = f"""<|begin_of_text|><|start_header_id|>system<|end_header_id|>

You are a helpful AI assistant that creates engaging, age-appropriate stories for children. Always ensure content is safe and suitable for young readers.<|eot_id|><|start_header_id|>user<|end_header_id|>

{prompt.strip()}<|eot_id|><|start_header_id|>assistant<|end_header_id|>

Once upon a time, there was a magical adventure waiting to unfold...<|eot_id|><|end_of_text|>"""
        
        return formatted_prompt
    
    def tokenize_function(self, examples):
        """Tokenize the training examples"""
        return self.tokenizer(
            examples["text"],
            truncation=True,
            padding=False,
            max_length=self.config.max_length,
            return_overflowing_tokens=False,
        )
    
    def start_training(self, dry_run=False):
        """Start the fine-tuning process"""
        self.logger.info("Starting fine-tuning process...")
        
        # Validate configuration
        self.validate_config()
        
        # Load model and tokenizer
        self.load_model_and_tokenizer()
        
        # Tokenize datasets
        """
        self.logger.info("Tokenizing datasets...")
        train_dataset = train_dataset.map(
            self.tokenize_function,
            batched=True,
            remove_columns=train_dataset.column_names,
            load_from_cache_file=False,
            num_proc=1
        )
        
        
        eval_dataset = eval_dataset.map(
            self.tokenize_function,
            batched=True,
            remove_columns=eval_dataset.column_names
        )
        
        """
        
        # Check if pre-tokenized datasets exist
        train_path = "training/tokenized_dataset/train"
        val_path = "training/tokenized_dataset/val"
        
        if not Path(train_path).exists() or not Path(val_path).exists():
            self.logger.error("Pre-tokenized datasets not found!")
            self.logger.info("Please run the data preprocessing script first to create tokenized datasets")
            raise FileNotFoundError("Pre-tokenized datasets not found. Run preprocessing first.")
        
        self.logger.info("Loading pre-tokenized datasets...")
        train_dataset = load_from_disk(train_path)
        eval_dataset = load_from_disk(val_path)
        self.logger.info(f"Loaded {len(train_dataset)} training samples and {len(eval_dataset)} validation samples")
        
        # Data collator
        data_collator = DataCollatorForLanguageModeling(
            tokenizer=self.tokenizer,
            mlm=False,
            return_tensors="pt",
            pad_to_multiple_of=8
        )
        
        # Training arguments
        training_args = TrainingArguments(
            output_dir=self.config.output_dir,
            overwrite_output_dir=True,
            num_train_epochs=self.config.num_epochs,
            per_device_train_batch_size=self.config.batch_size,
            per_device_eval_batch_size=self.config.batch_size,
            gradient_accumulation_steps=self.config.gradient_accumulation_steps,
            learning_rate=self.config.learning_rate,
            warmup_steps=self.config.warmup_steps,
            logging_steps=self.config.logging_steps,
            save_steps=self.config.save_steps,
            eval_steps=self.config.eval_steps,
            eval_strategy="steps",   
            save_strategy="steps",
            load_best_model_at_end=True,
            metric_for_best_model="eval_loss",
            greater_is_better=False,
            report_to="wandb" if "WANDB_API_KEY" in os.environ else None,
            run_name=f"storyforge-phi3-{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            dataloader_pin_memory=False,
            fp16=False,  # Disable fp16 to avoid cache issues
            remove_unused_columns=False,
        )
        
        # Initialize trainer
        trainer = Trainer(
            model=self.model,
            args=training_args,
            train_dataset=train_dataset,
            eval_dataset=eval_dataset,
            tokenizer=self.tokenizer,
            data_collator=data_collator,
            callbacks=[EarlyStoppingCallback(early_stopping_patience=3)]
        )
        
        if dry_run:
            self.logger.info("Dry run enabled — skipping actual training.")
            self.logger.info("Configuration, datasets, and trainer initialized successfully.")
            return trainer  # Return trainer for inspection/testing
        
        # Start training
        self.logger.info("Beginning training...")
        trainer.train()
        
        # Save the final model
        self.logger.info("Saving final model...")
        trainer.save_model()
        self.tokenizer.save_pretrained(self.config.output_dir)
        
        # Save training metrics
        self.save_training_metrics(trainer)
        
        self.logger.info("Training completed successfully!")

        def save_model(self, trainer):
            """Save the final model"""
            self.logger.info("Saving final model...")
            trainer.save_model()
            self.tokenizer.save_pretrained(self.config.output_dir)

    def save_training_metrics(self, trainer):
        """Save training metrics and configuration"""
        try:
            # Get the last log entry safely
            log_history = trainer.state.log_history
            if log_history:
                final_train_loss = log_history[-1].get("train_loss", 0)
                final_eval_loss = log_history[-1].get("eval_loss", 0)
            else:
                final_train_loss = 0
                final_eval_loss = 0
                self.logger.warning("No training logs found for metrics")
            
            metrics = {
                "final_train_loss": final_train_loss,
                "final_eval_loss": final_eval_loss,
                "total_steps": trainer.state.global_step,
                "config": {
                    "model_name": self.config.model_name,
                    "learning_rate": self.config.learning_rate,
                    "batch_size": self.config.batch_size,
                    "num_epochs": self.config.num_epochs,
                    "use_lora": self.config.use_lora,
                    "max_length": self.config.max_length
                },
                "training_completed": datetime.now().isoformat()
            }
            
            metrics_path = Path(self.config.output_dir) / "training_metrics.json"
            with open(metrics_path, 'w') as f:
                json.dump(metrics, f, indent=2)
            
            self.logger.info(f"Training metrics saved to {metrics_path}")
        except Exception as e:
            self.logger.error(f"Failed to save training metrics: {e}")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Run a short training test with minimal data and steps")
    args = parser.parse_args()

    print("StoryForge Model Fine-Tuning")
    print("=" * 50)

    config = ModelConfig()

    if torch.cuda.is_available():
        print(f"CUDA available: {torch.cuda.get_device_name()}")
        print(f"GPU Memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.1f} GB")
    else:
        print("CUDA not available. Training will be slower on CPU.")
        config.batch_size = 1
        config.gradient_accumulation_steps = 8

    trainer = StoryForgeTrainer(config)

    try:
        trainer.start_training(dry_run=args.dry_run)
        if args.dry_run:
            print("\nDry run finished successfully")
        else:
            print("\nFine-tuning completed successfully")
            print(f"Model saved to: {config.output_dir}")
    except Exception as e:
        print(f"Training failed: {e}")
        raise

if __name__ == "__main__":
    main() 
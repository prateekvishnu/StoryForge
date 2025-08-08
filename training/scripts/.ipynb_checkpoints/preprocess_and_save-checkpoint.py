# preprocess_and_save.py
from datasets import Dataset
import json
from transformers import AutoTokenizer
from pathlib import Path
import torch

MODEL_NAME = "microsoft/Phi-3.5-mini-instruct"
DATA_PATH = "training/processed_data.json"
OUTPUT_DIR = "training/tokenized_dataset"

def format_training_text(story: str, metadata: dict) -> str:
    age_group = metadata.get('age_group', '7-10')
    genre = metadata.get('genre', 'adventure')
    return f"""<|system|>
You are a helpful AI assistant that creates engaging, age-appropriate stories for children aged {age_group}. Your stories should be safe, educational, and entertaining.
<|end|>
<|user|>
Create a {genre} story suitable for children aged {age_group}.
<|end|>
<|assistant|>
{story.strip()}
<|end|>"""

def format_prompt_text(prompt: str, metadata: dict) -> str:
    return f"""<|system|>
You are a helpful AI assistant that creates engaging, age-appropriate stories for children. Always ensure content is safe and suitable for young readers.
<|end|>
<|user|>
{prompt.strip()}
<|end|>
<|assistant|>
Once upon a time, there was a magical adventure waiting to unfold...
<|end|>"""

def preprocess_and_save():
    print("📦 Preprocessing and tokenizing training data...")
    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)

    training_texts = []

    if 'stories' in data['data']:
        for doc, metadata in zip(data['data']['stories']['documents'], data['data']['stories']['metadatas']):
            if len(doc.strip()) > 50:
                training_texts.append(format_training_text(doc, metadata))

    if 'prompts' in data['data']:
        for doc, metadata in zip(data['data']['prompts']['documents'], data['data']['prompts']['metadatas']):
            if len(doc.strip()) > 20:
                training_texts.append(format_prompt_text(doc, metadata))

    dataset = Dataset.from_dict({"text": training_texts})
    train_val = dataset.train_test_split(test_size=0.1, seed=42)

    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, trust_remote_code=True)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    def tokenize_function(examples):
        return tokenizer(
            examples["text"],
            truncation=True,
            padding=False,
            max_length=1024,
        )

    print("✏️ Tokenizing...")
    train_tokenized = train_val["train"].map(tokenize_function, batched=True, num_proc=1, remove_columns=["text"])
    val_tokenized = train_val["test"].map(tokenize_function, batched=True, num_proc=1, remove_columns=["text"])

    Path(OUTPUT_DIR).mkdir(parents=True, exist_ok=True)
    train_tokenized.save_to_disk(f"{OUTPUT_DIR}/train")
    val_tokenized.save_to_disk(f"{OUTPUT_DIR}/val")

    print("✅ Tokenized datasets saved to disk!")

if __name__ == "__main__":
    preprocess_and_save()

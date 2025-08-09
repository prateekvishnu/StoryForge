# StoryForge Custom Model Training

This directory contains all the tools and scripts needed to fine-tune a custom 3.7B parameter model (Phi-3.5 Mini) specifically for children's story generation.

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   pip install -r training/requirements.txt
   ```

2. **Prepare Training Data**
   - Add your datasets to the `training-datasets/` folder
   - Supported formats: JSON, TXT, CSV
   ```bash
   python training/scripts/setup_vector_db.py
   ```

3. **Start Fine-Tuning**
   ```bash
   python training/scripts/fine_tune_model.py
   ```

4. **Test Your Model**
   ```bash
   python training/scripts/model_manager.py
   ```

## 📁 Directory Structure

```
training/
├── scripts/
│   ├── setup_vector_db.py      # Process datasets into vector database
│   ├── fine_tune_model.py      # Fine-tune the 3.7B model
│   └── model_manager.py        # Load and use the fine-tuned model
├── config/
│   └── training_config.yaml    # Training configuration
├── models/                     # Saved models go here
├── vector-db/                  # Vector database storage
├── logs/                       # Training logs
├── checkpoints/                # Training checkpoints
├── requirements.txt            # Python dependencies
└── README.md                   # This file
```

## 🔧 Configuration

Edit `training/config/training_config.yaml` to customize:

- **Model**: Choose base model (default: Phi-3.5 Mini 3.7B)
- **Training**: Batch size, learning rate, epochs
- **LoRA**: Low-rank adaptation parameters for efficient training
- **Generation**: Story generation parameters
- **Safety**: Content filtering and age-appropriateness

## 📚 Training Data Format

### JSON Format
```json
[
  {
    "story": "Once upon a time, there was a brave little mouse...",
    "age_group": "7-10",
    "genre": "adventure"
  },
  {
    "prompt": "Write a story about friendship",
    "age_group": "9-12"
  }
]
```

### Text Format
```
Story 1: The Magic Forest
Once upon a time, in a magical forest...

Story 2: The Brave Knight
There once was a knight who...
```

### CSV Format
```csv
story,age_group,genre
"Once upon a time...","7-10","adventure"
"In a land far away...","9-12","fantasy"
```

## 🎯 Training Process

### 1. Data Preparation
The vector database script processes your training data:
- **Chunks large texts** into manageable pieces
- **Creates embeddings** for semantic search
- **Organizes by type**: stories, prompts, characters
- **Exports processed data** for training

### 2. Fine-Tuning
The training script uses LoRA (Low-Rank Adaptation):
- **Memory efficient**: Only trains a small subset of parameters
- **Fast training**: Reduces training time significantly
- **High quality**: Maintains model performance
- **Easy deployment**: Small adapter files

### 3. Model Management
The model manager handles:
- **Loading**: Both full and LoRA models
- **Generation**: Story creation with safety filters
- **Interactive stories**: Choose-your-adventure format
- **Testing**: Validate model performance

## ⚙️ Hardware Requirements

### Minimum (CPU Training)
- **RAM**: 16GB+
- **Storage**: 20GB free space
- **Time**: Several hours per epoch

### Recommended (GPU Training)
- **GPU**: 8GB+ VRAM (RTX 3070, RTX 4060 Ti, or better)
- **RAM**: 16GB+ system RAM
- **Storage**: 50GB+ free space
- **Time**: 30-60 minutes per epoch

### Optimal (High-End GPU)
- **GPU**: 16GB+ VRAM (RTX 4080, RTX 4090, or better)
- **RAM**: 32GB+ system RAM
- **Storage**: 100GB+ free space
- **Time**: 15-30 minutes per epoch

## 🔒 Safety Features

The training pipeline includes multiple safety layers:

1. **Content Filtering**: Removes inappropriate content
2. **Age Verification**: Ensures age-appropriate language
3. **Theme Validation**: Promotes positive, educational themes
4. **Output Monitoring**: Checks generated content quality

## 📊 Monitoring Training

### Weights & Biases (Recommended)
```bash
export WANDB_API_KEY=your_api_key
python training/scripts/fine_tune_model.py
```

### TensorBoard
```bash
tensorboard --logdir training/logs
```

### Local Logs
Check `training/logs/` for detailed training logs.

## 🚨 Troubleshooting

### Common Issues

**Out of Memory (OOM)**
```bash
# Reduce batch size in config
batch_size: 2
gradient_accumulation_steps: 8
```

**Slow Training**
```bash
# Enable mixed precision
mixed_precision: true
gradient_checkpointing: true
```

**Poor Quality Output**
```bash
# Increase training data quality
# Adjust generation parameters
# Extend training epochs
```

### Error Messages

**"CUDA out of memory"**
- Reduce `batch_size` to 1
- Increase `gradient_accumulation_steps` to 16
- Enable `gradient_checkpointing`

**"Model not found"**
- Ensure internet connection for downloading base model
- Check model name in configuration

**"No training data found"**
- Run `setup_vector_db.py` first
- Check `training-datasets/` folder has data files

## 🎯 Usage Examples

### Basic Story Generation
```python
from training.scripts.model_manager import StoryForgeModelManager

manager = StoryForgeModelManager()
manager.load_model()

story = manager.generate_story(
    prompt="A magical adventure in the forest",
    age_group="7-10",
    genre="fantasy"
)
print(story)
```

### Interactive Story
```python
interactive = manager.generate_interactive_story(
    prompt="A detective mystery for kids",
    age_group="9-12"
)

print(interactive["story"])
print("Choices:")
for i, choice in enumerate(interactive["choices"]):
    print(f"{i+1}. {choice}")
```

## 📈 Performance Metrics

After training, check these metrics:

- **Perplexity**: Lower is better (target: <5.0)
- **BLEU Score**: Higher is better (target: >0.3)
- **Safety Score**: Should be 100% for children's content
- **Age Appropriateness**: Validated by content filters

## 🤝 Contributing

To improve the training pipeline:

1. **Add new datasets** to `training-datasets/`
2. **Improve safety filters** in the scripts
3. **Optimize training parameters** in config
4. **Add new evaluation metrics**

## 📝 License

This training setup is part of the StoryForge project and follows the same licensing terms.

## 🔄 GGUF Conversion Status

⚠️ **In Progress**: The fine-tuned model is currently in Hugging Face format and needs to be converted to GGUF format for Ollama integration. 

**Current Status:**
- ✅ Model successfully fine-tuned and merged (Qwen2.5-0.5B-Instruct base)
- ✅ Merged model available at `training/models/storyforge-qwen-fine-tuned-merged/`
- ✅ Modelfile created for Ollama integration (`training/models/Modelfile.storyforge`)
- ⚠️ GGUF conversion encountering dependency conflicts with transformers/urllib3/accelerate
- 🔄 **Temporary Solution**: Application currently uses DeepSeek R1 models as fallback

**Next Steps:**
1. Resolve Python environment dependency conflicts
2. Complete GGUF conversion using llama.cpp
3. Import custom model into Ollama
4. Update application to use custom `storyforge-qwen-fine-tuned` model

**Alternative Approaches Being Explored:**
- Clean Python environment setup
- Docker-based conversion
- Pre-built GGUF conversion tools

## 🆘 Support

For issues with training:
1. Check the troubleshooting section above
2. Review logs in `training/logs/`
3. Ensure hardware meets minimum requirements
4. Verify all dependencies are installed correctly 
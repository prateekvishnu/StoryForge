from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel

# Paths
base_model_name = "Qwen/Qwen2.5-0.5B-Instruct"
adapter_path = "training/models/storyforge-qwen-fine-tuned"
merged_model_path = "training/models/storyforge-merged"

# Load base model + LoRA
base_model = AutoModelForCausalLM.from_pretrained(base_model_name, torch_dtype="auto", device_map="auto")
model = PeftModel.from_pretrained(base_model, adapter_path)

# Merge LoRA weights
model = model.merge_and_unload()

# Save merged model
model.save_pretrained(merged_model_path)
tokenizer = AutoTokenizer.from_pretrained(base_model_name)
tokenizer.save_pretrained(merged_model_path)


"""
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp
make

python3 convert-hf-to-gguf.py \
  --model training/models/storyforge-merged \
  --outfile storyforge.gguf \
  --outtype q4_K_M   # 4-bit quantization for smaller size


FROM ./storyforge.gguf
PARAMETER temperature 0.7
PARAMETER top_p 0.9
PARAMETER num_ctx 4096
TEMPLATE '''
{{ .System }}

{{ .Prompt }}
'''


ollama create storyforge -f Modelfile
or
ollama run storyforge


ollama run storyforge "Create a short adventure story for kids aged 7-10 about a space-traveling squirrel."
"""
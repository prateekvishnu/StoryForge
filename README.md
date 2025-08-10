# 🎨 StoryForge - AI-Powered Children's Story Creator

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5-blue)](https://mui.com/)
[![Ollama](https://img.shields.io/badge/Ollama-Local%20AI-green)](https://ollama.ai/)

> **Create amazing adventures with AI magic!** ✨

StoryForge is a modern, child-safe AI story generation platform that empowers young minds to create interactive adventures, mysteries, fantasies, and educational stories. Built with cutting-edge AI technology and designed with children's safety and creativity in mind.

## 🌟 Features

### 🎮 **Choose-Your-Adventure Stories**
- **Interactive storytelling** with branching narratives
- **200-300 word continuations** for each choice made
- **Unlimited story branches** based on user decisions
- **Real-time story progression** with seamless UI

### 👥 **Character Creation System**
- **Integrated character builder** within story creation
- **Multiple character roles**: Protagonist, Sidekick, Mentor, Villain, Helper
- **Character consistency** maintained across story branches
- **Visual character management** with add/remove functionality

### 🎯 **Customizable Story Generation**
- **5 Story Types**: Adventure, Mystery, Fantasy, Friendship, Educational
- **3 Age Groups**: 5-8, 9-12, 13-16 years (age-appropriate content)
- **5 Tone Options**: Exciting, Mysterious, Funny, Heartwarming, Educational
- **Custom Word Limits**: 100-3000 words with age-appropriate ranges
- **Custom Instructions**: Add educational facts, themes, or special requirements

### 🛡️ **Child Safety First**
- **Multi-layer content filtering** with balanced safety approach
- **Age-appropriate vocabulary** and themes
- **COPPA compliant** database design
- **No inappropriate content** generation
- **Parental oversight** capabilities

### 🤖 **AI Technology**
- **Custom Fine-Tuned Model** - Qwen2.5-0.5B specialized for children's stories
- **Local AI processing** with Ollama integration
- **Advanced prompt engineering** for consistent, quality output
- **Rate limiting** and connection pooling for stability
- **LoRA fine-tuning** on 3,685 children's stories for improved quality

### 🎨 **Modern UI/UX**
- **Material-UI design** with responsive layout
- **Intuitive story creation** with accordion-based organization
- **Real-time feedback** and loading states
- **Mobile-friendly** design for all devices
- **Accessibility features** built-in

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** and npm
- **Ollama** installed locally
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/prateekvishnu/StoryForge.git
   cd StoryForge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Ollama and load the custom model**
   ```bash
   # Install Ollama (if not already installed)
   curl -fsSL https://ollama.ai/install.sh | sh
   
   # Load the custom StoryForge model (already included in the repo)
   ollama create storyforge-qwen-fine-tuned -f training/models/Modelfile.storyforge
   ```

4. **Initialize the database**
   ```bash
   npm run db:init
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### Creating Your First Story

1. **Visit the Create Page** (`/create`)
2. **Enter your story prompt** - describe the adventure you want to create
3. **Select age group and story type** - choose appropriate settings
4. **Add characters** (optional) - create protagonists, sidekicks, villains
5. **Customize settings** - set tone, word limit, and special instructions
6. **Enable interactive mode** for choose-your-adventure stories
7. **Click "Create Story"** and watch the magic happen!

### Choose-Your-Adventure Experience

1. **Generate an interactive story** with choice points enabled
2. **Read the initial story segment** (200-300 words)
3. **Select from 3 choices** (A, B, or C) to continue the adventure
4. **Each choice generates a new 200-300 word continuation**
5. **Story branches infinitely** based on your decisions
6. **Track your adventure** with built-in story statistics

### Test the System

Visit `/test-adventure` to experience a pre-built choose-your-adventure story featuring Maya's Crystal Cave Adventure.

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14 with TypeScript
- **UI Framework**: Material-UI 5
- **AI Engine**: Ollama with custom StoryForge fine-tuned model
- **Database**: SQLite with better-sqlite3
- **Styling**: Material-UI theme system
- **State Management**: React hooks and context

### Project Structure
```
StoryForge/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API endpoints
│   │   │   ├── stories/       # Story generation APIs
│   │   │   └── test-db/       # Database testing
│   │   ├── create/            # Story creation page
│   │   ├── test-adventure/    # Interactive demo
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── story/            # Story-related components
│   │   └── layout/           # Layout components
│   ├── lib/                  # Utilities and services
│   │   ├── database/         # Database management
│   │   ├── ollama/          # AI client integration
│   │   └── middleware/       # API middleware
│   └── types/               # TypeScript definitions
├── memory-bank/             # Project documentation
├── scripts/                 # Database and utility scripts
├── training/                # AI model training pipeline
│   ├── scripts/            # Training and preprocessing scripts
│   ├── models/             # Fine-tuned models and checkpoints
│   ├── training-datasets/  # Children's story datasets
│   └── logs/               # Training logs and metrics
└── data/                   # SQLite database files
```

### API Endpoints

- **`POST /api/stories/generate`** - Generate initial stories with choices
- **`POST /api/stories/continue`** - Continue stories based on user choices
- **`GET /api/stories/generate`** - Health check for story generation service
- **`GET /api/test-db`** - Database connectivity test

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the project root:

```bash
# Database
DATABASE_URL="./data/storyforge.db"

# Ollama Configuration
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_MODEL="storyforge-qwen-fine-tuned:latest"

# Optional: API Keys for external services
# ANTHROPIC_API_KEY=your_key_here
# OPENAI_API_KEY=your_key_here
```

### AI Models
The application uses a custom fine-tuned model optimized for children's story generation:

#### **StoryForge Custom Model (Primary)**
- **Model Name**: `storyforge-qwen-fine-tuned:latest`
- **Base Model**: Qwen2.5-0.5B-Instruct (494M parameters)
- **Specialization**: Fine-tuned for children's stories on 3,685 curated stories
- **Training Details**:
  - Training Steps: 924 steps across 4 epochs
  - LoRA Configuration: r=16, alpha=32
  - Training Loss: 5.69 → Optimized for story generation
  - Training Date: August 8, 2025
- **Model Size**: 994 MB in Ollama
- **Integration**: Ready-to-use via Ollama with included Modelfile

## 🎓 Model Training

### Custom Model Development
StoryForge includes a complete training pipeline for fine-tuning language models specifically for children's story generation.

#### **Dataset**
- **3,685 high-quality children's stories** from classic fairy tale collections
- **Sources**: Andersen, Beatrix Potter, Brothers Grimm, Chinese Fairy Tales, and more
- **Preprocessing**: Stories formatted with age-appropriate prompts and safety guidelines
- **Validation Split**: 90% training, 10% validation

#### **Training Process**
```bash
# 1. Preprocess the dataset
python training/scripts/preprocess_and_save.py

# 2. Fine-tune the model
python training/scripts/fine_tune_model.py

# 3. Manage and deploy models
python training/scripts/model_manager.py
```

#### **Training Configuration**
- **Base Model**: Qwen/Qwen2.5-0.5B-Instruct (494M parameters)
- **Fine-tuning Method**: LoRA (Low-Rank Adaptation)
- **Training Steps**: 924 steps across 4 epochs
- **Batch Size**: 8 with gradient accumulation
- **Learning Rate**: 3e-4 with warmup
- **Hardware**: Optimized for NVIDIA A100 GPU

#### **Model Performance**
- **Training Loss**: Reduced to 5.69 (optimized for story generation)
- **Specialization**: Enhanced understanding of children's story structure
- **Safety**: Improved age-appropriate content generation
- **Speed**: Ultra-fast inference on consumer hardware

### **Ready-to-Use Model**
The fine-tuned model is already integrated and ready to use:
- **Model Name**: `storyforge-qwen-fine-tuned:latest`
- **Modelfile**: Included at `training/models/Modelfile.storyforge`
- **Size**: 994 MB in Ollama
- **Status**: ✅ Successfully tested and deployed

## 🧪 Testing

### Database Testing
```bash
npm run db:test
```

### Story Generation Testing
```bash
# Test story generation API with custom model
curl -X POST http://localhost:3000/api/stories/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"A brave explorer finds a treasure","ageGroup":"9-12","storyType":"adventure"}'
```

### Interactive Testing
Visit `/test-adventure` for a complete interactive demo.

## 🛡️ Safety Features

### Content Filtering
- **Pre-generation filtering** of inappropriate prompts
- **Post-generation analysis** of story content
- **Age-appropriate vocabulary** enforcement
- **Balanced safety approach** that allows creative storytelling

### Child Protection
- **COPPA compliant** data handling
- **No personal information** collection from children
- **Parental oversight** capabilities
- **Safe content generation** with multiple validation layers

## 🎨 Customization

### Story Templates
Located in `src/app/api/stories/generate/route.ts`, templates can be customized for:
- Different age groups (5-8, 9-12, 13-16)
- Various story types (Adventure, Mystery, Fantasy, etc.)
- Tone adjustments (Exciting, Funny, Educational, etc.)

### UI Theming
Material-UI theme configuration in `src/app/ClientLayout.tsx`:
- Color schemes
- Typography settings
- Component styling
- Responsive breakpoints

## 📊 Performance

### Optimization Features
- **Connection pooling** for AI requests
- **Rate limiting** to prevent abuse
- **Content caching** for improved response times
- **Efficient database** queries with SQLite
- **Responsive design** for all devices

### Monitoring
- **Request tracking** and logging
- **Error handling** with graceful fallbacks
- **Performance metrics** collection
- **Health check endpoints**

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use Material-UI components consistently
- Maintain child safety standards
- Add tests for new features
- Update documentation

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Ollama** for providing excellent local AI capabilities
- **Material-UI** for the beautiful component library
- **Next.js** team for the amazing React framework
- **DeepSeek** for the efficient language model
- **Open source community** for inspiration and tools

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/prateekvishnu/StoryForge/issues)
- **Discussions**: [GitHub Discussions](https://github.com/prateekvishnu/StoryForge/discussions)
- **Documentation**: Check the `memory-bank/` directory for detailed docs

---

**Made with ❤️ for young storytellers everywhere**

*StoryForge - Where imagination meets technology!* ✨

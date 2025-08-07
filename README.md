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
- **Local AI processing** with Ollama integration
- **DeepSeek 1.5B model** optimized for fast story generation
- **Advanced prompt engineering** for consistent, quality output
- **Rate limiting** and connection pooling for stability

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

3. **Set up Ollama and pull the model**
   ```bash
   # Install Ollama (if not already installed)
   curl -fsSL https://ollama.ai/install.sh | sh
   
   # Pull the DeepSeek model
   ollama pull deepseek-r1:1.5b
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
- **AI Engine**: Ollama with DeepSeek 1.5B model
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
OLLAMA_MODEL="deepseek-r1:1.5b"

# Optional: API Keys for external services
# ANTHROPIC_API_KEY=your_key_here
# OPENAI_API_KEY=your_key_here
```

### Ollama Models
The application supports multiple models:
- **DeepSeek R1 1.5B** (default) - Fast, efficient for story generation
- **Phi-3 3.8B** - Higher quality, slower generation
- **Custom models** - Configure via Ollama

## 🧪 Testing

### Database Testing
```bash
npm run db:test
```

### Story Generation Testing
```bash
# Test story generation API
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

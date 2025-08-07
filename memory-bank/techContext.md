# StoryForge Technical Context

## Technology Stack

### Frontend Framework
**Next.js 14+** - Selected for its comprehensive features supporting our requirements:
- **Server-Side Rendering (SSR)**: Improved performance and SEO for educational content
- **Static Site Generation (SSG)**: Fast loading for story content and templates
- **API Routes**: Integrated backend functionality without separate server setup
- **Image Optimization**: Built-in optimization for story illustrations and character images
- **File-based Routing**: Intuitive structure for age-specific content organization

### Database Technology
**SQLite** - Chosen for development and proof-of-concept phase:
- **Local Development**: Simplified setup and testing environment
- **Zero Configuration**: No database server setup required
- **File-based Storage**: Easy backup and migration capabilities
- **ACID Compliance**: Ensures data integrity for safety-critical content
- **Migration Path**: Can easily migrate to PostgreSQL or other databases for production

### AI Integration
**Ollama** - Local AI deployment for story generation:
- **Privacy Control**: All AI processing happens locally, protecting child data
- **Custom Models**: Ability to fine-tune models specifically for children's content
- **Offline Capability**: Reduced dependency on external services
- **Cost Control**: No per-request API costs during development and testing
- **Safety**: Local processing allows for custom safety implementations

### Image Generation
**Stable Diffusion API** - External service for visual content:
- **Child-Safe Parameters**: Configured for cartoon/illustration style only
- **Content Filtering**: Multiple safety layers for generated images
- **Quality Control**: Consistent visual style for story illustrations
- **Scalability**: Handles multiple concurrent image generation requests

### Development Environment

#### Required Dependencies
```json
{
  "next": "^14.0.0",
  "react": "^18.0.0",
  "sqlite3": "^5.1.0",
  "prisma": "^5.0.0",
  "axios": "^1.5.0",
  "bcrypt": "^5.1.0",
  "jsonwebtoken": "^9.0.0"
}
```

#### Development Tools
- **TypeScript**: Type safety for child safety-critical code
- **Prisma**: Database ORM for safe data handling
- **ESLint**: Code quality and safety pattern enforcement
- **Prettier**: Consistent code formatting
- **Jest**: Testing framework for safety feature validation

### Technical Constraints

#### Performance Requirements
- **Story Loading**: < 3 seconds for complete story with images
- **AI Response Time**: < 5 seconds for story suggestions and assistance
- **Image Generation**: < 10 seconds per scene illustration
- **Concurrent Users**: Support for 20-30 simultaneous users (classroom environment)
- **Story Complexity**: Handle stories up to 50 decision points

#### Safety Constraints
- **COPPA Compliance**: All data handling must meet COPPA requirements
- **Content Filtering**: Multi-layer filtering for all AI-generated content
- **Audit Logging**: Complete audit trail for all user actions
- **Parental Controls**: Comprehensive oversight and approval mechanisms
- **Age Verification**: Reliable age checking and content adaptation

#### Infrastructure Constraints
- **Local Development**: Primary development and testing environment
- **Minimal External Dependencies**: Reduced reliance on external services
- **Migration Ready**: Architecture supports future cloud deployment
- **Cost Effective**: Low operational costs for proof-of-concept phase

### API Integrations

#### Ollama Local API
```javascript
const OLLAMA_BASE_URL = 'http://localhost:11434';
const MODEL_NAME = 'children-stories-3b'; // Custom fine-tuned model
```

#### Stable Diffusion API
```javascript
const STABLE_DIFFUSION_CONFIG = {
  style: 'cartoon, illustration, child-friendly',
  negative_prompt: 'realistic, scary, violent, inappropriate',
  safety_filter: 'strict'
};
```

### Security Configuration

#### Authentication Setup
- **JWT Tokens**: Secure session management
- **Bcrypt Hashing**: Password security for parent accounts
- **CORS Configuration**: Restricted to authorized domains only
- **Rate Limiting**: Prevents abuse of AI and image generation APIs

#### Data Protection
- **Encryption at Rest**: SQLite database encryption
- **HTTPS Only**: All communications encrypted
- **Input Sanitization**: All user inputs validated and sanitized
- **SQL Injection Prevention**: Parameterized queries only

### Development Setup Requirements

#### System Requirements
- **Node.js**: Version 18+ for optimal Next.js performance
- **Python**: Version 3.8+ for Ollama integration
- **Git**: Version control and collaboration
- **Docker** (Optional): Containerized development environment

#### Environment Variables
```bash
# AI Configuration
OLLAMA_BASE_URL=http://localhost:11434
STABLE_DIFFUSION_API_KEY=your_api_key_here

# Database
DATABASE_URL=file:./dev.db

# Authentication
JWT_SECRET=your_jwt_secret_here
BCRYPT_ROUNDS=12

# Safety
CONTENT_FILTER_STRICT_MODE=true
PARENT_APPROVAL_REQUIRED=true
```

### Deployment Considerations

#### Development Phase
- **Local SQLite**: File-based database for development
- **Local Ollama**: AI processing on development machine
- **Environment Isolation**: Separate development and testing environments

#### Future Production Considerations
- **Database Migration**: SQLite → PostgreSQL for scalability
- **AI Deployment**: Ollama → Cloud-based AI services with safety guarantees
- **CDN Integration**: Image and static content delivery optimization
- **Monitoring**: Comprehensive logging and monitoring for safety compliance

This technical foundation ensures StoryForge can deliver on its safety and educational goals while maintaining scalability and maintainability.
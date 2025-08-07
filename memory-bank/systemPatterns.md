# StoryForge System Patterns

## System Architecture Overview

### Multi-Layer Safety Architecture
The core architectural pattern for StoryForge is **Safety-First Layered Design**, where every component has built-in safety measures:

```
User Interface Layer (Child-Friendly)
    ↓
Safety Validation Layer (Multi-Filter)
    ↓
AI Processing Layer (Age-Appropriate)
    ↓
Content Storage Layer (Auditable)
    ↓
Parental Oversight Layer (Transparent)
```

### Key Technical Patterns

#### 1. Age-Adaptive Component Pattern
Components automatically adjust complexity and features based on user age:

```typescript
interface AgeAdaptiveProps {
  userAge: number;
  content: StoryContent;
}

// Components render differently for 7-10 vs 11-16 age groups
```

#### 2. Safety-First Data Flow
All user-generated content flows through multiple validation layers:

```
User Input → Content Filter → AI Processing → Safety Review → Storage
```

#### 3. Parental Control Integration
Every feature includes parental visibility and control mechanisms:

```
Child Action → Parent Notification → Approval Required → Action Execution
```

## Component Relationships

### Frontend Architecture (Next.js)
- **Page Components**: Age-adaptive layouts for different user types
- **Story Components**: Interactive story creation and reading interfaces  
- **Safety Components**: Content filtering and parental control interfaces
- **AI Components**: Story assistance and image generation interfaces

### Backend Architecture (API Routes)
- **Authentication Routes**: COPPA-compliant user management
- **Story Routes**: Content creation, editing, and sharing
- **Safety Routes**: Content moderation and filtering
- **AI Routes**: Ollama integration and Stable Diffusion API calls

### Database Schema Patterns
- **User Tables**: Separate child and parent account structures
- **Content Tables**: Stories with safety metadata and approval status
- **Safety Tables**: Audit logs and content filtering history
- **AI Tables**: Generated content tracking and model interaction logs

## Design Patterns in Use

### 1. Guardian Pattern
Every child action has an associated guardian/parent approval mechanism:

```typescript
interface GuardedAction {
  childAction: Action;
  requiresApproval: boolean;
  parentNotification: NotificationConfig;
}
```

### 2. Content Filtering Pipeline
Multi-stage content validation using the Chain of Responsibility pattern:

```typescript
class ContentFilter {
  private filters: Filter[] = [
    new AIContentFilter(),
    new KeywordFilter(),
    new ImageSafetyFilter(),
    new AgeAppropriatenessFilter()
  ];
}
```

### 3. Age-Responsive Factory
Components and features created based on user age group:

```typescript
class ComponentFactory {
  createStoryInterface(age: number): StoryInterface {
    return age <= 10 ? new SimpleStoryInterface() : new AdvancedStoryInterface();
  }
}
```

### 4. Audit Trail Pattern
All actions logged for safety and parental oversight:

```typescript
interface AuditableAction {
  userId: string;
  action: string;
  content?: string;
  timestamp: Date;
  safetyLevel: SafetyLevel;
}
```

## Data Flow Patterns

### Story Creation Flow
1. **Child Input** → Age validation → Content safety check
2. **AI Processing** → Children's literature model → Safety filtering
3. **Image Generation** → Stable Diffusion → Child-safe filtering
4. **Parent Review** → Approval required → Publication/Storage

### Authentication Flow
1. **Age Declaration** → Parent email verification → Account creation
2. **Child Profile** → Parental controls setup → Safety preferences
3. **Session Management** → Activity monitoring → Automatic safety checks

### Content Moderation Flow
1. **Real-time Filtering** → AI content analysis → Human review queue
2. **Parent Reporting** → Safety team review → Action taken
3. **Continuous Learning** → Filter improvement → Model updates

## Integration Patterns

### AI Integration (Ollama)
- **Local Deployment**: Ensures content privacy and control
- **Model Fine-tuning**: Children's literature dataset for appropriate content
- **Safety Wrappers**: Additional filtering around AI responses

### Image Generation (Stable Diffusion)
- **API Integration**: External service with safety parameters
- **Content Filtering**: Multi-layer image safety validation
- **Style Enforcement**: Cartoon/illustration style for child-appropriate visuals

### Database Integration (SQLite)
- **Local Storage**: Development and testing with local database
- **Schema Design**: Optimized for safety auditing and parental oversight
- **Migration Ready**: Structure allows future cloud database migration

## Security and Safety Patterns

### Zero-Trust Child Safety
- Every piece of content validated regardless of source
- No assumptions about AI-generated content safety
- Continuous monitoring and validation

### Parental Transparency
- All child activities visible to parents
- Clear audit trails for all actions
- Immediate notification of any safety concerns

### Privacy-by-Design
- Minimal data collection compliant with COPPA
- Local processing where possible
- Clear data retention and deletion policies

These patterns ensure StoryForge maintains its safety-first approach while delivering engaging functionality for children and peace of mind for parents.
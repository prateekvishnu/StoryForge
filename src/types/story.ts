// Story template and visual planning types for StoryForge

export interface StoryNode {
  id: string;
  type: 'start' | 'story' | 'decision' | 'ending';
  title: string;
  content: string;
  position: { x: number; y: number };
  connections: string[]; // IDs of connected nodes
  mediaPlaceholders: {
    images: string[];
    audio?: string;
  };
  metadata: {
    wordCount: number;
    estimatedReadingTime: number;
    ageAppropriate: boolean;
  };
}

export interface DecisionNode extends StoryNode {
  type: 'decision';
  choices: {
    id: string;
    text: string;
    targetNodeId: string;
    consequence?: string;
  }[];
}

export interface StoryTemplate {
  id: string;
  name: string;
  description: string;
  category: 'fantasy' | 'adventure' | 'mystery' | 'friendship' | 'educational';
  ageGroup: '7-10' | '11-16';
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number; // in minutes
  decisionPoints: number;
  nodes: StoryNode[];
  connections: StoryConnection[];
  thumbnail?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface StoryConnection {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  condition?: string;
  label?: string;
}

export interface StoryProject {
  id: string;
  name: string;
  description: string;
  templateId?: string;
  ageGroup: '7-10' | '11-16';
  category: 'fantasy' | 'adventure' | 'mystery' | 'friendship' | 'educational';
  nodes: StoryNode[];
  connections: StoryConnection[];
  currentProgress: {
    completedNodes: string[];
    totalNodes: number;
    percentComplete: number;
  };
  settings: {
    allowBranching: boolean;
    maxDecisionPoints: number;
    targetWordCount: number;
    includeImages: boolean;
    includeAudio: boolean;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    lastEditedBy: string;
    version: number;
    published: boolean;
  };
}

// Visual story planning types
export interface StoryCanvas {
  id: string;
  projectId: string;
  zoom: number;
  pan: { x: number; y: number };
  gridSize: number;
  snapToGrid: boolean;
  selectedNodeIds: string[];
  clipboard: StoryNode[];
}

export interface StoryFlowState {
  canvas: StoryCanvas;
  nodes: StoryNode[];
  connections: StoryConnection[];
  selectedElements: {
    nodes: string[];
    connections: string[];
  };
  history: {
    past: StoryFlowState[];
    present: StoryFlowState;
    future: StoryFlowState[];
  };
}

// Predefined story templates
export interface TemplateLibrary {
  simple: StoryTemplate[]; // 7-10 age group
  complex: StoryTemplate[]; // 11-16 age group
}

// Story validation
export interface StoryValidation {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: string[];
}

export interface ValidationError {
  type: 'orphaned_node' | 'circular_reference' | 'missing_start' | 'missing_ending' | 'broken_connection';
  nodeId?: string;
  connectionId?: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationWarning {
  type: 'too_many_decisions' | 'unbalanced_paths' | 'content_length' | 'age_appropriateness';
  nodeId?: string;
  message: string;
  suggestion: string;
}

// Story export/import
export interface StoryExport {
  version: string;
  project: StoryProject;
  template?: StoryTemplate;
  exportDate: Date;
  format: 'json' | 'markdown' | 'pdf' | 'interactive';
}

// Predefined templates data
export const STORY_TEMPLATES: TemplateLibrary = {
  simple: [
    {
      id: 'simple-treasure-hunt',
      name: 'Treasure Hunt Adventure',
      description: 'A simple treasure hunting story with 3 decision points',
      category: 'adventure',
      ageGroup: '7-10',
      difficulty: 'easy',
      estimatedTime: 10,
      decisionPoints: 3,
      nodes: [
        {
          id: 'start',
          type: 'start',
          title: 'The Mysterious Map',
          content: 'You find an old treasure map in your grandmother\'s attic. The map shows three different paths to a hidden treasure. Which path will you choose?',
          position: { x: 100, y: 100 },
          connections: ['decision1'],
          mediaPlaceholders: { images: ['treasure-map.jpg'] },
          metadata: { wordCount: 35, estimatedReadingTime: 1, ageAppropriate: true }
        },
        {
          id: 'decision1',
          type: 'decision',
          title: 'Choose Your Path',
          content: 'The map shows three paths marked with different symbols.',
          position: { x: 300, y: 100 },
          connections: ['forest-path', 'cave-path', 'river-path'],
          mediaPlaceholders: { images: ['three-paths.jpg'] },
          metadata: { wordCount: 12, estimatedReadingTime: 1, ageAppropriate: true },
          choices: [
            { id: 'choice1', text: 'Follow the forest path with trees', targetNodeId: 'forest-path' },
            { id: 'choice2', text: 'Take the cave path through mountains', targetNodeId: 'cave-path' },
            { id: 'choice3', text: 'Go along the river path', targetNodeId: 'river-path' }
          ]
        } as DecisionNode,
        {
          id: 'forest-path',
          type: 'story',
          title: 'Through the Enchanted Forest',
          content: 'You walk through a beautiful forest filled with singing birds and colorful flowers. Suddenly, you meet a friendly squirrel who offers to help you find the treasure.',
          position: { x: 200, y: 300 },
          connections: ['treasure-found'],
          mediaPlaceholders: { images: ['forest-squirrel.jpg'] },
          metadata: { wordCount: 32, estimatedReadingTime: 1, ageAppropriate: true }
        },
        {
          id: 'cave-path',
          type: 'story',
          title: 'The Crystal Cave',
          content: 'You enter a sparkling cave filled with beautiful crystals that light up the way. Deep inside, you discover the treasure chest glowing with magical light.',
          position: { x: 300, y: 300 },
          connections: ['treasure-found'],
          mediaPlaceholders: { images: ['crystal-cave.jpg'] },
          metadata: { wordCount: 28, estimatedReadingTime: 1, ageAppropriate: true }
        },
        {
          id: 'river-path',
          type: 'story',
          title: 'Along the Babbling Brook',
          content: 'You follow the gentle river and meet a wise old turtle who tells you riddles. Solving the riddles leads you straight to the hidden treasure!',
          position: { x: 400, y: 300 },
          connections: ['treasure-found'],
          mediaPlaceholders: { images: ['river-turtle.jpg'] },
          metadata: { wordCount: 28, estimatedReadingTime: 1, ageAppropriate: true }
        },
        {
          id: 'treasure-found',
          type: 'ending',
          title: 'Treasure Found!',
          content: 'Congratulations! You found the treasure chest filled with golden coins and precious gems. Your adventure was a great success, and you learned that being brave and making good choices leads to wonderful discoveries!',
          position: { x: 300, y: 500 },
          connections: [],
          mediaPlaceholders: { images: ['treasure-chest.jpg'] },
          metadata: { wordCount: 38, estimatedReadingTime: 1, ageAppropriate: true }
        }
      ],
      connections: [
        { id: 'conn1', fromNodeId: 'start', toNodeId: 'decision1' },
        { id: 'conn2', fromNodeId: 'decision1', toNodeId: 'forest-path', condition: 'choice1' },
        { id: 'conn3', fromNodeId: 'decision1', toNodeId: 'cave-path', condition: 'choice2' },
        { id: 'conn4', fromNodeId: 'decision1', toNodeId: 'river-path', condition: 'choice3' },
        { id: 'conn5', fromNodeId: 'forest-path', toNodeId: 'treasure-found' },
        { id: 'conn6', fromNodeId: 'cave-path', toNodeId: 'treasure-found' },
        { id: 'conn7', fromNodeId: 'river-path', toNodeId: 'treasure-found' }
      ],
      thumbnail: 'treasure-hunt-thumb.jpg',
      tags: ['treasure', 'adventure', 'choices', 'animals'],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 'simple-magic-garden',
      name: 'The Magic Garden',
      description: 'Help magical creatures in a enchanted garden',
      category: 'fantasy',
      ageGroup: '7-10',
      difficulty: 'easy',
      estimatedTime: 12,
      decisionPoints: 4,
      nodes: [
        {
          id: 'start',
          type: 'start',
          title: 'The Secret Garden Gate',
          content: 'You discover a hidden gate covered in glowing vines. As you push it open, you enter a magical garden where flowers sing and butterflies sparkle like jewels.',
          position: { x: 100, y: 100 },
          connections: ['meet-fairy'],
          mediaPlaceholders: { images: ['magic-gate.jpg'] },
          metadata: { wordCount: 34, estimatedReadingTime: 1, ageAppropriate: true }
        },
        {
          id: 'meet-fairy',
          type: 'story',
          title: 'The Garden Fairy',
          content: 'A tiny fairy with rainbow wings flies up to you. "Welcome to our garden!" she says. "We need your help to solve a problem. Our magic flowers are losing their colors!"',
          position: { x: 300, y: 100 },
          connections: ['decision1'],
          mediaPlaceholders: { images: ['rainbow-fairy.jpg'] },
          metadata: { wordCount: 35, estimatedReadingTime: 1, ageAppropriate: true }
        },
        {
          id: 'decision1',
          type: 'decision',
          title: 'How Will You Help?',
          content: 'The fairy explains that you can help in different ways.',
          position: { x: 300, y: 250 },
          connections: ['water-flowers', 'sing-to-flowers', 'find-magic-seeds'],
          mediaPlaceholders: { images: ['helping-choices.jpg'] },
          metadata: { wordCount: 12, estimatedReadingTime: 1, ageAppropriate: true },
          choices: [
            { id: 'choice1', text: 'Water the flowers with magic dewdrops', targetNodeId: 'water-flowers' },
            { id: 'choice2', text: 'Sing a happy song to the flowers', targetNodeId: 'sing-to-flowers' },
            { id: 'choice3', text: 'Search for magic seeds', targetNodeId: 'find-magic-seeds' }
          ]
        } as DecisionNode,
        {
          id: 'water-flowers',
          type: 'ending',
          title: 'Magic Dewdrops',
          content: 'You collect sparkling dewdrops and gently water each flower. Instantly, the flowers burst into brilliant colors! The fairy claps her hands with joy and grants you a magical flower crown as a thank-you gift.',
          position: { x: 100, y: 400 },
          connections: [],
          mediaPlaceholders: { images: ['colorful-flowers.jpg'] },
          metadata: { wordCount: 42, estimatedReadingTime: 1, ageAppropriate: true }
        },
        {
          id: 'sing-to-flowers',
          type: 'ending',
          title: 'The Song of Colors',
          content: 'You sing a beautiful melody about rainbows and sunshine. The flowers begin to glow and their colors return brighter than ever! All the garden creatures join in your song, creating a magical chorus.',
          position: { x: 300, y: 400 },
          connections: [],
          mediaPlaceholders: { images: ['singing-garden.jpg'] },
          metadata: { wordCount: 38, estimatedReadingTime: 1, ageAppropriate: true }
        },
        {
          id: 'find-magic-seeds',
          type: 'ending',
          title: 'The Golden Seeds',
          content: 'You search carefully and find golden seeds hidden under mushrooms. When you plant them, new rainbow flowers bloom instantly! The garden becomes more beautiful than ever, and you become the honorary Garden Guardian.',
          position: { x: 500, y: 400 },
          connections: [],
          mediaPlaceholders: { images: ['golden-seeds.jpg'] },
          metadata: { wordCount: 40, estimatedReadingTime: 1, ageAppropriate: true }
        }
      ],
      connections: [
        { id: 'conn1', fromNodeId: 'start', toNodeId: 'meet-fairy' },
        { id: 'conn2', fromNodeId: 'meet-fairy', toNodeId: 'decision1' },
        { id: 'conn3', fromNodeId: 'decision1', toNodeId: 'water-flowers', condition: 'choice1' },
        { id: 'conn4', fromNodeId: 'decision1', toNodeId: 'sing-to-flowers', condition: 'choice2' },
        { id: 'conn5', fromNodeId: 'decision1', toNodeId: 'find-magic-seeds', condition: 'choice3' }
      ],
      thumbnail: 'magic-garden-thumb.jpg',
      tags: ['magic', 'garden', 'fairy', 'helping', 'colors'],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  ],
  complex: [
    {
      id: 'complex-mystery-school',
      name: 'The Mystery of Riverside Academy',
      description: 'Solve a complex mystery at a boarding school with multiple suspects and clues',
      category: 'mystery',
      ageGroup: '11-16',
      difficulty: 'medium',
      estimatedTime: 25,
      decisionPoints: 7,
      nodes: [
        {
          id: 'start',
          type: 'start',
          title: 'A Strange Disappearance',
          content: 'You\'re a new student at Riverside Academy when the school\'s prized trophy mysteriously vanishes from the locked display case. The headmaster asks for your help investigating, as you have a reputation for solving puzzles. Three main suspects emerge from initial questioning.',
          position: { x: 100, y: 100 },
          connections: ['investigation-start'],
          mediaPlaceholders: { images: ['school-hallway.jpg'] },
          metadata: { wordCount: 52, estimatedReadingTime: 2, ageAppropriate: true }
        },
        {
          id: 'investigation-start',
          type: 'decision',
          title: 'Where to Begin?',
          content: 'You have limited time before classes resume. You need to choose your investigation strategy carefully.',
          position: { x: 300, y: 100 },
          connections: ['interview-suspects', 'examine-scene', 'research-history'],
          mediaPlaceholders: { images: ['detective-tools.jpg'] },
          metadata: { wordCount: 22, estimatedReadingTime: 1, ageAppropriate: true },
          choices: [
            { id: 'choice1', text: 'Interview the three main suspects first', targetNodeId: 'interview-suspects' },
            { id: 'choice2', text: 'Examine the crime scene for physical evidence', targetNodeId: 'examine-scene' },
            { id: 'choice3', text: 'Research the trophy\'s history in the library', targetNodeId: 'research-history' }
          ]
        } as DecisionNode,
        // Additional nodes would be defined here for the complex story...
      ],
      connections: [
        { id: 'conn1', fromNodeId: 'start', toNodeId: 'investigation-start' },
        // Additional connections...
      ],
      thumbnail: 'mystery-school-thumb.jpg',
      tags: ['mystery', 'school', 'detective', 'clues', 'investigation'],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  ]
};

// Story node creation helpers
export const NODE_TYPES = {
  START: 'start',
  STORY: 'story',
  DECISION: 'decision',
  ENDING: 'ending'
} as const;

export const STORY_CATEGORIES = {
  FANTASY: 'fantasy',
  ADVENTURE: 'adventure',
  MYSTERY: 'mystery',
  FRIENDSHIP: 'friendship',
  EDUCATIONAL: 'educational'
} as const;

export const AGE_GROUPS = {
  SIMPLE: '7-10',
  COMPLEX: '11-16'
} as const; 
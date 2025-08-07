// Character types for the StoryForge character builder

export interface BaseCharacter {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  ageGroup: '7-10' | '11-16';
}

// Simple attributes for ages 7-10
export interface SimpleCharacterAttributes {
  appearance: {
    hairColor: string;
    eyeColor: string;
    skinTone: string;
    height: 'short' | 'medium' | 'tall';
    clothing: string[];
    accessories: string[];
  };
  personality: {
    likes: string[];
    dislikes: string[];
    favoriteActivity: string;
    mood: 'happy' | 'curious' | 'brave' | 'kind' | 'playful';
  };
  role: 'hero' | 'friend' | 'helper' | 'pet' | 'family';
}

// Complex attributes for ages 11-16
export interface ComplexCharacterAttributes {
  appearance: {
    hairColor: string;
    hairStyle: string;
    eyeColor: string;
    skinTone: string;
    height: 'short' | 'medium' | 'tall';
    build: 'slim' | 'average' | 'athletic' | 'sturdy';
    clothing: string[];
    accessories: string[];
    distinctiveFeatures: string[];
  };
  personality: {
    traits: string[];
    strengths: string[];
    weaknesses: string[];
    fears: string[];
    motivations: string[];
    mood: 'confident' | 'curious' | 'determined' | 'compassionate' | 'adventurous' | 'thoughtful';
  };
  background: {
    hometown: string;
    family: string;
    education: string;
    hobbies: string[];
    achievements: string[];
  };
  role: 'protagonist' | 'sidekick' | 'mentor' | 'rival' | 'ally' | 'guardian';
  goals: {
    shortTerm: string[];
    longTerm: string[];
    dreams: string[];
  };
}

export interface SimpleCharacter extends BaseCharacter {
  ageGroup: '7-10';
  attributes: SimpleCharacterAttributes;
}

export interface ComplexCharacter extends BaseCharacter {
  ageGroup: '11-16';
  attributes: ComplexCharacterAttributes;
}

export type Character = SimpleCharacter | ComplexCharacter;

// Character templates for quick start
export interface CharacterTemplate {
  id: string;
  name: string;
  description: string;
  ageGroup: '7-10' | '11-16';
  category: 'fantasy' | 'adventure' | 'mystery' | 'friendship' | 'educational';
  previewImage?: string;
  attributes: SimpleCharacterAttributes | ComplexCharacterAttributes;
}

// Drag and drop types
export interface DraggableItem {
  id: string;
  type: 'appearance' | 'personality' | 'background' | 'role' | 'goals';
  category: string;
  value: string;
  icon?: string;
  color?: string;
}

export interface DropZone {
  id: string;
  accepts: string[];
  items: DraggableItem[];
}

// Character builder state
export interface CharacterBuilderState {
  currentCharacter: Character | null;
  selectedAgeGroup: '7-10' | '11-16';
  availableItems: DraggableItem[];
  templates: CharacterTemplate[];
  savedCharacters: Character[];
  isEditing: boolean;
  previewMode: boolean;
}

// Character validation
export interface CharacterValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Character export/import
export interface CharacterExport {
  version: string;
  character: Character;
  exportDate: Date;
}

// Predefined options for character creation
export const APPEARANCE_OPTIONS = {
  hairColors: [
    { value: 'black', label: 'Black', color: '#2C1810' },
    { value: 'brown', label: 'Brown', color: '#8B4513' },
    { value: 'blonde', label: 'Blonde', color: '#F4E4BC' },
    { value: 'red', label: 'Red', color: '#CD5C5C' },
    { value: 'gray', label: 'Gray', color: '#A9A9A9' },
    { value: 'white', label: 'White', color: '#F5F5F5' },
  ],
  eyeColors: [
    { value: 'brown', label: 'Brown', color: '#8B4513' },
    { value: 'blue', label: 'Blue', color: '#4169E1' },
    { value: 'green', label: 'Green', color: '#228B22' },
    { value: 'hazel', label: 'Hazel', color: '#DAA520' },
    { value: 'gray', label: 'Gray', color: '#708090' },
  ],
  skinTones: [
    { value: 'light', label: 'Light', color: '#FDBCB4' },
    { value: 'medium', label: 'Medium', color: '#E1A95F' },
    { value: 'tan', label: 'Tan', color: '#C68642' },
    { value: 'dark', label: 'Dark', color: '#8D5524' },
    { value: 'deep', label: 'Deep', color: '#654321' },
  ],
};

export const PERSONALITY_OPTIONS = {
  simple: {
    moods: [
      { value: 'happy', label: 'Happy', emoji: '😊' },
      { value: 'curious', label: 'Curious', emoji: '🤔' },
      { value: 'brave', label: 'Brave', emoji: '💪' },
      { value: 'kind', label: 'Kind', emoji: '💕' },
      { value: 'playful', label: 'Playful', emoji: '🎈' },
    ],
    activities: [
      'Reading books', 'Playing games', 'Drawing pictures', 'Singing songs',
      'Building things', 'Exploring nature', 'Helping others', 'Solving puzzles',
      'Dancing', 'Collecting treasures', 'Making friends', 'Learning new things'
    ],
  },
  complex: {
    moods: [
      { value: 'confident', label: 'Confident', emoji: '😎' },
      { value: 'curious', label: 'Curious', emoji: '🤔' },
      { value: 'determined', label: 'Determined', emoji: '💪' },
      { value: 'compassionate', label: 'Compassionate', emoji: '💗' },
      { value: 'adventurous', label: 'Adventurous', emoji: '🗺️' },
      { value: 'thoughtful', label: 'Thoughtful', emoji: '🤓' },
    ],
    traits: [
      'Creative', 'Loyal', 'Independent', 'Empathetic', 'Analytical',
      'Optimistic', 'Resilient', 'Honest', 'Patient', 'Ambitious',
      'Humorous', 'Responsible', 'Intuitive', 'Diplomatic', 'Spontaneous'
    ],
  },
};

export const ROLE_OPTIONS = {
  simple: [
    { value: 'hero', label: 'Hero', description: 'The main character who saves the day' },
    { value: 'friend', label: 'Friend', description: 'A loyal companion on adventures' },
    { value: 'helper', label: 'Helper', description: 'Someone who assists others' },
    { value: 'pet', label: 'Pet', description: 'A beloved animal companion' },
    { value: 'family', label: 'Family', description: 'A family member who cares' },
  ],
  complex: [
    { value: 'protagonist', label: 'Protagonist', description: 'The main character driving the story' },
    { value: 'sidekick', label: 'Sidekick', description: 'A trusted companion and ally' },
    { value: 'mentor', label: 'Mentor', description: 'A wise guide who teaches important lessons' },
    { value: 'rival', label: 'Rival', description: 'A challenging opponent who pushes growth' },
    { value: 'ally', label: 'Ally', description: 'A helpful friend who provides support' },
    { value: 'guardian', label: 'Guardian', description: 'A protector who keeps others safe' },
  ],
}; 
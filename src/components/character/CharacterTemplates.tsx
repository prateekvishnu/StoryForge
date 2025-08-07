'use client';

import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
  Chip,
  Avatar,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import {
  AutoStories as AdventureIcon,
  Search as MysteryIcon,
  Castle as FantasyIcon,
  Favorite as FriendshipIcon,
  School as EducationalIcon,
} from '@mui/icons-material';

import { CharacterTemplate, SimpleCharacterAttributes, ComplexCharacterAttributes } from '@/types/character';

interface CharacterTemplatesProps {
  ageGroup: '7-10' | '11-16';
  onTemplateSelect: (template: CharacterTemplate) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`template-tabpanel-${index}`}
      aria-labelledby={`template-tab-${index}`}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// Predefined character templates
const CHARACTER_TEMPLATES: CharacterTemplate[] = [
  // Simple templates (7-10 age group)
  {
    id: 'simple-hero-1',
    name: 'Brave Explorer',
    description: 'A curious young adventurer who loves discovering new places',
    ageGroup: '7-10',
    category: 'adventure',
    attributes: {
      appearance: {
        hairColor: 'brown',
        eyeColor: 'green',
        skinTone: 'medium',
        height: 'medium',
        clothing: ['Explorer hat', 'Adventure vest', 'Sturdy boots'],
        accessories: ['Compass', 'Backpack', 'Magnifying glass'],
      },
      personality: {
        likes: ['Maps', 'Animals', 'Puzzles'],
        dislikes: ['Being stuck indoors', 'Giving up'],
        favoriteActivity: 'Exploring nature',
        mood: 'curious',
      },
      role: 'hero',
    } as SimpleCharacterAttributes,
  },
  {
    id: 'simple-friend-1',
    name: 'Loyal Buddy',
    description: 'A kind friend who always helps others',
    ageGroup: '7-10',
    category: 'friendship',
    attributes: {
      appearance: {
        hairColor: 'blonde',
        eyeColor: 'blue',
        skinTone: 'light',
        height: 'short',
        clothing: ['Colorful t-shirt', 'Comfortable jeans'],
        accessories: ['Friendship bracelet', 'Stickers'],
      },
      personality: {
        likes: ['Making friends', 'Sharing', 'Playing games'],
        dislikes: ['Meanness', 'Being alone'],
        favoriteActivity: 'Helping others',
        mood: 'kind',
      },
      role: 'friend',
    } as SimpleCharacterAttributes,
  },
  {
    id: 'simple-helper-1',
    name: 'Magic Helper',
    description: 'A magical creature who assists on adventures',
    ageGroup: '7-10',
    category: 'fantasy',
    attributes: {
      appearance: {
        hairColor: 'silver',
        eyeColor: 'purple',
        skinTone: 'light',
        height: 'short',
        clothing: ['Sparkly cape', 'Magic boots'],
        accessories: ['Magic wand', 'Glowing pendant'],
      },
      personality: {
        likes: ['Magic spells', 'Helping heroes', 'Starlight'],
        dislikes: ['Dark magic', 'Sadness'],
        favoriteActivity: 'Making magic',
        mood: 'playful',
      },
      role: 'helper',
    } as SimpleCharacterAttributes,
  },
  {
    id: 'simple-pet-1',
    name: 'Clever Pet',
    description: 'A smart animal companion',
    ageGroup: '7-10',
    category: 'friendship',
    attributes: {
      appearance: {
        hairColor: 'golden',
        eyeColor: 'brown',
        skinTone: 'medium',
        height: 'short',
        clothing: ['Colorful collar'],
        accessories: ['Name tag', 'Favorite toy'],
      },
      personality: {
        likes: ['Playing fetch', 'Treats', 'Adventures'],
        dislikes: ['Loud noises', 'Being left behind'],
        favoriteActivity: 'Playing games',
        mood: 'playful',
      },
      role: 'pet',
    } as SimpleCharacterAttributes,
  },

  // Complex templates (11-16 age group)
  {
    id: 'complex-protagonist-1',
    name: 'Teen Detective',
    description: 'A sharp-minded teenager who solves mysteries',
    ageGroup: '11-16',
    category: 'mystery',
    attributes: {
      appearance: {
        hairColor: 'black',
        hairStyle: 'Short and neat',
        eyeColor: 'gray',
        skinTone: 'medium',
        height: 'tall',
        build: 'slim',
        clothing: ['Detective coat', 'Dark jeans', 'Sneakers'],
        accessories: ['Notebook', 'Pen', 'Flashlight'],
        distinctiveFeatures: ['Sharp eyes', 'Confident posture'],
      },
      personality: {
        traits: ['Analytical', 'Curious', 'Determined', 'Logical'],
        strengths: ['Problem-solving', 'Observation', 'Patience'],
        weaknesses: ['Sometimes impatient', 'Stubborn'],
        fears: ['Unsolved mysteries', 'Letting people down'],
        motivations: ['Justice', 'Truth', 'Helping others'],
        mood: 'determined',
      },
      background: {
        hometown: 'Riverside City',
        family: 'Lives with detective aunt',
        education: 'High school honor student',
        hobbies: ['Reading mystery novels', 'Chess', 'Photography'],
        achievements: ['Solved school theft case', 'Chess club champion'],
      },
      role: 'protagonist',
      goals: {
        shortTerm: ['Solve current case', 'Improve detective skills'],
        longTerm: ['Become a professional detective', 'Start detective agency'],
        dreams: ['Solve famous cold cases', 'Write detective handbook'],
      },
    } as ComplexCharacterAttributes,
  },
  {
    id: 'complex-sidekick-1',
    name: 'Tech Genius',
    description: 'A brilliant young inventor and loyal friend',
    ageGroup: '11-16',
    category: 'adventure',
    attributes: {
      appearance: {
        hairColor: 'red',
        hairStyle: 'Curly and wild',
        eyeColor: 'green',
        skinTone: 'light',
        height: 'medium',
        build: 'average',
        clothing: ['Lab coat', 'Graphic t-shirt', 'Cargo pants'],
        accessories: ['Tablet', 'Toolkit', 'Smart glasses'],
        distinctiveFeatures: ['Bright smile', 'Always tinkering'],
      },
      personality: {
        traits: ['Creative', 'Optimistic', 'Intelligent', 'Loyal'],
        strengths: ['Technology', 'Innovation', 'Problem-solving'],
        weaknesses: ['Forgetful', 'Messy workspace'],
        fears: ['Technology failing', 'Disappointing friends'],
        motivations: ['Innovation', 'Helping friends', 'Discovery'],
        mood: 'curious',
      },
      background: {
        hometown: 'Silicon Valley',
        family: 'Engineer parents',
        education: 'Advanced STEM program',
        hobbies: ['Coding', 'Robotics', 'Gaming'],
        achievements: ['Science fair winner', 'App developer'],
      },
      role: 'sidekick',
      goals: {
        shortTerm: ['Build better gadgets', 'Help solve problems'],
        longTerm: ['Start tech company', 'Invent world-changing device'],
        dreams: ['Change the world with technology', 'Inspire young inventors'],
      },
    } as ComplexCharacterAttributes,
  },
  {
    id: 'complex-mentor-1',
    name: 'Wise Guardian',
    description: 'An experienced guide with ancient wisdom',
    ageGroup: '11-16',
    category: 'fantasy',
    attributes: {
      appearance: {
        hairColor: 'white',
        hairStyle: 'Long and flowing',
        eyeColor: 'blue',
        skinTone: 'light',
        height: 'tall',
        build: 'sturdy',
        clothing: ['Mystical robes', 'Ancient boots'],
        accessories: ['Staff of wisdom', 'Ancient tome', 'Crystal pendant'],
        distinctiveFeatures: ['Kind eyes', 'Mysterious aura'],
      },
      personality: {
        traits: ['Wise', 'Patient', 'Compassionate', 'Mysterious'],
        strengths: ['Ancient knowledge', 'Magic abilities', 'Teaching'],
        weaknesses: ['Sometimes cryptic', 'Bound by ancient laws'],
        fears: ['Students failing', 'Ancient evils returning'],
        motivations: ['Protecting the innocent', 'Teaching wisdom', 'Maintaining balance'],
        mood: 'thoughtful',
      },
      background: {
        hometown: 'The Ancient Grove',
        family: 'Guardian lineage',
        education: 'Centuries of experience',
        hobbies: ['Studying ancient texts', 'Meditation', 'Star gazing'],
        achievements: ['Defeated ancient evil', 'Trained many heroes'],
      },
      role: 'mentor',
      goals: {
        shortTerm: ['Guide current student', 'Protect sacred knowledge'],
        longTerm: ['Train new generation of guardians', 'Preserve ancient wisdom'],
        dreams: ['World peace', 'End of all conflicts', 'Perfect harmony'],
      },
    } as ComplexCharacterAttributes,
  },
  {
    id: 'complex-rival-1',
    name: 'Ambitious Competitor',
    description: 'A talented rival who pushes the protagonist to be better',
    ageGroup: '11-16',
    category: 'adventure',
    attributes: {
      appearance: {
        hairColor: 'blonde',
        hairStyle: 'Perfectly styled',
        eyeColor: 'blue',
        skinTone: 'light',
        height: 'tall',
        build: 'athletic',
        clothing: ['Designer jacket', 'Expensive shoes', 'Trendy accessories'],
        accessories: ['Luxury watch', 'High-end phone', 'Trophy pin'],
        distinctiveFeatures: ['Confident smile', 'Perfect posture'],
      },
      personality: {
        traits: ['Ambitious', 'Confident', 'Competitive', 'Charismatic'],
        strengths: ['Leadership', 'Motivation', 'Excellence'],
        weaknesses: ['Pride', 'Sometimes arrogant'],
        fears: ['Failure', 'Being second-best'],
        motivations: ['Success', 'Recognition', 'Excellence'],
        mood: 'confident',
      },
      background: {
        hometown: 'Prestigious Academy',
        family: 'Successful business family',
        education: 'Top student at elite school',
        hobbies: ['Tennis', 'Debate team', 'Student government'],
        achievements: ['Class president', 'Academic awards', 'Sports champion'],
      },
      role: 'rival',
      goals: {
        shortTerm: ['Win current competition', 'Maintain top grades'],
        longTerm: ['Attend prestigious university', 'Lead major corporation'],
        dreams: ['Change the world', 'Be remembered as the best', 'Inspire others'],
      },
    } as ComplexCharacterAttributes,
  },
];

export default function CharacterTemplates({ ageGroup, onTemplateSelect }: CharacterTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState(0);

  const categories = [
    { label: 'Adventure', icon: <AdventureIcon />, value: 'adventure' },
    { label: 'Mystery', icon: <MysteryIcon />, value: 'mystery' },
    { label: 'Fantasy', icon: <FantasyIcon />, value: 'fantasy' },
    { label: 'Friendship', icon: <FriendshipIcon />, value: 'friendship' },
    { label: 'Educational', icon: <EducationalIcon />, value: 'educational' },
  ];

  const filteredTemplates = CHARACTER_TEMPLATES.filter(
    template => 
      template.ageGroup === ageGroup && 
      (selectedCategory === 0 || template.category === categories[selectedCategory - 1]?.value)
  );

  const getTemplateAvatar = (template: CharacterTemplate) => {
    const initials = template.name.split(' ').map(n => n[0]).join('').toUpperCase();
    return (
      <Avatar
        sx={{
          width: 60,
          height: 60,
          backgroundColor: getCategoryColor(template.category),
          fontWeight: 'bold',
        }}
      >
        {initials}
      </Avatar>
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'adventure': return '#FF5722';
      case 'mystery': return '#673AB7';
      case 'fantasy': return '#E91E63';
      case 'friendship': return '#4CAF50';
      case 'educational': return '#2196F3';
      default: return '#9E9E9E';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'adventure': return <AdventureIcon />;
      case 'mystery': return <MysteryIcon />;
      case 'fantasy': return <FantasyIcon />;
      case 'friendship': return <FriendshipIcon />;
      case 'educational': return <EducationalIcon />;
      default: return <AdventureIcon />;
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, textAlign: 'center' }}>
        Choose a character template for ages {ageGroup}
      </Typography>

      {/* Category Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={selectedCategory}
          onChange={(_, newValue) => setSelectedCategory(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="All Categories" />
          {categories.map((category, index) => (
            <Tab
              key={category.value}
              label={category.label}
              icon={category.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Paper>

      {/* Template Grid */}
      <Grid container spacing={3}>
        {filteredTemplates.map((template) => (
          <Grid item xs={12} sm={6} md={4} key={template.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {getTemplateAvatar(template)}
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {template.name}
                    </Typography>
                    <Chip
                      size="small"
                      label={template.category}
                      icon={getCategoryIcon(template.category)}
                      sx={{ 
                        backgroundColor: getCategoryColor(template.category),
                        color: 'white',
                        textTransform: 'capitalize',
                      }}
                    />
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {template.description}
                </Typography>

                {/* Preview some attributes */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Quick Preview:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    <Chip
                      size="small"
                      label={template.attributes.appearance.hairColor}
                      variant="outlined"
                    />
                    <Chip
                      size="small"
                      label={template.attributes.personality.mood}
                      variant="outlined"
                    />
                    {ageGroup === '7-10' ? (
                      <Chip
                        size="small"
                        label={(template.attributes as SimpleCharacterAttributes).role}
                        variant="outlined"
                      />
                    ) : (
                      <Chip
                        size="small"
                        label={(template.attributes as ComplexCharacterAttributes).role}
                        variant="outlined"
                      />
                    )}
                  </Box>
                </Box>
              </CardContent>

              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => onTemplateSelect(template)}
                  sx={{
                    backgroundColor: getCategoryColor(template.category),
                    '&:hover': {
                      backgroundColor: getCategoryColor(template.category),
                      filter: 'brightness(0.9)',
                    },
                  }}
                >
                  Use This Template
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredTemplates.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 6,
            color: 'text.secondary',
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            No templates found
          </Typography>
          <Typography variant="body2">
            Try selecting a different category or age group.
          </Typography>
        </Box>
      )}
    </Box>
  );
} 
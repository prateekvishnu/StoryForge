'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  Grid,
  TextField,
  Stack,
  Avatar,
  Chip,
  Alert,
  Divider,
  Paper,
} from '@mui/material';
import {
  AutoStories as StoryIcon,
  Explore as ExploreIcon,
  Psychology as MysteryIcon,
  Castle as FantasyIcon,
  Create as CustomIcon,
  Person as PersonIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface Character {
  id: string;
  name: string;
  age: string;
  description: string;
  role: 'protagonist' | 'sidekick' | 'mentor' | 'villain' | 'helper';
  personality: string;
  appearance: string;
}

interface PremadeStoryline {
  id: string;
  title: string;
  description: string;
  setting: string;
  theme: string;
  storyType: 'adventure' | 'mystery' | 'fantasy';
  icon: React.ReactNode;
  color: string;
  initialStory: string;
  initialChoices: string[];
  ageGroup: '5-8' | '9-12' | '13-16';
}

const PREMADE_STORYLINES: PremadeStoryline[] = [
  {
    id: 'crystal-cave',
    title: '🏔️ The Crystal Cave Adventure',
    description: 'Journey through mysterious woods to find a legendary crystal cave filled with ancient secrets and magical creatures.',
    setting: 'Enchanted Forest and Crystal Caves',
    theme: 'Courage, discovery, and friendship',
    storyType: 'adventure',
    icon: <ExploreIcon />,
    color: 'primary',
    ageGroup: '9-12',
    initialStory: `{CHARACTER_NAME} stood at the edge of the Whispering Woods, backpack full of supplies and heart full of excitement. The ancient map showed three possible paths to the legendary Crystal Cave, each promising different adventures and challenges. The morning sun filtered through the trees, casting dancing shadows on the forest floor. Local villagers had warned about the dangers ahead, but {CHARACTER_NAME} felt ready for whatever lay in store.`,
    initialChoices: [
      'Take the sunny meadow path that looks safe and easy',
      'Follow the mysterious river path with glowing stones',
      'Brave the dark forest path where few have returned'
    ]
  },
  {
    id: 'missing-pet',
    title: '🔍 The Mystery of the Missing Pet',
    description: 'Use detective skills to solve the case of a beloved pet that has mysteriously disappeared from the neighborhood.',
    setting: 'Friendly neighborhood with hidden secrets',
    theme: 'Problem-solving, community, and persistence',
    storyType: 'mystery',
    icon: <MysteryIcon />,
    color: 'secondary',
    ageGroup: '9-12',
    initialStory: `{CHARACTER_NAME} received an urgent call from their neighbor Mrs. Johnson. Her beloved golden retriever, Buddy, had vanished without a trace during the night. As the neighborhood's youngest detective, {CHARACTER_NAME} grabbed a magnifying glass and notebook, ready to solve this puzzling case. The first step was to examine the scene and gather clues. Three important leads needed investigation.`,
    initialChoices: [
      'Search Buddy\'s favorite spots in the backyard for clues',
      'Interview neighbors who might have seen something',
      'Check the local park where Buddy loves to play'
    ]
  },
  {
    id: 'magic-school',
    title: '🏰 The Secret Magic School',
    description: 'Discover a hidden school for young wizards and learn to master magical powers while making new friends.',
    setting: 'Hidden magical academy in an enchanted realm',
    theme: 'Learning, friendship, and believing in yourself',
    storyType: 'fantasy',
    icon: <FantasyIcon />,
    color: 'info',
    ageGroup: '9-12',
    initialStory: `{CHARACTER_NAME} found the mysterious letter under their pillow on their twelfth birthday. Written in shimmering ink, it was an invitation to Starlight Academy, a secret school for young magic users. Following the letter's instructions, {CHARACTER_NAME} touched the ancient oak tree in the backyard and was transported to a magnificent castle floating among the clouds. Professor Moonwhisper greeted them with a warm smile and explained that every new student must choose their first magical study.`,
    initialChoices: [
      'Study potion-making with bubbling cauldrons and magical ingredients',
      'Learn to communicate with magical creatures and animals',
      'Practice spell-casting with wands and ancient incantations'
    ]
  }
];

export default function AdventureSelection() {
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedStoryline, setSelectedStoryline] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  useEffect(() => {
    // Load characters from localStorage
    const savedCharacters = localStorage.getItem('storyforge-characters');
    if (savedCharacters) {
      setCharacters(JSON.parse(savedCharacters));
    }
  }, []);

  const startAdventure = (storylineId: string, customPrompt?: string) => {
    if (characters.length === 0) {
      alert('Please create at least one character first!');
      return;
    }

    const storyline = PREMADE_STORYLINES.find(s => s.id === storylineId);
    const mainCharacter = characters.find(c => c.role === 'protagonist') || characters[0];

    // Prepare adventure data
    const adventureData = {
      storyline,
      customPrompt,
      characters,
      mainCharacter,
      timestamp: Date.now()
    };

    // Save to localStorage for the adventure page
    localStorage.setItem('storyforge-current-adventure', JSON.stringify(adventureData));

    // Navigate to adventure page
    router.push('/adventure');
  };

  const handleCustomAdventure = () => {
    if (!customPrompt.trim()) {
      alert('Please enter your custom story idea!');
      return;
    }
    startAdventure('custom', customPrompt);
  };

  const goBackToCharacters = () => {
    router.push('/characters');
  };

  const getRoleColor = (role: string) => {
    const colors = {
      protagonist: 'primary',
      sidekick: 'secondary',
      mentor: 'info',
      villain: 'error',
      helper: 'success',
    };
    return colors[role as keyof typeof colors] || 'default';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography 
        variant="h2" 
        sx={{ 
          mb: 6, 
          textAlign: 'center', 
          fontWeight: 700,
          fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
          color: 'text.primary',
        }}
      >
        <StoryIcon sx={{ mr: 2, verticalAlign: 'middle', fontSize: 'inherit' }} />
        Choose Your Adventure
      </Typography>

      {/* Character Summary */}
      {characters.length > 0 && (
        <Paper sx={{ p: 3, mb: 4, bgcolor: 'background.paper' }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <PersonIcon sx={{ mr: 1 }} />
            Your Characters ({characters.length})
          </Typography>
          <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 1 }}>
            {characters.map((character) => (
              <Chip
                key={character.id}
                avatar={<Avatar sx={{ bgcolor: `${getRoleColor(character.role)}.main` }}>
                  {character.name.charAt(0)}
                </Avatar>}
                label={`${character.name} (${character.role})`}
                color={getRoleColor(character.role) as any}
                variant="outlined"
              />
            ))}
          </Stack>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              variant="outlined"
              onClick={goBackToCharacters}
              startIcon={<BackIcon />}
              size="small"
            >
              Edit Characters
            </Button>
          </Box>
        </Paper>
      )}

      {characters.length === 0 && (
        <Alert severity="warning" sx={{ mb: 4 }}>
          No characters found! Please create characters first to start your adventure.
          <Button variant="contained" sx={{ ml: 2 }} onClick={goBackToCharacters}>
            Create Characters
          </Button>
        </Alert>
      )}

      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
        🎭 Select Your Story Adventure
      </Typography>

      <Grid container spacing={4}>
        {/* Premade Storylines */}
        {PREMADE_STORYLINES.map((storyline) => (
          <Grid item xs={12} md={4} key={storyline.id}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
                border: selectedStoryline === storyline.id ? 2 : 0,
                borderColor: selectedStoryline === storyline.id ? `${storyline.color}.main` : 'transparent',
              }}
              onClick={() => setSelectedStoryline(storyline.id)}
            >
              <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Box 
                    sx={{ 
                      display: 'inline-flex',
                      p: 2,
                      borderRadius: '50%',
                      bgcolor: `${storyline.color}.light`,
                      color: `${storyline.color}.main`,
                      mb: 2
                    }}
                  >
                    {storyline.icon}
                  </Box>
                  <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
                    {storyline.title}
                  </Typography>
                  <Chip 
                    label={`Age ${storyline.ageGroup}`} 
                    size="small" 
                    color={storyline.color as any} 
                    variant="outlined"
                  />
                </Box>

                <Typography variant="body1" sx={{ mb: 2, flexGrow: 1 }}>
                  {storyline.description}
                </Typography>

                <Box sx={{ mt: 'auto' }}>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Setting:</strong> {storyline.setting}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    <strong>Theme:</strong> {storyline.theme}
                  </Typography>
                  
                  <Button
                    variant={selectedStoryline === storyline.id ? 'contained' : 'outlined'}
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation();
                      startAdventure(storyline.id);
                    }}
                    color={storyline.color as any}
                    disabled={characters.length === 0}
                  >
                    Start This Adventure
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Custom Story Option */}
        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              height: '100%',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              },
              border: showCustom ? 2 : 0,
              borderColor: showCustom ? 'warning.main' : 'transparent',
            }}
            onClick={() => setShowCustom(true)}
          >
            <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Box 
                  sx={{ 
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: '50%',
                    bgcolor: 'warning.light',
                    color: 'warning.main',
                    mb: 2
                  }}
                >
                  <CustomIcon />
                </Box>
                <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
                  ✨ Create Your Own
                </Typography>
                <Chip 
                  label="Custom Story" 
                  size="small" 
                  color="warning" 
                  variant="outlined"
                />
              </Box>

              <Typography variant="body1" sx={{ mb: 2, flexGrow: 1 }}>
                Have your own story idea? Create a completely custom adventure with your characters!
              </Typography>

              {showCustom && (
                <Box sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Your Story Idea"
                    placeholder="Describe your adventure idea... For example: 'My characters discover a time machine in their school basement and must travel back to save history...'"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                </Box>
              )}

              <Box sx={{ mt: 'auto' }}>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <strong>Setting:</strong> Your imagination!
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  <strong>Theme:</strong> Whatever you choose
                </Typography>
                
                <Button
                  variant={showCustom ? 'contained' : 'outlined'}
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation();
                    if (showCustom) {
                      handleCustomAdventure();
                    } else {
                      setShowCustom(true);
                    }
                  }}
                  color="warning"
                  disabled={characters.length === 0}
                >
                  {showCustom ? 'Start Custom Adventure' : 'Create Custom Story'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Instructions */}
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          🎮 How It Works
        </Typography>
        <Grid container spacing={2} sx={{ maxWidth: 800, mx: 'auto' }}>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary">
              <strong>1. Choose</strong><br />
              Select a premade adventure or create your own story idea
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary">
              <strong>2. Adventure</strong><br />
              Your characters will be placed into the story world
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary">
              <strong>3. Choose</strong><br />
              Make choices that shape how your adventure unfolds
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

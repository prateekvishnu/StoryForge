'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  Avatar,
  Chip,
  LinearProgress,
  IconButton,
} from '@mui/material';
import {
  AutoStories as StoryIcon,
  Refresh as RestartIcon,
  History as HistoryIcon,
  Person as PersonIcon,
  ArrowBack as BackIcon,
  Home as HomeIcon,
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

interface StorySegment {
  content: string;
  choice?: string;
  timestamp: number;
}

interface AdventureData {
  storyline?: any;
  customPrompt?: string;
  characters: Character[];
  mainCharacter: Character;
  timestamp: number;
}

export default function AdventurePage() {
  const router = useRouter();
  const [adventureData, setAdventureData] = useState<AdventureData | null>(null);
  const [currentStory, setCurrentStory] = useState<string>('');
  const [storyHistory, setStoryHistory] = useState<StorySegment[]>([]);
  const [currentChoices, setCurrentChoices] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    // Load adventure data from localStorage
    const savedAdventure = localStorage.getItem('storyforge-current-adventure');
    if (savedAdventure) {
      const data = JSON.parse(savedAdventure);
      setAdventureData(data);
      initializeStory(data);
    } else {
      // No adventure data, redirect to character creation
      router.push('/characters');
    }
  }, [router]);

  const initializeStory = (data: AdventureData) => {
    if (data.storyline) {
      // Use premade storyline
      let initialStory = data.storyline.initialStory;
      
      // Replace {CHARACTER_NAME} with main character's name
      initialStory = initialStory.replace(/{CHARACTER_NAME}/g, data.mainCharacter.name);
      
      setCurrentStory(initialStory);
      setCurrentChoices(data.storyline.initialChoices);
    } else if (data.customPrompt) {
      // Generate custom story
      generateCustomStory(data.customPrompt, data.characters, data.mainCharacter);
    }
  };

  const generateCustomStory = async (prompt: string, characters: Character[], mainCharacter: Character) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stories/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          ageGroup: '9-12',
          storyType: 'adventure',
          length: 'medium',
          characters: characters,
          tone: 'exciting',
          customInstructions: `Create an engaging opening scene for this adventure. The main character is ${mainCharacter.name}. Include 3 clear choices at the end.`,
          includeChoices: true,
          targetWordCount: 300,
        }),
      });

      const data = await response.json();

      if (data.success && data.story) {
        setCurrentStory(data.story);
        
        // Extract choices from the story or use defaults
        if (data.choices && data.choices.length > 0) {
          setCurrentChoices(data.choices.map((choice: any) => choice.text || choice));
        } else {
          // Fallback choices
          setCurrentChoices([
            'Investigate the mysterious situation carefully',
            'Take bold action to move forward',
            'Seek help from others nearby'
          ]);
        }
      } else {
        throw new Error(data.error || 'Failed to generate story');
      }
    } catch (err) {
      console.error('Story generation error:', err);
      setError('Failed to generate your custom story. Please try again.');
      // Provide fallback story
      setCurrentStory(`${mainCharacter.name} began their adventure with excitement and curiosity. The journey ahead promised many surprises and challenges.`);
      setCurrentChoices([
        'Look around carefully for clues',
        'Start exploring with confidence',
        'Think carefully about the next step'
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleChoiceSelect = async (choiceText: string, choiceIndex: number) => {
    if (!adventureData) return;

    setLoading(true);
    setError(null);

    // Add current story and choice to history
    const newHistorySegment: StorySegment = {
      content: currentStory,
      choice: choiceText,
      timestamp: Date.now()
    };
    const updatedHistory = [...storyHistory, newHistorySegment];
    setStoryHistory(updatedHistory);

    try {
      // Build the full story context for the API
      const fullStoryContext = updatedHistory.map(segment => {
        let text = segment.content;
        if (segment.choice) {
          text += `\n\n**${adventureData.mainCharacter.name} chose: ${segment.choice}**`;
        }
        return text;
      }).join('\n\n---\n\n');

      const response = await fetch('/api/stories/continue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          previousStory: fullStoryContext,
          chosenOption: choiceText,
          choiceIndex,
          ageGroup: adventureData.storyline?.ageGroup || '9-12',
          storyType: adventureData.storyline?.storyType || 'adventure',
          tone: 'exciting',
          characters: adventureData.characters,
          setting: adventureData.storyline?.setting || 'An exciting adventure world',
          theme: adventureData.storyline?.theme || 'Courage and discovery',
          addMoreChoices: true,
          targetWordCount: 250,
        }),
      });

      const data = await response.json();

      if (data.success && data.continuation) {
        setCurrentStory(data.continuation);
        
        if (data.choices && data.choices.length > 0) {
          setCurrentChoices(data.choices.map((choice: any) => choice.text || choice));
        } else {
          // Generate contextual fallback choices
          setCurrentChoices([
            'Continue exploring this interesting path',
            'Look for another way to proceed',
            'Take time to think about what to do next'
          ]);
        }
      } else {
        throw new Error(data.error || 'Failed to continue story');
      }
    } catch (err) {
      console.error('Story continuation error:', err);
      setError('Failed to continue the story. Using fallback options.');
      // Provide contextual fallback choices
      setCurrentChoices([
        'Look around for new opportunities',
        'Try a different approach',
        'Ask for help from companions'
      ]);
    } finally {
      setLoading(false);
    }
  };

  const resetStory = () => {
    if (adventureData) {
      setStoryHistory([]);
      setError(null);
      setShowHistory(false);
      initializeStory(adventureData);
    }
  };

  const goBack = () => {
    router.push('/adventure-selection');
  };

  const goHome = () => {
    router.push('/');
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

  // Calculate progress (story segments)
  const totalSegments = storyHistory.length + 1;
  const estimatedWords = (currentStory.split(/\s+/).length + 
    storyHistory.reduce((total, segment) => total + segment.content.split(/\s+/).length, 0));

  if (!adventureData) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading your adventure...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={goBack} sx={{ mr: 2 }}>
          <BackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          🎮 {adventureData.storyline?.title || 'Custom Adventure'}
        </Typography>
        <IconButton onClick={goHome}>
          <HomeIcon />
        </IconButton>
      </Box>

      {/* Character Info & Progress */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonIcon sx={{ mr: 1 }} />
            <Typography variant="h6">
              {adventureData.mainCharacter.name}'s Adventure
            </Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setShowHistory(!showHistory)}
            startIcon={<HistoryIcon />}
          >
            {showHistory ? 'Hide' : 'Show'} History
          </Button>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar sx={{ bgcolor: `${getRoleColor(adventureData.mainCharacter.role)}.main` }}>
            {adventureData.mainCharacter.name.charAt(0)}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2">
              <strong>{adventureData.mainCharacter.name}</strong> • {adventureData.mainCharacter.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              {adventureData.characters.map((char) => (
                <Chip 
                  key={char.id} 
                  label={char.name} 
                  size="small" 
                  color={getRoleColor(char.role) as any}
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        </Box>

        {/* Progress Bar */}
        <Box sx={{ mb: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Story Progress: {totalSegments} segments • ~{estimatedWords} words • ~{Math.ceil(estimatedWords / 200)} min read
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={Math.min((totalSegments / 10) * 100, 100)} 
            sx={{ mt: 0.5, height: 6, borderRadius: 3 }}
          />
        </Box>
      </Paper>

      {/* Story History (if shown) */}
      {showHistory && storyHistory.length > 0 && (
        <Card sx={{ mb: 3, maxHeight: 300, overflow: 'auto' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              📖 Story History
            </Typography>
            {storyHistory.map((segment, index) => (
              <Box key={index} sx={{ mb: 2, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body2" sx={{ mb: 1, opacity: 0.8 }}>
                  {segment.content}
                </Typography>
                {segment.choice && (
                  <Chip 
                    label={`Choice: ${segment.choice}`} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                )}
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Error Alert */}
      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Current Story */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 3, 
              whiteSpace: 'pre-wrap', 
              lineHeight: 1.7,
              fontSize: '1.1rem'
            }}
          >
            {currentStory}
          </Typography>

          {/* Choices */}
          {currentChoices.length > 0 && !loading && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                🎮 What does {adventureData.mainCharacter.name} do?
              </Typography>
              
              <Stack spacing={2}>
                {currentChoices.map((choice, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    onClick={() => handleChoiceSelect(choice, index)}
                    disabled={loading}
                    sx={{
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      p: 2,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1rem',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                        color: 'white',
                      }
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {String.fromCharCode(65 + index)}) {choice}
                    </Typography>
                  </Button>
                ))}
              </Stack>
            </Box>
          )}

          {/* Loading State */}
          {loading && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 3 }}>
              <CircularProgress size={24} sx={{ mr: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Continuing {adventureData.mainCharacter.name}'s adventure...
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button 
          variant="outlined" 
          onClick={resetStory}
          startIcon={<RestartIcon />}
        >
          Start Over
        </Button>
        
        <Button 
          variant="outlined" 
          onClick={goBack}
          startIcon={<BackIcon />}
        >
          Choose Different Adventure
        </Button>
      </Box>
    </Container>
  );
}

'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Chip,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  AutoStories as StoryIcon,
  Person as PersonIcon,
  Send as SendIcon,
} from '@mui/icons-material';

interface Character {
  id: string;
  name: string;
  role: string;
  personality: string;
  appearance: string;
}

interface StorySegment {
  id: string;
  content: string;
  choices?: string[];
  customChoice?: string;
}

export default function AdventurePage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [storyHistory, setStoryHistory] = useState<StorySegment[]>([]);
  const [currentStory, setCurrentStory] = useState<string>('');
  const [currentChoices, setCurrentChoices] = useState<string[]>([]);
  const [customChoice, setCustomChoice] = useState<string>('');
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  // Load characters from localStorage
  useEffect(() => {
    const savedCharacters = localStorage.getItem('storyforge_characters');
    if (savedCharacters) {
      setCharacters(JSON.parse(savedCharacters));
    }
  }, []);

  const generateStoryOptions = async (prompt: string, fullHistory: string = '') => {
    setLoading(true);
    try {
      const charactersContext = characters.map(char => 
        `${char.name} (${char.role}): ${char.personality}, ${char.appearance}`
      ).join('; ');

      const response = await fetch('/api/stories/adventure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          characters: charactersContext,
          storyHistory: fullHistory,
          ageGroup: '9-12',
          storyType: 'adventure'
        }),
      });

      if (!response.ok) throw new Error('Failed to generate story');
      
      const data = await response.json();
      
      setCurrentStory(data.story);
      setCurrentChoices(data.choices || []);
      
      // Add to story history
      const newSegment: StorySegment = {
        id: Date.now().toString(),
        content: data.story,
        choices: data.choices
      };
      setStoryHistory(prev => [...prev, newSegment]);
      
    } catch (error) {
      console.error('Error generating story:', error);
    } finally {
      setLoading(false);
    }
  };

  const startAdventure = async () => {
    if (!userPrompt.trim()) return;
    
    setHasStarted(true);
    await generateStoryOptions(userPrompt);
    setUserPrompt('');
  };

  const handleChoiceClick = async (choice: string) => {
    const fullHistory = storyHistory.map(segment => segment.content).join('\n\n');
    await generateStoryOptions(choice, fullHistory);
  };

  const handleCustomChoice = async () => {
    if (!customChoice.trim()) return;
    
    const fullHistory = storyHistory.map(segment => segment.content).join('\n\n');
    await generateStoryOptions(customChoice, fullHistory);
    setCustomChoice('');
  };

  if (characters.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <PersonIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" sx={{ mb: 2 }}>
            No Characters Found! 👥
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            You need to create some characters first before starting your adventure!
          </Typography>
          <Button
            variant="contained"
            size="large"
            href="/characters"
            sx={{ minWidth: 200 }}
          >
            Create Characters First! 👥
          </Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 2, sm: 3 } }}>
      <Typography 
        variant="h3" 
        sx={{ 
          mb: { xs: 3, sm: 4 }, 
          textAlign: 'center', 
          fontWeight: 'bold',
          fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' }
        }}
      >
        🗡️ Choose Your Adventure! ⚡
      </Typography>

      {/* Characters Summary */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            👥 Your Characters:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {characters.map((char) => (
              <Chip
                key={char.id}
                label={`${char.name} (${char.role})`}
                color="primary"
                variant="outlined"
              />
            ))}
          </Stack>
        </CardContent>
      </Card>

      {!hasStarted ? (
        /* Initial Prompt */
        <Card sx={{ mb: { xs: 3, sm: 4 } }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: { xs: 2, sm: 3 },
                fontSize: { xs: '1.25rem', sm: '1.5rem' }
              }}
            >
              🚀 Start Your Adventure!
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ 
                mb: { xs: 2, sm: 3 },
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            >
              Describe how you want your adventure to begin. Your characters will be part of the story!
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Example: The heroes find themselves in a mysterious forest where they hear strange sounds coming from a hidden cave..."
              sx={{ mb: { xs: 2, sm: 3 } }}
            />
            <Button
              variant="contained"
              size="large"
              onClick={startAdventure}
              disabled={!userPrompt.trim() || loading}
              startIcon={loading ? <CircularProgress size={20} /> : <StoryIcon />}
              sx={{ 
                minWidth: { xs: '100%', sm: 200 },
                py: { xs: 1.5, sm: 1.25 }
              }}
            >
              {loading ? 'Creating Adventure...' : 'Begin Adventure! 🚀'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Story History */}
          <Accordion defaultExpanded sx={{ mb: 4 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">📖 Story So Far ({storyHistory.length} parts)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                {storyHistory.map((segment, index) => (
                  <Card key={segment.id} variant="outlined" sx={{ mb: 2, p: 2 }}>
                    <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
                      Part {index + 1}:
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                      {segment.content}
                    </Typography>
                  </Card>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Current Story */}
          {currentStory && (
            <Card sx={{ mb: 4, border: '2px solid', borderColor: 'primary.main' }}>
              <CardContent>
                <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                  📜 Current Story:
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
                  {currentStory}
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Choices */}
          {currentChoices.length > 0 && (
            <Card sx={{ mb: { xs: 3, sm: 4 } }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: { xs: 2, sm: 3 },
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}
                >
                  🤔 What happens next? Choose your path:
                </Typography>
                <Stack spacing={{ xs: 1.5, sm: 2 }}>
                  {currentChoices.map((choice, index) => (
                    <Button
                      key={index}
                      variant="outlined"
                      size="large"
                      onClick={() => handleChoiceClick(choice)}
                      disabled={loading}
                      sx={{
                        p: { xs: 1.5, sm: 2 },
                        textAlign: 'left',
                        justifyContent: 'flex-start',
                        textTransform: 'none',
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        lineHeight: 1.4,
                      }}
                    >
                      <strong>{String.fromCharCode(65 + index)}:</strong>&nbsp;{choice}
                    </Button>
                  ))}
                  
                  {/* Custom Choice */}
                  <Box sx={{ mt: { xs: 2, sm: 3 } }}>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        mb: { xs: 1.5, sm: 2 },
                        fontSize: { xs: '1rem', sm: '1.1rem' }
                      }}
                    >
                      💭 Or create your own choice:
                    </Typography>
                    <Stack 
                      direction={{ xs: 'column', sm: 'row' }} 
                      spacing={{ xs: 1.5, sm: 2 }}
                    >
                      <TextField
                        fullWidth
                        value={customChoice}
                        onChange={(e) => setCustomChoice(e.target.value)}
                        placeholder="Describe what you want to happen next..."
                        disabled={loading}
                        sx={{ flex: 1 }}
                      />
                      <Button
                        variant="contained"
                        onClick={handleCustomChoice}
                        disabled={!customChoice.trim() || loading}
                        startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
                        sx={{ 
                          minWidth: { xs: '100%', sm: 120 },
                          py: { xs: 1.5, sm: 1.25 }
                        }}
                      >
                        {loading ? 'Creating...' : 'Go!'}
                      </Button>
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          )}

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress size={40} />
            </Box>
          )}
        </>
      )}
    </Container>
  );
} 

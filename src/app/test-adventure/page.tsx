'use client';

import { useState } from 'react';
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
} from '@mui/material';

export default function TestAdventurePage() {
  const [currentStory, setCurrentStory] = useState<string>(
    "Maya stood at the edge of the Whispering Woods, her backpack full of supplies. The ancient map in her hand showed three possible paths to the legendary Crystal Cave. Each path promised different adventures and challenges."
  );
  
  const [storyHistory, setStoryHistory] = useState<string[]>([]);
  const [currentChoices, setCurrentChoices] = useState([
    "Take the sunny meadow path that looks safe and easy",
    "Follow the mysterious river path with strange glowing stones", 
    "Brave the dark forest path where few have returned"
  ]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChoiceSelect = async (choiceText: string, choiceIndex: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stories/continue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          previousStory: [currentStory, ...storyHistory].join('\n\n'),
          chosenOption: choiceText,
          choiceIndex,
          ageGroup: '9-12',
          storyType: 'adventure',
          tone: 'exciting',
          characters: [
            {
              name: 'Maya',
              description: 'A brave 12-year-old explorer',
              role: 'protagonist'
            }
          ],
          setting: 'The Whispering Woods and Crystal Cave',
          theme: 'Courage and discovery',
          addMoreChoices: true,
          targetWordCount: 250,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Add the choice and continuation to history
        const choiceSegment = `\n\n**You chose: ${choiceText}**\n\n${data.continuation}`;
        const newHistory = [...storyHistory, currentStory, choiceSegment];
        
        setStoryHistory(newHistory);
        setCurrentStory(data.continuation);
        setCurrentChoices(data.choices?.map((choice: any) => choice.text) || []);
      } else {
        setError(data.error || 'Failed to continue story');
        // Provide fallback choices if API fails
        setCurrentChoices([
          "Look around carefully for clues",
          "Call out for help",
          "Try to find another way forward"
        ]);
      }
    } catch (err) {
      setError('Network error. Please try again.');
      // Provide fallback choices
      setCurrentChoices([
        "Look around carefully for clues",
        "Call out for help", 
        "Try to find another way forward"
      ]);
    } finally {
      setLoading(false);
    }
  };

  const resetStory = () => {
    setCurrentStory("Maya stood at the edge of the Whispering Woods, her backpack full of supplies. The ancient map in her hand showed three possible paths to the legendary Crystal Cave. Each path promised different adventures and challenges.");
    setStoryHistory([]);
    setCurrentChoices([
      "Take the sunny meadow path that looks safe and easy",
      "Follow the mysterious river path with strange glowing stones",
      "Brave the dark forest path where few have returned"
    ]);
    setError(null);
  };

  const fullStory = [currentStory, ...storyHistory].join('\n\n');

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
        🎮 Choose Your Adventure Test
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', color: 'text.secondary' }}>
        This page demonstrates the choose-your-adventure functionality where each choice generates a 200-300 word story continuation.
      </Typography>

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error} (Using fallback choices)
        </Alert>
      )}

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
            Maya's Crystal Cave Adventure
          </Typography>

          <Typography 
            variant="body1" 
            sx={{ 
              mb: 3, 
              whiteSpace: 'pre-wrap', 
              lineHeight: 1.6,
              fontSize: '1.1rem'
            }}
          >
            {fullStory}
          </Typography>

          {currentChoices.length > 0 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                🎮 What do you choose?
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
              
              {loading && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, justifyContent: 'center' }}>
                  <CircularProgress size={24} sx={{ mr: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    Continuing Maya's adventure... (Generating 200-300 words)
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      <Box sx={{ textAlign: 'center' }}>
        <Button 
          variant="contained" 
          onClick={resetStory}
          sx={{ mr: 2 }}
        >
          🔄 Start Over
        </Button>
        
        <Button 
          variant="outlined" 
          href="/create"
        >
          ✨ Create Your Own Story
        </Button>
      </Box>

      <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          📊 Story Statistics
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • Story segments: {storyHistory.length + 1}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • Total words: {fullStory.split(/\s+/).length}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • Estimated reading time: {Math.ceil(fullStory.split(/\s+/).length / 200)} minutes
        </Typography>
      </Box>
    </Container>
  );
} 
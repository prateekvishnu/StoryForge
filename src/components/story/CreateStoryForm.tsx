'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Switch,
  Slider,
  Alert,
  CircularProgress,
  Divider,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  AutoStories as StoryIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Psychology as InteractiveIcon,
} from '@mui/icons-material';

interface Character {
  name: string;
  description: string;
  role: 'protagonist' | 'sidekick' | 'mentor' | 'villain' | 'helper';
}

interface StoryRequest {
  prompt: string;
  ageGroup: '5-8' | '9-12' | '13-16';
  storyType: 'adventure' | 'mystery' | 'fantasy' | 'friendship' | 'educational';
  length: 'short' | 'medium' | 'long';
  characters: Character[];
  setting: string;
  theme: string;
  tone: 'exciting' | 'mysterious' | 'funny' | 'heartwarming' | 'educational';
  wordLimit: number;
  customInstructions: string;
  isInteractive: boolean;
  choicePoints: number;
}

interface StoryResponse {
  success: boolean;
  story?: string;
  title?: string;
  choices?: { text: string; consequence: string }[];
  metadata?: {
    wordCount: number;
    estimatedReadingTime: number;
    isInteractive: boolean;
    safetyCheck: { safe: boolean; issues: string[] };
  };
  error?: string;
}

export default function CreateStoryForm() {
  const [formData, setFormData] = useState<StoryRequest>({
    prompt: '',
    ageGroup: '9-12',
    storyType: 'adventure',
    length: 'medium',
    characters: [],
    setting: '',
    theme: '',
    tone: 'exciting',
    wordLimit: 500,
    customInstructions: '',
    isInteractive: false,
    choicePoints: 2,
  });

  const [newCharacter, setNewCharacter] = useState<Character>({
    name: '',
    description: '',
    role: 'protagonist',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StoryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [storyHistory, setStoryHistory] = useState<string[]>([]);
  const [continuationLoading, setContinuationLoading] = useState(false);

  const handleInputChange = (field: keyof StoryRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addCharacter = () => {
    if (newCharacter.name && newCharacter.description) {
      setFormData(prev => ({
        ...prev,
        characters: [...prev.characters, { ...newCharacter }]
      }));
      setNewCharacter({ name: '', description: '', role: 'protagonist' });
    }
  };

  const removeCharacter = (index: number) => {
    setFormData(prev => ({
      ...prev,
      characters: prev.characters.filter((_, i) => i !== index)
    }));
  };

  const getWordLimitRange = () => {
    const ranges = {
      '5-8': { min: 200, max: 800, default: 400 },
      '9-12': { min: 300, max: 1200, default: 600 },
      '13-16': { min: 500, max: 1800, default: 900 }
    };
    return ranges[formData.ageGroup];
  };

  const handleSubmit = async () => {
    if (!formData.prompt.trim()) {
      setError('Please enter a story prompt');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/stories/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data: StoryResponse = await response.json();

      if (data.success) {
        setResult(data);
        // Initialize story history for interactive stories
        if (data.metadata?.isInteractive) {
          setStoryHistory([data.story || '']);
        }
      } else {
        setError(data.error || 'Failed to generate story');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const wordLimitRange = getWordLimitRange();

  // Handle choice selection for interactive stories
  const handleChoiceSelect = async (choiceText: string, choiceIndex: number) => {
    if (!result?.story) return;

    setContinuationLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stories/continue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          previousStory: storyHistory.join('\n\n'),
          chosenOption: choiceText,
          choiceIndex,
          ageGroup: formData.ageGroup,
          storyType: formData.storyType,
          tone: formData.tone,
          characters: formData.characters,
          setting: formData.setting,
          theme: formData.theme,
          addMoreChoices: true, // Always add more choices for continued adventure
          targetWordCount: 250, // 200-300 word segments
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update story history
        const newStorySegment = `\n\n**You chose: ${choiceText}**\n\n${data.continuation}`;
        const updatedHistory = [...storyHistory, newStorySegment];
        setStoryHistory(updatedHistory);

        // Update result with continuation
        setResult(prev => ({
          ...prev!,
          story: updatedHistory.join(''),
          choices: data.choices || [],
          metadata: {
            ...prev!.metadata!,
            wordCount: (prev!.metadata!.wordCount || 0) + (data.metadata?.wordCount || 0),
            estimatedReadingTime: Math.ceil(((prev!.metadata!.wordCount || 0) + (data.metadata?.wordCount || 0)) / 200),
          },
        }));
      } else {
        setError(data.error || 'Failed to continue story');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setContinuationLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
        <StoryIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
        Create Your Story
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 4 }}>
        {/* Main Form */}
        <Box>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <StoryIcon sx={{ mr: 1 }} />
                Story Basics
              </Typography>

              <TextField
                fullWidth
                label="Story Prompt"
                placeholder="Describe the adventure, mystery, or story you want to create..."
                multiline
                rows={3}
                value={formData.prompt}
                onChange={(e) => handleInputChange('prompt', e.target.value)}
                sx={{ mb: 3 }}
              />

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2, mb: 3 }}>
                <FormControl>
                  <InputLabel>Age Group</InputLabel>
                  <Select
                    value={formData.ageGroup}
                    onChange={(e) => handleInputChange('ageGroup', e.target.value)}
                  >
                    <MenuItem value="5-8">Ages 5-8</MenuItem>
                    <MenuItem value="9-12">Ages 9-12</MenuItem>
                    <MenuItem value="13-16">Ages 13-16</MenuItem>
                  </Select>
                </FormControl>

                <FormControl>
                  <InputLabel>Story Type</InputLabel>
                  <Select
                    value={formData.storyType}
                    onChange={(e) => handleInputChange('storyType', e.target.value)}
                  >
                    <MenuItem value="adventure">Adventure</MenuItem>
                    <MenuItem value="mystery">Mystery</MenuItem>
                    <MenuItem value="fantasy">Fantasy</MenuItem>
                    <MenuItem value="friendship">Friendship</MenuItem>
                    <MenuItem value="educational">Educational</MenuItem>
                  </Select>
                </FormControl>

                <FormControl>
                  <InputLabel>Tone</InputLabel>
                  <Select
                    value={formData.tone}
                    onChange={(e) => handleInputChange('tone', e.target.value)}
                  >
                    <MenuItem value="exciting">Exciting</MenuItem>
                    <MenuItem value="mysterious">Mysterious</MenuItem>
                    <MenuItem value="funny">Funny</MenuItem>
                    <MenuItem value="heartwarming">Heartwarming</MenuItem>
                    <MenuItem value="educational">Educational</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>
                  Word Limit: {formData.wordLimit} words
                </Typography>
                <Slider
                  value={formData.wordLimit}
                  onChange={(_, value) => handleInputChange('wordLimit', value as number)}
                  min={wordLimitRange.min}
                  max={wordLimitRange.max}
                  step={50}
                  marks={[
                    { value: wordLimitRange.min, label: `${wordLimitRange.min}` },
                    { value: wordLimitRange.default, label: `${wordLimitRange.default}` },
                    { value: wordLimitRange.max, label: `${wordLimitRange.max}` },
                  ]}
                />
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <TextField
                  label="Setting (Optional)"
                  placeholder="Where does your story take place?"
                  value={formData.setting}
                  onChange={(e) => handleInputChange('setting', e.target.value)}
                />
                <TextField
                  label="Theme (Optional)"
                  placeholder="What's the main message or lesson?"
                  value={formData.theme}
                  onChange={(e) => handleInputChange('theme', e.target.value)}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Character Creation */}
          <Accordion sx={{ mb: 3 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ mr: 1 }} />
                Characters ({formData.characters.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Add characters to your story:
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr auto' }, gap: 2, mb: 2 }}>
                  <TextField
                    size="small"
                    label="Character Name"
                    value={newCharacter.name}
                    onChange={(e) => setNewCharacter(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <TextField
                    size="small"
                    label="Description"
                    value={newCharacter.description}
                    onChange={(e) => setNewCharacter(prev => ({ ...prev, description: e.target.value }))}
                  />
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={addCharacter}
                    disabled={!newCharacter.name || !newCharacter.description}
                  >
                    Add
                  </Button>
                </Box>

                <FormControl size="small" sx={{ minWidth: 120, mb: 2 }}>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={newCharacter.role}
                    onChange={(e) => setNewCharacter(prev => ({ ...prev, role: e.target.value as Character['role'] }))}
                  >
                    <MenuItem value="protagonist">Hero</MenuItem>
                    <MenuItem value="sidekick">Sidekick</MenuItem>
                    <MenuItem value="mentor">Mentor</MenuItem>
                    <MenuItem value="villain">Villain</MenuItem>
                    <MenuItem value="helper">Helper</MenuItem>
                  </Select>
                </FormControl>

                {formData.characters.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Your Characters:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {formData.characters.map((char, index) => (
                        <Chip
                          key={index}
                          label={`${char.name} (${char.role})`}
                          onDelete={() => removeCharacter(index)}
                          deleteIcon={<DeleteIcon />}
                          sx={{ mb: 1 }}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Advanced Options */}
          <Accordion sx={{ mb: 3 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <SettingsIcon sx={{ mr: 1 }} />
                Advanced Options
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                fullWidth
                label="Custom Instructions"
                placeholder="Any special instructions for your story? (e.g., include educational facts, specific themes, etc.)"
                multiline
                rows={2}
                value={formData.customInstructions}
                onChange={(e) => handleInputChange('customInstructions', e.target.value)}
                sx={{ mb: 3 }}
              />

              <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <InteractiveIcon sx={{ mr: 1 }} />
                  Choose Your Adventure
                </Typography>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isInteractive}
                      onChange={(e) => handleInputChange('isInteractive', e.target.checked)}
                    />
                  }
                  label="Make this a choose-your-adventure story"
                />

                {formData.isInteractive && (
                  <Box sx={{ mt: 2 }}>
                    <Typography gutterBottom>
                      Number of Choice Points: {formData.choicePoints}
                    </Typography>
                    <Slider
                      value={formData.choicePoints}
                      onChange={(_, value) => handleInputChange('choicePoints', value as number)}
                      min={1}
                      max={5}
                      step={1}
                      marks
                      sx={{ maxWidth: 300 }}
                    />
                  </Box>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>

          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleSubmit}
            disabled={loading || !formData.prompt.trim()}
            sx={{ py: 2 }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 2 }} />
                Creating Your Story...
              </>
            ) : (
              'Create Story'
            )}
          </Button>
        </Box>

        {/* Results Panel */}
        <Box>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {result && (
            <Card>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {result.title}
                </Typography>

                {result.metadata && (
                  <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      📊 {result.metadata.wordCount} words • 
                      ⏱️ {result.metadata.estimatedReadingTime} min read
                      {result.metadata.isInteractive && ' • 🎮 Interactive'}
                    </Typography>
                  </Box>
                )}

                <Typography variant="body1" sx={{ mb: 3, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                  {result.story}
                </Typography>

                {result.choices && result.choices.length > 0 && (
                  <Box>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      🎮 What do you choose?
                    </Typography>
                    <Stack spacing={1}>
                      {result.choices.map((choice, index) => (
                        <Button
                          key={index}
                          variant="outlined"
                          onClick={() => handleChoiceSelect(choice.text, index)}
                          disabled={continuationLoading}
                          sx={{
                            justifyContent: 'flex-start',
                            textAlign: 'left',
                            p: 2,
                            borderRadius: 2,
                            textTransform: 'none',
                            '&:hover': {
                              backgroundColor: 'primary.light',
                              color: 'white',
                            }
                          }}
                        >
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                              {String.fromCharCode(65 + index)}) {choice.text}
                            </Typography>
                            {choice.consequence && (
                              <Typography variant="body2" color="text.secondary">
                                {choice.consequence}
                              </Typography>
                            )}
                          </Box>
                        </Button>
                      ))}
                    </Stack>
                    
                    {continuationLoading && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <CircularProgress size={20} sx={{ mr: 2 }} />
                        <Typography variant="body2" color="text.secondary">
                          Continuing your adventure...
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          )}

          {!result && !error && (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <StoryIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Your story will appear here
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fill out the form and click "Create Story" to begin!
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>
    </Container>
  );
} 
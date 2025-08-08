'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Stack,
  Avatar,
  Chip,
  IconButton,
  Alert,
  Divider,
} from '@mui/material';
import {
  Person as PersonIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  AutoStories as AdventureIcon,
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

const CHARACTER_ROLES = [
  { value: 'protagonist', label: '🦸 Hero/Protagonist', description: 'The main character of your story' },
  { value: 'sidekick', label: '👫 Best Friend/Sidekick', description: 'The loyal companion who helps the hero' },
  { value: 'mentor', label: '🧙 Wise Mentor', description: 'The wise character who guides others' },
  { value: 'villain', label: '😈 Villain/Antagonist', description: 'The character who creates challenges' },
  { value: 'helper', label: '🤝 Helpful Character', description: 'A supporting character who assists' },
];

const CHARACTER_TEMPLATES = [
  {
    name: 'Alex the Explorer',
    age: '12',
    role: 'protagonist' as const,
    personality: 'Brave, curious, and always ready for adventure',
    appearance: 'Wears a explorer hat and carries a backpack full of tools',
    description: 'A young explorer who loves discovering new places and solving mysteries'
  },
  {
    name: 'Luna the Wise',
    age: '15',
    role: 'mentor' as const,
    personality: 'Kind, patient, and full of wisdom',
    appearance: 'Has silver hair and carries an ancient book',
    description: 'A young sage who knows the secrets of the magical world'
  },
  {
    name: 'Buddy the Loyal',
    age: '11',
    role: 'sidekick' as const,
    personality: 'Funny, loyal, and always optimistic',
    appearance: 'Wears colorful clothes and has a big smile',
    description: 'The best friend everyone wishes they had, always ready to help'
  }
];

export default function CharacterBuilder() {
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [currentCharacter, setCurrentCharacter] = useState<Partial<Character>>({
    name: '',
    age: '',
    description: '',
    role: 'protagonist',
    personality: '',
    appearance: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const addCharacter = () => {
    if (!currentCharacter.name || !currentCharacter.description) {
      return;
    }

    const newCharacter: Character = {
      id: Date.now().toString(),
      name: currentCharacter.name,
      age: currentCharacter.age || '12',
      description: currentCharacter.description,
      role: currentCharacter.role || 'protagonist',
      personality: currentCharacter.personality || '',
      appearance: currentCharacter.appearance || '',
    };

    setCharacters([...characters, newCharacter]);
    setCurrentCharacter({
      name: '',
      age: '',
      description: '',
      role: 'protagonist',
      personality: '',
      appearance: '',
    });
  };

  const removeCharacter = (id: string) => {
    setCharacters(characters.filter(char => char.id !== id));
  };

  const useTemplate = (template: typeof CHARACTER_TEMPLATES[0]) => {
    setCurrentCharacter({
      name: template.name,
      age: template.age,
      description: template.description,
      role: template.role,
      personality: template.personality,
      appearance: template.appearance,
    });
  };

  const saveAndContinue = () => {
    // Save characters to localStorage for use in adventure selection
    localStorage.setItem('storyforge-characters', JSON.stringify(characters));
    setShowSuccess(true);
    
    // Navigate to adventure selection after a brief delay
    setTimeout(() => {
      router.push('/adventure-selection');
    }, 1500);
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
        <PersonIcon sx={{ mr: 2, verticalAlign: 'middle', fontSize: 'inherit' }} />
        Character Builder
      </Typography>

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 4 }}>
          Characters saved successfully! Redirecting to adventure selection...
        </Alert>
      )}
      
      <Grid container spacing={4}>
        {/* Character Creation Form */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <AddIcon sx={{ mr: 1 }} />
                Create New Character
              </Typography>

              {/* Quick Templates */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  🎭 Quick Templates
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  {CHARACTER_TEMPLATES.map((template, index) => (
                    <Chip
                      key={index}
                      label={template.name}
                      onClick={() => useTemplate(template)}
                      variant="outlined"
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                </Stack>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Character Name"
                  value={currentCharacter.name || ''}
                  onChange={(e) => setCurrentCharacter({...currentCharacter, name: e.target.value})}
                  placeholder="e.g., Maya the Explorer"
                />

                <TextField
                  fullWidth
                  label="Age"
                  value={currentCharacter.age || ''}
                  onChange={(e) => setCurrentCharacter({...currentCharacter, age: e.target.value})}
                  placeholder="e.g., 12"
                />

                <FormControl fullWidth>
                  <InputLabel>Character Role</InputLabel>
                  <Select
                    value={currentCharacter.role || 'protagonist'}
                    onChange={(e) => setCurrentCharacter({...currentCharacter, role: e.target.value as any})}
                  >
                    {CHARACTER_ROLES.map((role) => (
                      <MenuItem key={role.value} value={role.value}>
                        <Box>
                          <Typography variant="body1">{role.label}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {role.description}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={2}
                  value={currentCharacter.description || ''}
                  onChange={(e) => setCurrentCharacter({...currentCharacter, description: e.target.value})}
                  placeholder="What makes this character special?"
                />

                <TextField
                  fullWidth
                  label="Personality"
                  value={currentCharacter.personality || ''}
                  onChange={(e) => setCurrentCharacter({...currentCharacter, personality: e.target.value})}
                  placeholder="e.g., Brave, curious, funny"
                />

                <TextField
                  fullWidth
                  label="Appearance"
                  value={currentCharacter.appearance || ''}
                  onChange={(e) => setCurrentCharacter({...currentCharacter, appearance: e.target.value})}
                  placeholder="e.g., Wears a red cape and carries a magic wand"
                />

                <Button
                  variant="contained"
                  onClick={addCharacter}
                  disabled={!currentCharacter.name || !currentCharacter.description}
                  startIcon={<AddIcon />}
                  size="large"
                >
                  Add Character
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Character List */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ mr: 1 }} />
                Your Characters ({characters.length})
              </Typography>

              {characters.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <PersonIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No characters yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create your first character to get started!
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {characters.map((character) => (
                    <Card key={character.id} variant="outlined">
                      <CardContent sx={{ pb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Avatar sx={{ mr: 2, bgcolor: `${getRoleColor(character.role)}.main` }}>
                                {character.name.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="h6">{character.name}</Typography>
                                <Chip 
                                  size="small" 
                                  label={CHARACTER_ROLES.find(r => r.value === character.role)?.label} 
                                  color={getRoleColor(character.role) as any}
                                />
                              </Box>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Age: {character.age} • {character.description}
                            </Typography>
                            {character.personality && (
                              <Typography variant="caption" display="block">
                                <strong>Personality:</strong> {character.personality}
                              </Typography>
                            )}
                            {character.appearance && (
                              <Typography variant="caption" display="block">
                                <strong>Appearance:</strong> {character.appearance}
                              </Typography>
                            )}
                          </Box>
                          <IconButton 
                            onClick={() => removeCharacter(character.id)}
                            size="small"
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}

              {characters.length > 0 && (
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={saveAndContinue}
                    startIcon={<AdventureIcon />}
                    sx={{ minWidth: 200 }}
                  >
                    Start Adventure
                  </Button>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Your characters will be saved for the story
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
} 
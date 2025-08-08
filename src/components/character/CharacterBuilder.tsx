'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  TextField,
  Grid,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  Person as PersonIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  AutoStories as AdventureIcon,
} from '@mui/icons-material';
import Link from 'next/link';

interface Character {
  id: string;
  name: string;
  role: string;
  personality: string;
  appearance: string;
}

const CHARACTER_ROLES = [
  'Hero',
  'Sidekick',
  'Wise Mentor',
  'Funny Friend',
  'Brave Warrior',
  'Smart Inventor',
  'Kind Helper',
  'Mysterious Guide'
];

const PERSONALITY_TRAITS = [
  'Brave and bold',
  'Kind and caring',
  'Smart and clever',
  'Funny and cheerful',
  'Curious and adventurous',
  'Loyal and trustworthy',
  'Creative and imaginative',
  'Calm and wise'
];

const APPEARANCE_OPTIONS = [
  'Tall with brown hair',
  'Short with blonde hair',
  'Medium height with black hair',
  'Curly red hair and freckles',
  'Long dark hair and bright eyes',
  'Silver hair and kind smile',
  'Colorful clothes and hat',
  'Magical cloak and staff'
];

export default function CharacterBuilder() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    personality: '',
    appearance: ''
  });

  // Load characters from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('storyforge_characters');
    if (saved) {
      setCharacters(JSON.parse(saved));
    }
  }, []);

  // Save characters to localStorage
  useEffect(() => {
    localStorage.setItem('storyforge_characters', JSON.stringify(characters));
  }, [characters]);

  const handleOpen = (character?: Character) => {
    if (character) {
      setEditingId(character.id);
      setFormData({
        name: character.name,
        role: character.role,
        personality: character.personality,
        appearance: character.appearance
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', role: '', personality: '', appearance: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
    setFormData({ name: '', role: '', personality: '', appearance: '' });
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;

    if (editingId) {
      // Edit existing character
      setCharacters(prev => prev.map(char => 
        char.id === editingId ? { ...char, ...formData } : char
      ));
    } else {
      // Add new character
      const newCharacter: Character = {
        id: Date.now().toString(),
        ...formData
      };
      setCharacters(prev => [...prev, newCharacter]);
    }
    handleClose();
  };

  const handleDelete = (id: string) => {
    setCharacters(prev => prev.filter(char => char.id !== id));
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
        👥 Character Builder
      </Typography>

      {characters.length === 0 && (
        <Alert severity="info" sx={{ mb: 4 }}>
          Create your first character to start your adventure! Characters make your stories more exciting and personal.
        </Alert>
      )}

      {/* Characters Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {characters.map((character) => (
          <Grid item xs={12} sm={6} md={4} key={character.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {character.name}
                </Typography>
                <Chip 
                  label={character.role} 
                  color="primary" 
                  size="small" 
                  sx={{ mb: 2 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  <strong>Personality:</strong> {character.personality}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  <strong>Appearance:</strong> {character.appearance}
                </Typography>
                <Stack direction="row" spacing={1} justifyContent="space-between">
                  <Button 
                    size="small" 
                    onClick={() => handleOpen(character)}
                    variant="outlined"
                  >
                    Edit
                  </Button>
                  <Button 
                    size="small" 
                    color="error"
                    onClick={() => handleDelete(character.id)}
                    startIcon={<DeleteIcon />}
                  >
                    Delete
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Add Character Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              cursor: 'pointer',
              border: '2px dashed',
              borderColor: 'primary.main',
              '&:hover': { borderColor: 'primary.dark' }
            }}
            onClick={() => handleOpen()}
          >
            <CardContent sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}>
              <AddIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" color="primary.main">
                Add New Character
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => handleOpen()}
          startIcon={<AddIcon />}
        >
          Add Character
        </Button>
        
        {characters.length > 0 && (
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={Link}
            href="/adventure"
            startIcon={<AdventureIcon />}
          >
            Start Adventure! 🚀
          </Button>
        )}
      </Box>

      {/* Character Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingId ? 'Edit Character' : 'Create New Character'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            <TextField
              label="Character Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Luna the Explorer"
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              >
                {CHARACTER_ROLES.map((role) => (
                  <MenuItem key={role} value={role}>{role}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Personality</InputLabel>
              <Select
                value={formData.personality}
                onChange={(e) => setFormData(prev => ({ ...prev, personality: e.target.value }))}
              >
                {PERSONALITY_TRAITS.map((trait) => (
                  <MenuItem key={trait} value={trait}>{trait}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Appearance</InputLabel>
              <Select
                value={formData.appearance}
                onChange={(e) => setFormData(prev => ({ ...prev, appearance: e.target.value }))}
              >
                {APPEARANCE_OPTIONS.map((appearance) => (
                  <MenuItem key={appearance} value={appearance}>{appearance}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={handleSave} 
            variant="contained"
            disabled={!formData.name.trim()}
          >
            {editingId ? 'Save Changes' : 'Create Character'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 
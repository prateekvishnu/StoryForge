'use client';

import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Button,
  Stack,
  Divider,
  Paper,
} from '@mui/material';
import {
  Person as PersonIcon,
  Palette as PaletteIcon,
  Psychology as PersonalityIcon,
  School as BackgroundIcon,
  Star as RoleIcon,
  Flag as GoalsIcon,
} from '@mui/icons-material';

import { Character, SimpleCharacter, ComplexCharacter } from '@/types/character';

interface CharacterPreviewProps {
  character: Character | null;
  onEdit?: () => void;
}

export default function CharacterPreview({ character, onEdit }: CharacterPreviewProps) {
  if (!character) {
    return (
      <Card sx={{ p: 3, textAlign: 'center', minHeight: 300 }}>
        <PersonIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Create a character to see the preview
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Your character will appear here as you build it
        </Typography>
      </Card>
    );
  }

  const isSimple = character.ageGroup === '7-10';
  const simpleCharacter = character as SimpleCharacter;
  const complexCharacter = character as ComplexCharacter;

  return (
    <Card sx={{ height: 'fit-content', position: 'sticky', top: 20 }}>
      <CardContent sx={{ p: 3 }}>
        {/* Character Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 2,
              bgcolor: 'primary.main',
              fontSize: '2rem',
            }}
          >
            {character.name.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {character.name}
          </Typography>
          <Chip
            label={`Age ${character.ageGroup}`}
            color="primary"
            variant="outlined"
            size="small"
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Character Attributes */}
        <Stack spacing={2}>
          {/* Appearance */}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
              <PaletteIcon sx={{ mr: 1, fontSize: 20 }} />
              Appearance
            </Typography>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
              gap: 1 
            }}>
              <Chip label={character.attributes.appearance.hairColor} size="small" variant="outlined" />
              <Chip label={character.attributes.appearance.eyeColor} size="small" variant="outlined" />
              <Chip label={character.attributes.appearance.height} size="small" variant="outlined" />
              {!isSimple && (
                <>
                  <Chip label={complexCharacter.attributes.appearance.build} size="small" variant="outlined" />
                  <Chip label={complexCharacter.attributes.appearance.hairStyle} size="small" variant="outlined" />
                </>
              )}
            </Box>
          </Box>

          {/* Personality */}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
              <PersonalityIcon sx={{ mr: 1, fontSize: 20 }} />
              Personality
            </Typography>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', 
              gap: 1 
            }}>
              {isSimple ? (
                <>
                  <Chip label={simpleCharacter.attributes.personality.mood} size="small" color="info" variant="outlined" />
                  <Chip label={simpleCharacter.attributes.personality.favoriteActivity} size="small" color="secondary" variant="outlined" />
                </>
              ) : (
                <>
                  <Chip label={complexCharacter.attributes.personality.mood} size="small" color="info" variant="outlined" />
                  {complexCharacter.attributes.personality.traits.slice(0, 3).map((trait, index) => (
                    <Chip key={index} label={trait} size="small" color="secondary" variant="outlined" />
                  ))}
                </>
              )}
            </Box>
          </Box>

          {/* Role in Story */}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
              <RoleIcon sx={{ mr: 1, fontSize: 20 }} />
              Role
            </Typography>
            <Box>
              <Chip 
                label={character.attributes.role} 
                size="small" 
                color="warning" 
                variant="outlined" 
              />
            </Box>
          </Box>

          {/* Complex Character Additional Details */}
          {!isSimple && (
            <>
              {/* Background */}
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                  <BackgroundIcon sx={{ mr: 1, fontSize: 20 }} />
                  Background
                </Typography>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                  gap: 1 
                }}>
                  <Chip label={complexCharacter.attributes.background.family} size="small" variant="outlined" />
                  <Chip label={complexCharacter.attributes.background.education} size="small" variant="outlined" />
                  <Chip label={complexCharacter.attributes.background.hometown} size="small" variant="outlined" />
                </Box>
              </Box>

              {/* Goals */}
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                  <GoalsIcon sx={{ mr: 1, fontSize: 20 }} />
                  Goals
                </Typography>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                  gap: 1 
                }}>
                  {complexCharacter.attributes.goals.shortTerm.slice(0, 2).map((goal, index) => (
                    <Chip key={index} label={goal} size="small" color="success" variant="outlined" />
                  ))}
                  {complexCharacter.attributes.goals.longTerm.slice(0, 2).map((goal, index) => (
                    <Chip key={`long-${index}`} label={goal} size="small" color="warning" variant="outlined" />
                  ))}
                </Box>
              </Box>
            </>
          )}
        </Stack>

        {/* Action Buttons */}
        {onEdit && (
          <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button
              onClick={onEdit}
              variant="outlined"
              fullWidth
              startIcon={<PersonIcon />}
            >
              Edit Character
            </Button>
          </Box>
        )}

        {/* Character Stats */}
        <Paper sx={{ mt: 3, p: 2, bgcolor: 'background.default' }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Character Stats
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: 1,
            textAlign: 'center' 
          }}>
            <Box>
              <Typography variant="body2" fontWeight="bold">
                {isSimple ? 
                  simpleCharacter.attributes.personality.likes.length : 
                  complexCharacter.attributes.personality.traits.length
                }
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Traits
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" fontWeight="bold">
                {character.ageGroup}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Age Group
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" fontWeight="bold">
                {isSimple ? 'Simple' : 'Complex'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Type
              </Typography>
            </Box>
          </Box>
        </Paper>
      </CardContent>
    </Card>
  );
} 
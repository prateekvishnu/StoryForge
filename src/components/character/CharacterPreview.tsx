'use client';

import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Stack,
  Divider,
  Grid,
  Paper,
} from '@mui/material';
import {
  Person as PersonIcon,
  Palette as PaletteIcon,
  Psychology as PersonalityIcon,
  School as BackgroundIcon,
  Star as RoleIcon,
  Target as GoalsIcon,
  Favorite as HeartIcon,
} from '@mui/icons-material';

import { Character, SimpleCharacter, ComplexCharacter } from '@/types/character';

interface CharacterPreviewProps {
  character: Character;
  showActions?: boolean;
  compact?: boolean;
}

export default function CharacterPreview({ character, showActions = false, compact = false }: CharacterPreviewProps) {
  const isSimple = character.ageGroup === '7-10';
  const simpleChar = character as SimpleCharacter;
  const complexChar = character as ComplexCharacter;

  const getCharacterAvatar = () => {
    // Generate a colorful avatar based on character attributes
    const appearance = character.attributes.appearance;
    const initials = character.name.split(' ').map(n => n[0]).join('').toUpperCase();
    
    return (
      <Avatar
        sx={{
          width: compact ? 60 : 120,
          height: compact ? 60 : 120,
          backgroundColor: 'primary.main',
          fontSize: compact ? '1.2rem' : '2rem',
          fontWeight: 'bold',
        }}
      >
        {initials}
      </Avatar>
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  if (compact) {
    return (
      <Card sx={{ maxWidth: 300 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {getCharacterAvatar()}
            <Box sx={{ ml: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {character.name}
              </Typography>
              <Chip
                size="small"
                label={isSimple ? simpleChar.attributes.role : complexChar.attributes.role}
                color="primary"
                variant="outlined"
              />
            </Box>
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            Age Group: {character.ageGroup}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Created: {formatDate(character.createdAt)}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Character Header */}
      <Paper sx={{ p: 3, mb: 3, backgroundColor: 'primary.50' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {getCharacterAvatar()}
          <Box sx={{ ml: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {character.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip
                label={`Ages ${character.ageGroup}`}
                color="primary"
                variant="outlined"
              />
              <Chip
                label={isSimple ? simpleChar.attributes.role : complexChar.attributes.role}
                color="secondary"
                icon={<RoleIcon />}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Created: {formatDate(character.createdAt)} • 
              Updated: {formatDate(character.updatedAt)}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Appearance Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PaletteIcon color="primary" />
                <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                  Appearance
                </Typography>
              </Box>
              
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Physical Features
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                    <Chip size="small" label={`${character.attributes.appearance.hairColor} hair`} />
                    <Chip size="small" label={`${character.attributes.appearance.eyeColor} eyes`} />
                    <Chip size="small" label={`${character.attributes.appearance.skinTone} skin`} />
                    <Chip size="small" label={`${character.attributes.appearance.height} height`} />
                    {!isSimple && complexChar.attributes.appearance.build && (
                      <Chip size="small" label={`${complexChar.attributes.appearance.build} build`} />
                    )}
                  </Box>
                </Box>

                {character.attributes.appearance.clothing.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Clothing
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                      {character.attributes.appearance.clothing.map((item, index) => (
                        <Chip key={index} size="small" label={item} variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                )}

                {character.attributes.appearance.accessories.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Accessories
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                      {character.attributes.appearance.accessories.map((item, index) => (
                        <Chip key={index} size="small" label={item} variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                )}

                {!isSimple && complexChar.attributes.appearance.distinctiveFeatures.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Distinctive Features
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                      {complexChar.attributes.appearance.distinctiveFeatures.map((feature, index) => (
                        <Chip key={index} size="small" label={feature} variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Personality Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PersonalityIcon color="primary" />
                <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                  Personality
                </Typography>
              </Box>
              
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Mood
                  </Typography>
                  <Chip
                    label={character.attributes.personality.mood}
                    color="secondary"
                    sx={{ mt: 1, textTransform: 'capitalize' }}
                  />
                </Box>

                {isSimple ? (
                  <>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Favorite Activity
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {simpleChar.attributes.personality.favoriteActivity}
                      </Typography>
                    </Box>

                    {simpleChar.attributes.personality.likes.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Likes
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                          {simpleChar.attributes.personality.likes.map((like, index) => (
                            <Chip
                              key={index}
                              size="small"
                              label={like}
                              icon={<HeartIcon />}
                              color="success"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Box>
                    )}

                    {simpleChar.attributes.personality.dislikes.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Dislikes
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                          {simpleChar.attributes.personality.dislikes.map((dislike, index) => (
                            <Chip
                              key={index}
                              size="small"
                              label={dislike}
                              color="error"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </>
                ) : (
                  <>
                    {complexChar.attributes.personality.traits.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Personality Traits
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                          {complexChar.attributes.personality.traits.map((trait, index) => (
                            <Chip key={index} size="small" label={trait} color="info" variant="outlined" />
                          ))}
                        </Box>
                      </Box>
                    )}

                    {complexChar.attributes.personality.strengths.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Strengths
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                          {complexChar.attributes.personality.strengths.map((strength, index) => (
                            <Chip key={index} size="small" label={strength} color="success" variant="outlined" />
                          ))}
                        </Box>
                      </Box>
                    )}

                    {complexChar.attributes.personality.motivations.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Motivations
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                          {complexChar.attributes.personality.motivations.map((motivation, index) => (
                            <Chip key={index} size="small" label={motivation} color="warning" variant="outlined" />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Background Section (Complex Characters Only) */}
        {!isSimple && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BackgroundIcon color="primary" />
                  <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                    Background
                  </Typography>
                </Box>
                
                <Grid container spacing={2}>
                  {complexChar.attributes.background.hometown && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Hometown
                      </Typography>
                      <Typography variant="body2">
                        {complexChar.attributes.background.hometown}
                      </Typography>
                    </Grid>
                  )}

                  {complexChar.attributes.background.family && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Family
                      </Typography>
                      <Typography variant="body2">
                        {complexChar.attributes.background.family}
                      </Typography>
                    </Grid>
                  )}

                  {complexChar.attributes.background.education && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Education
                      </Typography>
                      <Typography variant="body2">
                        {complexChar.attributes.background.education}
                      </Typography>
                    </Grid>
                  )}

                  {complexChar.attributes.background.hobbies.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Hobbies & Interests
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                        {complexChar.attributes.background.hobbies.map((hobby, index) => (
                          <Chip key={index} size="small" label={hobby} variant="outlined" />
                        ))}
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Goals Section (Complex Characters Only) */}
        {!isSimple && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <GoalsIcon color="primary" />
                  <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                    Goals & Dreams
                  </Typography>
                </Box>
                
                <Grid container spacing={2}>
                  {complexChar.attributes.goals.shortTerm.length > 0 && (
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Short-term Goals
                      </Typography>
                      <Stack spacing={1} sx={{ mt: 1 }}>
                        {complexChar.attributes.goals.shortTerm.map((goal, index) => (
                          <Chip key={index} size="small" label={goal} color="info" variant="outlined" />
                        ))}
                      </Stack>
                    </Grid>
                  )}

                  {complexChar.attributes.goals.longTerm.length > 0 && (
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Long-term Goals
                      </Typography>
                      <Stack spacing={1} sx={{ mt: 1 }}>
                        {complexChar.attributes.goals.longTerm.map((goal, index) => (
                          <Chip key={index} size="small" label={goal} color="warning" variant="outlined" />
                        ))}
                      </Stack>
                    </Grid>
                  )}

                  {complexChar.attributes.goals.dreams.length > 0 && (
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Dreams & Aspirations
                      </Typography>
                      <Stack spacing={1} sx={{ mt: 1 }}>
                        {complexChar.attributes.goals.dreams.map((dream, index) => (
                          <Chip key={index} size="small" label={dream} color="secondary" variant="outlined" />
                        ))}
                      </Stack>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
} 
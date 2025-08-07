'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  Avatar,
  Tabs,
  Tab,
  Paper,
  LinearProgress,
  Stack,
} from '@mui/material';
import {
  AutoStories as AdventureIcon,
  Search as MysteryIcon,
  Castle as FantasyIcon,
  Favorite as FriendshipIcon,
  School as EducationalIcon,
  Timer as TimerIcon,
  Psychology as DecisionIcon,
  Star as DifficultyIcon,
} from '@mui/icons-material';

import { StoryTemplate, STORY_TEMPLATES } from '@/types/story';

interface StoryTemplatesProps {
  ageGroup?: '7-10' | '11-16';
  onTemplateSelect: (template: StoryTemplate) => void;
  onCreateFromScratch?: () => void;
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

export default function StoryTemplates({ 
  ageGroup: initialAgeGroup, 
  onTemplateSelect, 
  onCreateFromScratch 
}: StoryTemplatesProps) {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<'7-10' | '11-16'>(
    initialAgeGroup || '7-10'
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { label: 'All Stories', value: 'all', icon: <AutoStories /> },
    { label: 'Adventure', value: 'adventure', icon: <AdventureIcon /> },
    { label: 'Mystery', value: 'mystery', icon: <MysteryIcon /> },
    { label: 'Fantasy', value: 'fantasy', icon: <FantasyIcon /> },
    { label: 'Friendship', value: 'friendship', icon: <FriendshipIcon /> },
    { label: 'Educational', value: 'educational', icon: <EducationalIcon /> },
  ];

  const getTemplatesForAge = (ageGroup: '7-10' | '11-16'): StoryTemplate[] => {
    return ageGroup === '7-10' ? STORY_TEMPLATES.simple : STORY_TEMPLATES.complex;
  };

  const filteredTemplates = getTemplatesForAge(selectedAgeGroup).filter(
    template => selectedCategory === 'all' || template.category === selectedCategory
  );

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
      default: return <AutoStories />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'primary';
    }
  };

  const getTemplateAvatar = (template: StoryTemplate) => {
    const initials = template.name.split(' ').map(n => n[0]).join('').toUpperCase();
    return (
      <Avatar
        sx={{
          width: 60,
          height: 60,
          backgroundColor: getCategoryColor(template.category),
          fontWeight: 'bold',
          fontSize: '1.2rem',
        }}
      >
        {initials}
      </Avatar>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
        📚 Choose a Story Template
      </Typography>

      <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', color: 'text.secondary' }}>
        Select a pre-made story template to get started quickly, or create your own from scratch!
      </Typography>

      {/* Age Group Selection */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Age Group:
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant={selectedAgeGroup === '7-10' ? 'contained' : 'outlined'}
            onClick={() => setSelectedAgeGroup('7-10')}
            size="large"
            sx={{ minWidth: 120 }}
          >
            Ages 7-10
          </Button>
          <Button
            variant={selectedAgeGroup === '11-16' ? 'contained' : 'outlined'}
            onClick={() => setSelectedAgeGroup('11-16')}
            size="large"
            sx={{ minWidth: 120 }}
          >
            Ages 11-16
          </Button>
        </Box>
      </Box>

      {/* Category Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={selectedCategory}
          onChange={(_, newValue) => setSelectedCategory(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {categories.map((category) => (
            <Tab
              key={category.value}
              value={category.value}
              label={category.label}
              icon={category.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Paper>

      {/* Create from Scratch Option */}
      {onCreateFromScratch && (
        <Card sx={{ mb: 4, border: '2px dashed', borderColor: 'primary.main' }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
              🎨 Create Your Own Story
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              Start with a blank canvas and build your story from scratch using our visual editor.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={onCreateFromScratch}
              sx={{ minWidth: 200 }}
            >
              Start Creating
            </Button>
          </CardContent>
        </Card>
      )}

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
                {/* Template Header */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  {getTemplateAvatar(template)}
                  <Box sx={{ ml: 2, flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
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
                        mb: 1,
                      }}
                    />
                  </Box>
                </Box>

                {/* Template Description */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                  {template.description}
                </Typography>

                {/* Template Stats */}
                <Stack spacing={1} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TimerIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      ~{template.estimatedTime} minutes
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DecisionIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {template.decisionPoints} decision points
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DifficultyIcon fontSize="small" color="action" />
                    <Chip
                      size="small"
                      label={template.difficulty}
                      color={getDifficultyColor(template.difficulty) as any}
                      variant="outlined"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </Box>
                </Stack>

                {/* Progress Visualization */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Story Structure:
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(template.nodes.length / (template.nodes.length + 2)) * 100}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getCategoryColor(template.category),
                        borderRadius: 4,
                      },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {template.nodes.length} story segments
                  </Typography>
                </Box>

                {/* Tags */}
                {template.tags.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Tags:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {template.tags.slice(0, 4).map((tag, index) => (
                        <Chip
                          key={index}
                          size="small"
                          label={tag}
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                      {template.tags.length > 4 && (
                        <Chip
                          size="small"
                          label={`+${template.tags.length - 4} more`}
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>
                  </Box>
                )}
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
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

      {/* No Templates Message */}
      {filteredTemplates.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            color: 'text.secondary',
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            No templates found
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Try selecting a different category or age group.
          </Typography>
          {onCreateFromScratch && (
            <Button
              variant="outlined"
              onClick={onCreateFromScratch}
              size="large"
            >
              Create Your Own Story Instead
            </Button>
          )}
        </Box>
      )}

      {/* Template Statistics */}
      <Box sx={{ mt: 6, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
          📊 Template Statistics
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                {getTemplatesForAge(selectedAgeGroup).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Available Templates
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="secondary.main" sx={{ fontWeight: 'bold' }}>
                {Math.round(getTemplatesForAge(selectedAgeGroup).reduce((acc, t) => acc + t.estimatedTime, 0) / getTemplatesForAge(selectedAgeGroup).length) || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg. Minutes
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                {Math.round(getTemplatesForAge(selectedAgeGroup).reduce((acc, t) => acc + t.decisionPoints, 0) / getTemplatesForAge(selectedAgeGroup).length) || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg. Decisions
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
                {new Set(getTemplatesForAge(selectedAgeGroup).map(t => t.category)).size}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Categories
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
} 
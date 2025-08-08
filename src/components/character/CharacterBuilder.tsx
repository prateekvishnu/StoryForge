'use client';

import { Container, Typography, Card, CardContent, Box } from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';

export default function CharacterBuilder() {
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
      
      <Card sx={{ maxWidth: 600, mx: 'auto', textAlign: 'center' }}>
        <CardContent sx={{ p: 4 }}>
          <PersonIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Character Builder Coming Soon!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            We're working hard to bring you an amazing character creation experience. 
            This feature will allow you to create detailed, age-appropriate characters 
            for your stories with drag-and-drop customization.
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: 2, 
            mt: 3 
          }}>
            <Typography variant="h6" color="primary.main">
              ✨ Drag & Drop Interface
            </Typography>
            <Typography variant="h6" color="secondary.main">
              🎨 Age-Appropriate Design
            </Typography>
            <Typography variant="h6" color="warning.main">
              👥 Character Templates
            </Typography>
            <Typography variant="h6" color="info.main">
              📝 Story Integration
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
} 
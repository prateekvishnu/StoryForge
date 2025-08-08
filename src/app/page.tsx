'use client';

import { Box, Container, Typography, Button, Card, CardContent, Chip, Stack } from '@mui/material';
import {
  AutoStories as CreateIcon,
  MenuBook as ReadIcon,
  Person as PersonIcon,
  Palette as ArtIcon,
  Share as ShareIcon,
  School as LearnIcon,
} from '@mui/icons-material';
import Link from 'next/link';

export default function HomePage() {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Hero Section */}
      <Box sx={{ pt: 8, pb: 12, textAlign: 'center' }}>
        <Typography 
          variant="h1" 
          sx={{ 
            fontSize: { xs: '3rem', sm: '4rem', md: '5rem' }, 
            fontWeight: 800, 
            background: 'linear-gradient(135deg, #60a5fa 30%, #34d399 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 4,
            lineHeight: 1.1,
            letterSpacing: '-0.025em',
          }}
        >
          Welcome to StoryForge! ✨
        </Typography>
        <Typography 
          variant="h4" 
          sx={{ 
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }, 
            color: 'text.secondary', 
            maxWidth: '700px', 
            mx: 'auto', 
            mb: 6,
            lineHeight: 1.4,
            fontWeight: 500,
          }}
        >
          Create amazing adventures with AI magic! Build characters, craft stories, and bring your imagination to life! 📚
        </Typography>
        
        <Button
          variant="contained"
          color="secondary"
          size="large"
          startIcon={<CreateIcon />}
          sx={{ 
            minWidth: 200, 
            py: 2, 
            px: 4,
            fontSize: '1.25rem',
            fontWeight: 600,
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(52, 211, 153, 0.3)',
            '&:hover': {
              boxShadow: '0 12px 40px rgba(52, 211, 153, 0.4)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease-in-out',
          }}
          component={Link}
          href="/create"
        >
          ✨ Start Creating!
        </Button>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography 
          variant="h2" 
          sx={{ 
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            fontWeight: 700, 
            color: 'text.primary', 
            textAlign: 'center', 
            mb: 6,
          }}
        >
          What Can You Do? 🤔
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 8 }}>
          {/* Single Create Story Feature */}
          <Card sx={{ maxWidth: 400, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: 1, textAlign: 'center', p: 4 }}>
              <CreateIcon sx={{ fontSize: 80, color: 'secondary.main', mb: 3 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, color: 'text.primary' }}>
                📝 Create a Story
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 3 }}>
                Create awesome adventures with help from AI! Make stories about anything you can imagine with interactive choices and exciting plots!
              </Typography>
              <Button
                component={Link}
                href="/create"
                variant="contained"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  bgcolor: 'secondary.main',
                  '&:hover': { bgcolor: 'secondary.dark' }
                }}
              >
                Start Creating! ✨
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>

      {/* Sample Stories Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography 
          variant="h2" 
          sx={{ 
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            fontWeight: 700, 
            color: 'text.primary', 
            textAlign: 'center', 
            mb: 6,
          }}
        >
          Check Out These Cool Stories! ⭐
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr 1fr' }, gap: 4 }}>
          {/* Sample Story Cards */}
          <Card sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
            },
            transition: 'all 0.3s ease-in-out',
          }}>
            <CardContent sx={{ flex: 1, p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                📚 The Magic Forest Adventure
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.9rem' }}>
                by Alex, age 9
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                Join Emma as she discovers a hidden forest full of talking animals and magical surprises! What will she find next?
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                <Chip label="Adventure" size="small" color="primary" />
                <Chip label="Magic" size="small" color="secondary" />
                <Chip label="Animals" size="small" color="info" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">⏱️ 5 min</Typography>
                <Typography variant="body2" color="text.secondary">Easy</Typography>
              </Box>
              <Button variant="contained" fullWidth sx={{ borderRadius: '12px' }}>
                Read Now! 📖
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
            },
            transition: 'all 0.3s ease-in-out',
          }}>
            <CardContent sx={{ flex: 1, p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                📚 Mystery of the Missing Cookies
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.9rem' }}>
                by Maya, age 10
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                Someone took all the cookies from the kitchen! Help Detective Sam solve this yummy mystery before dinner time!
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                <Chip label="Mystery" size="small" color="primary" />
                <Chip label="Detective" size="small" color="secondary" />
                <Chip label="Funny" size="small" color="warning" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">⏱️ 8 min</Typography>
                <Typography variant="body2" color="text.secondary">Medium</Typography>
              </Box>
              <Button variant="contained" fullWidth sx={{ borderRadius: '12px' }}>
                Read Now! 📖
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
            },
            transition: 'all 0.3s ease-in-out',
          }}>
            <CardContent sx={{ flex: 1, p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                📚 Space Dragon Rescue
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.9rem' }}>
                by Jordan, age 11
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                Captain Zoe must save friendly dragons from the mean space pirates! An epic adventure among the stars awaits!
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                <Chip label="Space" size="small" color="primary" />
                <Chip label="Dragons" size="small" color="secondary" />
                <Chip label="Heroes" size="small" color="success" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">⏱️ 12 min</Typography>
                <Typography variant="body2" color="text.secondary">Medium</Typography>
              </Box>
              <Button variant="contained" fullWidth sx={{ borderRadius: '12px' }}>
                Read Now! 📖
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>

      {/* Safety Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Card sx={{ 
          background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.1) 0%, rgba(96, 165, 250, 0.1) 100%)',
          border: '1px solid rgba(52, 211, 153, 0.2)',
          borderRadius: '20px',
          p: 4,
        }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
              fontWeight: 700, 
              color: 'text.primary', 
              textAlign: 'center', 
              mb: 4,
            }}
          >
            🛡️ Safe & Fun for Everyone!
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary" 
            sx={{ 
              textAlign: 'center', 
              maxWidth: 800, 
              mx: 'auto',
              fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
              lineHeight: 1.6,
            }}
          >
            StoryForge is super safe! Our AI only creates nice, fun stories. We never share your information with strangers.
          </Typography>
        </Card>
      </Container>
    </Box>
  );
}
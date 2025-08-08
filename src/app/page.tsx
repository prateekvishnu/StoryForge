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
      <Box sx={{ 
        pt: { xs: 6, sm: 8 }, 
        pb: { xs: 8, sm: 12 }, 
        textAlign: 'center',
        px: { xs: 2, sm: 4 }
      }}>
        <Typography 
          variant="h1" 
          sx={{ 
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem', lg: '5rem' }, 
            fontWeight: 800, 
            background: 'linear-gradient(135deg, #60a5fa 30%, #34d399 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: { xs: 3, sm: 4 },
            lineHeight: { xs: 1.2, sm: 1.1 },
            letterSpacing: '-0.025em',
          }}
        >
          Welcome to StoryForge! ✨
        </Typography>
        <Typography 
          variant="h4" 
          sx={{ 
            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem', lg: '2rem' }, 
            color: 'text.secondary', 
            maxWidth: { xs: '90%', sm: '700px' }, 
            mx: 'auto', 
            mb: { xs: 4, sm: 6 },
            lineHeight: 1.4,
            fontWeight: 500,
            px: { xs: 1, sm: 0 }
          }}
        >
          Create amazing adventures with AI magic! Build characters, craft stories, and bring your imagination to life! 📚
        </Typography>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8 }, px: { xs: 2, sm: 3 } }}>
        <Typography 
          variant="h2" 
          sx={{ 
            fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem', lg: '3rem' },
            fontWeight: 700, 
            color: 'text.primary', 
            textAlign: 'center', 
            mb: { xs: 4, sm: 6 },
          }}
        >
          Your Story Journey! 🚀
        </Typography>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
          gap: { xs: 3, sm: 4 }, 
          mb: { xs: 6, sm: 8 } 
        }}>
          {/* Step 1: Create Characters */}
          <Card sx={{ display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ 
              flex: 1, 
              textAlign: 'center', 
              p: { xs: 3, sm: 4 } 
            }}>
              <PersonIcon sx={{ 
                fontSize: { xs: 60, sm: 80 }, 
                color: 'primary.main', 
                mb: { xs: 2, sm: 3 } 
              }} />
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 'bold', 
                  mb: { xs: 2, sm: 3 }, 
                  color: 'text.primary',
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
                }}
              >
                👥 Step 1: Create Characters
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ 
                  lineHeight: 1.8, 
                  mb: { xs: 2, sm: 3 },
                  fontSize: { xs: '0.95rem', sm: '1rem' }
                }}
              >
                Start your adventure by creating amazing characters! Give them names, personalities, and special powers. They'll be the heroes of your story!
              </Typography>
              <Button
                component={Link}
                href="/characters"
                variant="contained"
                size="large"
                sx={{
                  px: { xs: 3, sm: 4 },
                  py: { xs: 1.25, sm: 1.5 },
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  fontWeight: 'bold',
                  bgcolor: 'primary.main',
                  '&:hover': { bgcolor: 'primary.dark' },
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                Create Characters! 👥
              </Button>
            </CardContent>
          </Card>

          {/* Step 2: Adventure Time */}
          <Card sx={{ display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ 
              flex: 1, 
              textAlign: 'center', 
              p: { xs: 3, sm: 4 } 
            }}>
              <CreateIcon sx={{ 
                fontSize: { xs: 60, sm: 80 }, 
                color: 'secondary.main', 
                mb: { xs: 2, sm: 3 } 
              }} />
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 'bold', 
                  mb: { xs: 2, sm: 3 }, 
                  color: 'text.primary',
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
                }}
              >
                ⚡ Step 2: Adventure Time!
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ 
                  lineHeight: 1.8, 
                  mb: { xs: 2, sm: 3 },
                  fontSize: { xs: '0.95rem', sm: '1rem' }
                }}
              >
                Once you have characters, start your choose-your-adventure story! Make decisions, explore different paths, and see where your imagination takes you!
              </Typography>
              <Button
                component={Link}
                href="/adventure"
                variant="contained"
                size="large"
                sx={{
                  px: { xs: 3, sm: 4 },
                  py: { xs: 1.25, sm: 1.5 },
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  fontWeight: 'bold',
                  bgcolor: 'secondary.main',
                  '&:hover': { bgcolor: 'secondary.dark' },
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                Start Adventure! ⚡
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>

      {/* Sample Stories Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8 }, px: { xs: 2, sm: 3 } }}>
        <Typography 
          variant="h2" 
          sx={{ 
            fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem', lg: '3rem' },
            fontWeight: 700, 
            color: 'text.primary', 
            textAlign: 'center', 
            mb: { xs: 4, sm: 6 },
          }}
        >
          Check Out These Cool Stories! ⭐
        </Typography>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            lg: 'repeat(3, 1fr)' 
          }, 
          gap: { xs: 3, sm: 4 },
          alignItems: 'stretch'
        }}>
          {/* Sample Story Cards */}
          <Card sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
            },
            transition: 'all 0.3s ease-in-out',
          }}>
            <CardContent sx={{ 
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              p: { xs: 3, sm: 4 }
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                📚 The Magic Forest Adventure
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.9rem' }}>
                by Alex, age 9
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ 
                  mb: 3, 
                  lineHeight: 1.6,
                  flex: 1,
                  display: 'flex',
                  alignItems: 'flex-start'
                }}
              >
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
              <Button 
                variant="contained" 
                fullWidth 
                sx={{ 
                  borderRadius: '12px',
                  mt: 'auto',
                  py: 1.5
                }}
              >
                Read Now! 📖
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
            },
            transition: 'all 0.3s ease-in-out',
          }}>
            <CardContent sx={{ 
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              p: { xs: 3, sm: 4 }
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                📚 Mystery of the Missing Cookies
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.9rem' }}>
                by Maya, age 10
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ 
                  mb: 3, 
                  lineHeight: 1.6,
                  flex: 1,
                  display: 'flex',
                  alignItems: 'flex-start'
                }}
              >
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
              <Button 
                variant="contained" 
                fullWidth 
                sx={{ 
                  borderRadius: '12px',
                  mt: 'auto',
                  py: 1.5
                }}
              >
                Read Now! 📖
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
            },
            transition: 'all 0.3s ease-in-out',
          }}>
            <CardContent sx={{ 
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              p: { xs: 3, sm: 4 }
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                📚 Space Dragon Rescue
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.9rem' }}>
                by Jordan, age 11
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ 
                  mb: 3, 
                  lineHeight: 1.6,
                  flex: 1,
                  display: 'flex',
                  alignItems: 'flex-start'
                }}
              >
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
              <Button 
                variant="contained" 
                fullWidth 
                sx={{ 
                  borderRadius: '12px',
                  mt: 'auto',
                  py: 1.5
                }}
              >
                Read Now! 📖
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>

      {/* Safety Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8 }, px: { xs: 2, sm: 3 } }}>
        <Card sx={{ 
          background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.1) 0%, rgba(96, 165, 250, 0.1) 100%)',
          border: '1px solid rgba(52, 211, 153, 0.2)',
          borderRadius: { xs: '16px', sm: '20px' },
          p: { xs: 3, sm: 4 },
        }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2.5rem' },
              fontWeight: 700, 
              color: 'text.primary', 
              textAlign: 'center', 
              mb: { xs: 3, sm: 4 },
            }}
          >
            🛡️ Safe & Fun for Everyone!
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary" 
            sx={{ 
              textAlign: 'center', 
              maxWidth: { xs: '100%', sm: 800 }, 
              mx: 'auto',
              fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem', lg: '1.5rem' },
              lineHeight: 1.6,
              px: { xs: 1, sm: 0 }
            }}
          >
            StoryForge is super safe! Our AI only creates nice, fun stories. We never share your information with strangers.
          </Typography>
        </Card>
      </Container>
    </Box>
  );
}
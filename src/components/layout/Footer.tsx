'use client';

import {
  Box,
  Container,
  Typography,
  Button,
  Divider,
  Chip,
  Stack,
} from '@mui/material';
import {
  AutoStories as CreateIcon,
  MenuBook as ReadIcon,
  Person as PersonIcon,
  Info as InfoIcon,
  Help as HelpIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import Link from 'next/link';

export default function Footer() {
  return (
    <Box 
      component="footer" 
      sx={{ 
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        py: 6,
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '2fr 1fr 1fr' }, 
          gap: 4,
          mb: 4,
        }}>
          
          {/* Brand Section */}
          <Box>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                background: 'linear-gradient(135deg, #60a5fa 30%, #34d399 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              StoryForge ✨
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
              Create amazing adventures with AI magic! Build characters, craft stories, and bring your imagination to life.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              <Chip label="AI-Powered" size="small" color="primary" />
              <Chip label="Child-Safe" size="small" color="secondary" />
              <Chip label="Creative" size="small" color="success" />
            </Stack>
          </Box>

          {/* Create Section */}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
              Create & Explore
            </Typography>
            <Stack spacing={1.5}>
              <Button
                component={Link}
                href="/create"
                variant="text"
                startIcon={<CreateIcon />}
                sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}
              >
                Create Stories
              </Button>
              <Button
                component={Link}
                href="/characters"
                variant="text"
                startIcon={<PersonIcon />}
                sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}
              >
                Character Builder
              </Button>
              <Button
                component={Link}
                href="/read"
                variant="text"
                startIcon={<ReadIcon />}
                sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}
              >
                Read Stories
              </Button>
            </Stack>
          </Box>

          {/* Help & Info Section */}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
              Help & Info
            </Typography>
            <Stack spacing={1.5}>
              <Button
                component={Link}
                href="/help"
                variant="text"
                startIcon={<HelpIcon />}
                sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}
              >
                Help Center
              </Button>
              <Button
                component={Link}
                href="/safety"
                variant="text"
                startIcon={<SecurityIcon />}
                sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}
              >
                Safety & Privacy
              </Button>
              <Button
                component={Link}
                href="/about"
                variant="text"
                startIcon={<InfoIcon />}
                sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}
              >
                About StoryForge
              </Button>
            </Stack>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />
        
        {/* Bottom Section */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'center', sm: 'flex-start' },
          gap: 2,
        }}>
          <Typography variant="body2" color="text.secondary">
            © 2024 StoryForge. Made with ❤️ for young storytellers.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Typography 
              component={Link} 
              href="/terms" 
              variant="body2" 
              color="text.secondary"
              sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
            >
              Terms of Service
            </Typography>
            <Typography 
              component={Link} 
              href="/privacy" 
              variant="body2" 
              color="text.secondary"
              sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
            >
              Privacy Policy
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
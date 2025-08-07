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
  Help as HelpIcon,
  SupervisorAccount as ParentIcon,
  Security as SecurityIcon,
  Lock as PrivacyIcon,
  Report as ReportIcon,
  Lightbulb as IdeaIcon,
  Group as FriendsIcon,
  Celebration as FunIcon,
} from '@mui/icons-material';
import Link from 'next/link';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: '4px solid',
        borderColor: 'primary.main',
        mt: 'auto',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, 
            gap: 4 
          }}
        >
          {/* Brand Section */}
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'center', md: 'flex-start' }, mb: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                }}
              >
                📚
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                StoryForge
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '300px', mx: { xs: 'auto', md: 0 } }}>
              Create amazing stories with your imagination! 🌟
            </Typography>
          </Box>

          {/* Fun Stuff Section */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 0.35, fontWeight: 600 }}>
              Fun Stuff!
            </Typography>
            <Stack spacing={1}>
              <Button
                variant="text"
                startIcon={<CreateIcon />}
                component={Link}
                href="/create"
                sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
              >
                Create Story
              </Button>
              <Button
                variant="text"
                startIcon={<ReadIcon />}
                component={Link}
                href="/read"
                sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
              >
                Read Stories
              </Button>
              <Button
                variant="text"
                startIcon={<PersonIcon />}
                component={Link}
                href="/characters"
                sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
              >
                Characters
              </Button>
              <Button
                variant="text"
                startIcon={<HelpIcon />}
                component={Link}
                href="/help"
                sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
              >
                Need Help?
              </Button>
            </Stack>
          </Box>

          {/* For Parents Section */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 0.35, fontWeight: 600 }}>
              For Parents
            </Typography>
            <Stack spacing={1}>
              <Button
                variant="text"
                startIcon={<ParentIcon />}
                component={Link}
                href="/parent"
                sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
              >
                Parent Dashboard
              </Button>
              <Button
                variant="text"
                startIcon={<SecurityIcon />}
                component={Link}
                href="/safety"
                sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
              >
                Stay Safe
              </Button>
              <Button
                variant="text"
                startIcon={<PrivacyIcon />}
                component={Link}
                href="/privacy"
                sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
              >
                Privacy
              </Button>
              <Button
                variant="text"
                startIcon={<ReportIcon />}
                component={Link}
                href="/report"
                sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
              >
                Tell a Grown-up
              </Button>
            </Stack>
          </Box>

          {/* Story Tips Section */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 0.35, fontWeight: 600, textAlign: 'center' }}>
              Story Tips!
            </Typography>
            <Stack spacing={2} alignItems="center">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IdeaIcon color="primary" />
                <Typography variant="body2">Use your imagination!</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FriendsIcon color="primary" />
                <Typography variant="body2">Ask friends for ideas!</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FunIcon color="primary" />
                <Typography variant="body2">Have fun creating!</Typography>
              </Box>
            </Stack>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            © 2024 StoryForge. Made with 💝 for young storytellers.
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              icon={<SecurityIcon />}
              label="COPPA Compliant"
              variant="outlined"
              size="small"
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
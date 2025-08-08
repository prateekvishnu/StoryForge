'use client';

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
} from '@mui/material';
import Link from 'next/link';

export default function Header() {
  return (
    <AppBar position="sticky" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ fontWeight: 700, letterSpacing: '-0.025em' }}
                >
                  StoryForge
                </Typography>
              </Box>
            </Link>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
'use client';

import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Container,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  AutoStories as CreateIcon,
  MenuBook as ReadIcon,
  Person as PersonIcon,
  SupervisorAccount as ParentIcon,
} from '@mui/icons-material';
import Link from 'next/link';

interface HeaderProps {
  userName?: string;
}

export default function Header({ userName }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navigationItems = [
    { text: 'Create Story', href: '/create', icon: <CreateIcon /> },
    { text: 'Read Stories', href: '/read', icon: <ReadIcon /> },
    { text: 'Characters', href: '/characters', icon: <PersonIcon /> },
    { text: 'Parents', href: '/parent', icon: <ParentIcon /> },
  ];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Menu</Typography>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      {userName && (
        <Box sx={{ px: 2, pb: 2 }}>
          <Chip 
            avatar={<Avatar sx={{ bgcolor: 'primary.main' }}>👋</Avatar>}
            label={`Hi, ${userName}!`}
            variant="outlined"
            sx={{ width: '100%' }}
          />
        </Box>
      )}
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              component={Link} 
              href={item.href}
              onClick={handleDrawerToggle}
            >
              <Box sx={{ mr: 2 }}>{item.icon}</Box>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
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

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            <Button
              component={Link}
              href="/create"
              variant="contained"
              color="secondary"
              startIcon={<CreateIcon />}
              sx={{ minWidth: 120 }}
            >
              Create
            </Button>
            <Button
              component={Link}
              href="/read"
              variant="contained"
              sx={{ 
                minWidth: 120,
                bgcolor: '#f59e0b',
                '&:hover': { bgcolor: '#d97706' }
              }}
              startIcon={<ReadIcon />}
            >
              Read
            </Button>
            <Button
              component={Link}
              href="/characters"
              variant="contained"
              sx={{ 
                minWidth: 120,
                bgcolor: '#8b5cf6',
                '&:hover': { bgcolor: '#7c3aed' }
              }}
              startIcon={<PersonIcon />}
            >
              Characters
            </Button>
            <Button
              component={Link}
              href="/story-planner"
              variant="contained"
              sx={{ 
                minWidth: 120,
                bgcolor: '#06b6d4',
                '&:hover': { bgcolor: '#0891b2' }
              }}
              startIcon={<CreateIcon />}
            >
              Story Planner
            </Button>
          </Box>

          {/* User Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {userName && (
              <Chip 
                avatar={<Avatar sx={{ bgcolor: 'primary.main' }}>👋</Avatar>}
                label={`Hi, ${userName}!`}
                variant="outlined"
                sx={{ display: { xs: 'none', lg: 'flex' } }}
              />
            )}
            
            <Button
              component={Link}
              href="/parent"
              variant="outlined"
              color="warning"
              startIcon={<ParentIcon />}
              sx={{ display: { xs: 'none', md: 'flex' } }}
            >
              Parents
            </Button>

            {/* Mobile menu button */}
            <IconButton
              onClick={handleDrawerToggle}
              sx={{ display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}
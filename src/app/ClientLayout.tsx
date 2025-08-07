'use client';

import { Box, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Create Material UI dark theme with improved typography
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#60a5fa', // Light blue
      light: '#93c5fd',
      dark: '#2563eb',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#34d399', // Emerald
      light: '#6ee7b7',
      dark: '#059669',
      contrastText: '#000000',
    },
    background: {
      default: '#0f172a', // Dark slate
      paper: '#1e293b', // Slate 800
    },
    text: {
      primary: '#f1f5f9', // Slate 100
      secondary: '#cbd5e1', // Slate 300
    },
    error: {
      main: '#f87171', // Red 400
      light: '#fca5a5',
      dark: '#dc2626',
    },
    warning: {
      main: '#fbbf24', // Amber 400
      light: '#fcd34d',
      dark: '#d97706',
    },
    info: {
      main: '#60a5fa', // Blue 400
      light: '#93c5fd',
      dark: '#2563eb',
    },
    success: {
      main: '#34d399', // Emerald 400
      light: '#6ee7b7',
      dark: '#059669',
    },
    divider: '#475569', // Slate 600
  },
  typography: {
    fontFamily: 'var(--font-comic-neue), "Comic Neue", "Nunito", "Inter", system-ui, -apple-system, sans-serif',
    fontSize: 16, // Increased base font size
    
    // Headings with better sizing
    h1: {
      fontSize: '3rem', // 48px
      fontWeight: 800,
      lineHeight: 1.1,
      letterSpacing: '-0.025em',
      color: '#f1f5f9',
    },
    h2: {
      fontSize: '2.5rem', // 40px
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
      color: '#f1f5f9',
    },
    h3: {
      fontSize: '2rem', // 32px
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
      color: '#f1f5f9',
    },
    h4: {
      fontSize: '1.75rem', // 28px
      fontWeight: 600,
      lineHeight: 1.3,
      color: '#f1f5f9',
    },
    h5: {
      fontSize: '1.5rem', // 24px
      fontWeight: 600,
      lineHeight: 1.3,
      color: '#f1f5f9',
    },
    h6: {
      fontSize: '1.25rem', // 20px
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#f1f5f9',
    },
    
    // Body text with improved readability
    body1: {
      fontSize: '1.125rem', // 18px
      lineHeight: 1.6,
      color: '#f1f5f9',
    },
    body2: {
      fontSize: '1rem', // 16px
      lineHeight: 1.5,
      color: '#cbd5e1',
    },
    
    // UI elements
    button: {
      fontSize: '1rem', // 16px
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.025em',
    },
    caption: {
      fontSize: '0.875rem', // 14px
      lineHeight: 1.4,
      color: '#94a3b8',
    },
    overline: {
      fontSize: '0.75rem', // 12px
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      color: '#94a3b8',
    },
    subtitle1: {
      fontSize: '1.125rem', // 18px
      fontWeight: 500,
      lineHeight: 1.5,
      color: '#f1f5f9',
    },
    subtitle2: {
      fontSize: '1rem', // 16px
      fontWeight: 500,
      lineHeight: 1.4,
      color: '#cbd5e1',
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0f172a',
          color: '#f1f5f9',
          scrollbarColor: '#475569 #1e293b',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#1e293b',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#475569',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: '#64748b',
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          padding: '12px 24px',
          minWidth: '44px',
          minHeight: '44px',
          fontSize: '1rem',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          '&:hover': {
            boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e293b',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          borderBottom: '1px solid #334155',
          backdropFilter: 'blur(12px)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e293b',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          border: '1px solid #334155',
          '&:hover': {
            boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s ease-in-out',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e293b',
          backgroundImage: 'none',
          border: '1px solid #334155',
        },
        elevation1: {
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        },
        elevation2: {
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
        },
        elevation3: {
          boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          fontWeight: 600,
          fontSize: '0.875rem',
          height: '32px',
          '&:hover': {
            transform: 'scale(1.05)',
          },
          transition: 'all 0.2s ease-in-out',
        },
        filled: {
          '&.MuiChip-colorPrimary': {
            backgroundColor: '#60a5fa',
            color: '#000000',
          },
          '&.MuiChip-colorSecondary': {
            backgroundColor: '#34d399',
            color: '#000000',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#334155',
            borderRadius: '12px',
            fontSize: '1rem',
            '& fieldset': {
              borderColor: '#475569',
              borderWidth: '2px',
            },
            '&:hover fieldset': {
              borderColor: '#60a5fa',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#60a5fa',
              borderWidth: '2px',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#cbd5e1',
            fontSize: '1rem',
            '&.Mui-focused': {
              color: '#60a5fa',
            },
          },
          '& .MuiOutlinedInput-input': {
            color: '#f1f5f9',
            fontSize: '1rem',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1e293b',
          borderRadius: '20px',
          border: '1px solid #334155',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '1.5rem',
          fontWeight: 700,
          color: '#f1f5f9',
          borderBottom: '1px solid #334155',
          paddingBottom: '16px',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          color: '#f1f5f9',
          fontSize: '1rem',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          '& .MuiTabs-indicator': {
            backgroundColor: '#60a5fa',
            height: '3px',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
          fontWeight: 600,
          textTransform: 'none',
          color: '#cbd5e1',
          '&.Mui-selected': {
            color: '#60a5fa',
          },
          '&:hover': {
            color: '#f1f5f9',
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          '&.MuiTypography-body1': {
            fontSize: '1.125rem',
            lineHeight: 1.6,
          },
          '&.MuiTypography-body2': {
            fontSize: '1rem',
            lineHeight: 1.5,
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '24px',
          paddingRight: '24px',
          '@media (min-width:600px)': {
            paddingLeft: '32px',
            paddingRight: '32px',
          },
        },
      },
    },
  },
});

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}>
        <Header />
        <Box 
          component="main" 
          sx={{ 
            flex: 1, 
            p: { xs: 2, sm: 3, md: 4 },
            backgroundColor: 'background.default',
          }}
        >
          {children}
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
} 
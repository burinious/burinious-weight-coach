import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0f766e' },
    secondary: { main: '#ea580c' },
    background: { default: '#f5f7ef', paper: '#ffffff' },
    text: {
      primary: '#142022',
      secondary: '#4b5b5e'
    }
  },
  shape: { borderRadius: 18 },
  spacing: 8,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          '--brand-primary': '#0f766e',
          '--brand-secondary': '#ea580c',
          '--brand-ink': '#142022',
          '--brand-muted': '#4b5b5e',
          '--surface-border': 'rgba(20, 32, 34, 0.09)'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          border: '1px solid var(--surface-border)',
          boxShadow: '0 20px 45px rgba(20, 32, 34, 0.08)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          textTransform: 'none',
          fontWeight: 700
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(245, 247, 239, 0.88)',
          borderBottom: '1px solid var(--surface-border)',
          backdropFilter: 'blur(12px)',
          color: '#142022'
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10
        }
      }
    }
  },
  typography: {
    fontFamily: 'Manrope, Avenir Next, Segoe UI, sans-serif',
    h3: { fontWeight: 800, letterSpacing: '-0.02em' },
    h4: { fontWeight: 800, letterSpacing: '-0.015em' },
    h5: { fontWeight: 750, letterSpacing: '-0.01em' },
    h6: { fontWeight: 730, letterSpacing: '-0.01em' },
    subtitle1: { fontWeight: 620 },
    button: { fontWeight: 700 }
  }
})

export default theme

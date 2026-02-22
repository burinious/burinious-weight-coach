import React from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Container,
  Stack,
  Chip,
  Paper,
  BottomNavigation,
  BottomNavigationAction
} from '@mui/material'
import FitnessCenterRoundedIcon from '@mui/icons-material/FitnessCenterRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded'
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'

const navItems = [
  { to: '/', label: 'Dashboard', icon: <HomeRoundedIcon /> },
  { to: '/log', label: 'Log Day', icon: <EditNoteRoundedIcon /> },
  { to: '/history', label: 'History', icon: <TimelineRoundedIcon /> },
  { to: '/settings', label: 'Settings', icon: <TuneRoundedIcon /> }
]

export default function App() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const activePath = navItems.some((item) => item.to === pathname) ? pathname : '/'

  return (
    <Box className="app-shell">
      <Box className="bg-orb orb-a" />
      <Box className="bg-orb orb-b" />
      <Box className="shell-content">
        <AppBar position="sticky" elevation={0}>
          <Toolbar sx={{ minHeight: 76, gap: 2 }}>
            <Stack direction="row" spacing={1.25} alignItems="center" sx={{ flexGrow: 1 }}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: 'primary.main',
                  color: 'white'
                }}
              >
                <FitnessCenterRoundedIcon fontSize="small" />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ lineHeight: 1.1 }}>
                  Burinious Weight Coach
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.75 }}>
                  Adaptive body recomposition companion
                </Typography>
              </Box>
            </Stack>

            <Chip
              label="Offline Ready"
              size="small"
              color="secondary"
              sx={{ display: { xs: 'none', md: 'inline-flex' } }}
            />

            <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
              {navItems.map((item) => (
                <Button
                  key={item.to}
                  component={Link}
                  to={item.to}
                  variant={pathname === item.to ? 'contained' : 'text'}
                  color={pathname === item.to ? 'primary' : 'inherit'}
                  startIcon={item.icon}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
          </Toolbar>
        </AppBar>

        <Container
          maxWidth="lg"
          sx={{
            py: { xs: 2.5, md: 4 },
            pb: { xs: 10, md: 4 },
            flex: 1
          }}
        >
          <Box className="page-enter">
            <Outlet />
          </Box>
        </Container>

        <Paper
          elevation={12}
          sx={{
            position: 'fixed',
            left: 12,
            right: 12,
            bottom: 12,
            zIndex: 1100,
            borderRadius: 4,
            border: '1px solid rgba(20, 32, 34, 0.08)',
            display: { xs: 'block', md: 'none' }
          }}
        >
          <BottomNavigation value={activePath} onChange={(_, next) => navigate(next)} showLabels>
            {navItems.map((item) => (
              <BottomNavigationAction key={item.to} value={item.to} label={item.label} icon={item.icon} />
            ))}
          </BottomNavigation>
        </Paper>

        <Box component="footer" sx={{ pb: 2.5, textAlign: 'center', opacity: 0.75, fontSize: 12 }}>
          Built for your personal program length | Progressive Web App
        </Box>
      </Box>
    </Box>
  )
}

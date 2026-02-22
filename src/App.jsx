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
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded'
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import CoachGlyph from './components/CoachGlyph.jsx'

const navItems = [
  { to: '/', label: 'Dashboard', mobileLabel: 'Home', icon: <HomeRoundedIcon /> },
  { to: '/log', label: 'Log Day', mobileLabel: 'Log', icon: <EditNoteRoundedIcon /> },
  { to: '/history', label: 'History', mobileLabel: 'History', icon: <TimelineRoundedIcon /> },
  { to: '/settings', label: 'Settings', mobileLabel: 'Settings', icon: <TuneRoundedIcon /> }
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
          <Toolbar sx={{ minHeight: { xs: 66, md: 76 }, gap: { xs: 1, md: 2 }, px: { xs: 1.25, md: 2 } }}>
            <Stack direction="row" spacing={1.25} alignItems="center" sx={{ flexGrow: 1, minWidth: 0 }}>
              <Box
                sx={{
                  width: { xs: 38, md: 42 },
                  height: { xs: 38, md: 42 },
                  borderRadius: 2.5,
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: 'white',
                  border: '1px solid rgba(20, 32, 34, 0.14)'
                }}
              >
                <CoachGlyph size={24} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle1" sx={{ lineHeight: 1.1, whiteSpace: 'nowrap' }}>
                  Burinious Weight Coach
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ opacity: 0.75, display: { xs: 'none', sm: 'block' }, whiteSpace: 'nowrap' }}
                >
                  Adaptive body recomposition companion
                </Typography>
              </Box>
            </Stack>

            <Chip
              label="Offline Ready"
              size="small"
              color="secondary"
              sx={{ display: { xs: 'none', lg: 'inline-flex' } }}
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
            py: { xs: 2, md: 4 },
            px: { xs: 1.25, sm: 2, md: 3 },
            pb: { xs: 'calc(86px + env(safe-area-inset-bottom))', md: 4 },
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
            left: 10,
            right: 10,
            bottom: 'calc(10px + env(safe-area-inset-bottom))',
            zIndex: 1100,
            borderRadius: 4,
            border: '1px solid rgba(20, 32, 34, 0.08)',
            overflow: 'hidden',
            display: { xs: 'block', md: 'none' }
          }}
        >
          <BottomNavigation value={activePath} onChange={(_, next) => navigate(next)} showLabels>
            {navItems.map((item) => (
              <BottomNavigationAction
                key={item.to}
                value={item.to}
                label={item.mobileLabel}
                icon={item.icon}
                sx={{ minWidth: 0 }}
              />
            ))}
          </BottomNavigation>
        </Paper>

        <Box
          component="footer"
          sx={{ pb: { xs: 0.75, md: 2.5 }, textAlign: 'center', opacity: 0.75, fontSize: 12, px: 1 }}
        >
          Built for your personal program length | Progressive Web App
        </Box>
      </Box>
    </Box>
  )
}

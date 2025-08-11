import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Box, Button, Container } from '@mui/material'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'

export default function App() {
  const { pathname } = useLocation()
  return (
    <Box sx={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="sticky" color="transparent" elevation={0} sx={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Toolbar>
          <FitnessCenterIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Burinious Weight Coach</Typography>
          <NavLink to="/" label="Dashboard" active={pathname === '/'} />
          <NavLink to="/log" label="Log Day" active={pathname === '/log'} />
          <NavLink to="/history" label="History" active={pathname === '/history'} />
          <NavLink to="/settings" label="Settings" active={pathname === '/settings'} />
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 3, flex: 1 }}>
        <Outlet />
      </Container>
      <Box component="footer" sx={{ py: 2, textAlign: 'center', opacity: 0.6, fontSize: 12 }}>
        Built for your 90‑day goal • Offline‑ready PWA
      </Box>
    </Box>
  )
}

function NavLink({ to, label, active }) {
  return (
    <Button component={Link} to={to} color={active ? 'primary' : 'inherit'} sx={{ mx: .5 }}>
      {label}
    </Button>
  )
}
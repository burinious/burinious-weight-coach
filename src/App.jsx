import React, { useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Stack,
  Chip,
  Paper,
  Alert,
  Button,
  IconButton,
  Snackbar,
  BottomNavigation,
  BottomNavigationAction
} from '@mui/material'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded'
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import CoachGlyph from './components/CoachGlyph.jsx'

const navItems = [
  { to: '/', label: 'Home', icon: <HomeRoundedIcon /> },
  { to: '/log', label: 'Log', icon: <EditNoteRoundedIcon /> },
  { to: '/history', label: 'History', icon: <TimelineRoundedIcon /> },
  { to: '/settings', label: 'Settings', icon: <TuneRoundedIcon /> }
]
const APK_DISMISS_KEY = 'bwc-apk-banner-dismissed-v1'
const DEFAULT_APK_URL = 'https://github.com/burinious/burinious-weight-coach/releases/latest'
const DEFAULT_RELEASES_API_URL = 'https://api.github.com/repos/burinious/burinious-weight-coach/releases/latest'
const APP_VERSION = typeof __APP_VERSION__ === 'string' ? __APP_VERSION__ : '0.0.0'

function normalizeVersion(value) {
  if (!value) return ''
  const clean = String(value).trim().replace(/^v/i, '')
  const match = clean.match(/^(\d+)(?:\.(\d+))?(?:\.(\d+))?/)
  if (!match) return ''
  return `${Number(match[1] || 0)}.${Number(match[2] || 0)}.${Number(match[3] || 0)}`
}

function compareSemver(a, b) {
  const left = normalizeVersion(a).split('.').map((part) => Number(part || 0))
  const right = normalizeVersion(b).split('.').map((part) => Number(part || 0))
  for (let idx = 0; idx < 3; idx++) {
    if ((left[idx] || 0) > (right[idx] || 0)) return 1
    if ((left[idx] || 0) < (right[idx] || 0)) return -1
  }
  return 0
}

export default function App() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const activePath = navItems.some((item) => item.to === pathname) ? pathname : '/'
  const manualApkUrl = import.meta.env.VITE_LATEST_APK_URL
  const releasesApiUrl = import.meta.env.VITE_RELEASES_API_URL || DEFAULT_RELEASES_API_URL
  const [dismissedToken, setDismissedToken] = useState(() => localStorage.getItem(APK_DISMISS_KEY) || '')
  const [releaseState, setReleaseState] = useState(() => ({
    version: '',
    url: manualApkUrl || DEFAULT_APK_URL,
    hasUpdate: Boolean(manualApkUrl),
    token: manualApkUrl || 'manual-fallback',
    loading: !manualApkUrl
  }))

  useEffect(() => {
    let active = true

    async function loadRelease() {
      if (!releasesApiUrl) {
        setReleaseState((prev) => ({ ...prev, loading: false }))
        return
      }

      try {
        const response = await fetch(releasesApiUrl, {
          headers: { Accept: 'application/vnd.github+json' }
        })
        if (!response.ok) throw new Error(`release_request_failed_${response.status}`)
        const payload = await response.json()
        const latestVersion = normalizeVersion(payload?.tag_name || payload?.name || '')
        const apkAsset = Array.isArray(payload?.assets)
          ? payload.assets.find((item) => String(item?.name || '').toLowerCase().endsWith('.apk'))
          : null
        const candidateUrl =
          manualApkUrl ||
          apkAsset?.browser_download_url ||
          payload?.html_url ||
          DEFAULT_APK_URL
        const hasUpdate = latestVersion ? compareSemver(latestVersion, APP_VERSION) > 0 : Boolean(manualApkUrl)
        if (!active) return
        setReleaseState({
          version: latestVersion,
          url: candidateUrl,
          hasUpdate,
          token: latestVersion || candidateUrl,
          loading: false
        })
      } catch {
        if (!active) return
        setReleaseState((prev) => ({ ...prev, loading: false }))
      }
    }

    loadRelease()
    return () => {
      active = false
    }
  }, [manualApkUrl, releasesApiUrl])

  const showApkBanner = useMemo(() => {
    if (releaseState.loading || !releaseState.hasUpdate) return false
    return dismissedToken !== releaseState.token
  }, [dismissedToken, releaseState.hasUpdate, releaseState.loading, releaseState.token])

  const dismissApkBanner = () => {
    localStorage.setItem(APK_DISMISS_KEY, releaseState.token)
    setDismissedToken(releaseState.token)
  }

  return (
    <Box className="app-shell">
      <Box className="bg-orb orb-a" />
      <Box className="bg-orb orb-b" />
      <Box className="shell-content">
        <AppBar position="sticky" elevation={0}>
          <Toolbar sx={{ minHeight: { xs: 66, md: 76 }, gap: 1.25, px: { xs: 1.25, md: 2 } }}>
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
            <Chip label="Offline Ready" size="small" color="secondary" sx={{ display: { xs: 'none', md: 'inline-flex' } }} />
          </Toolbar>
        </AppBar>

        <Snackbar
          open={showApkBanner}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          sx={{ mt: { xs: '72px', md: '82px' }, width: { xs: 'calc(100% - 20px)', sm: 'auto' } }}
        >
          <Alert
            severity="info"
            variant="filled"
            sx={{ width: '100%', alignItems: 'center', borderRadius: 2.5 }}
            action={
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Button
                  color="inherit"
                  size="small"
                  component="a"
                  href={releaseState.url}
                  target="_blank"
                  rel="noreferrer"
                  sx={{ fontWeight: 700 }}
                >
                  Download APK
                </Button>
                <IconButton size="small" color="inherit" onClick={dismissApkBanner} aria-label="dismiss apk banner">
                  <CloseRoundedIcon fontSize="small" />
                </IconButton>
              </Stack>
            }
          >
            {releaseState.version
              ? `New Android build v${releaseState.version} is available.`
              : 'New Android build is available.'}
          </Alert>
        </Snackbar>

        <Container
          maxWidth="lg"
          sx={{
            py: { xs: 2, md: 4 },
            px: { xs: 1.25, sm: 2, md: 3 },
            pb: { xs: 'calc(86px + env(safe-area-inset-bottom))', md: 'calc(92px + env(safe-area-inset-bottom))' },
            flex: 1
          }}
        >
          <Box className="page-enter">
            <Outlet />
          </Box>
        </Container>

        <Box
          component="footer"
          sx={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 'calc(8px + env(safe-area-inset-bottom))',
            textAlign: 'center',
            opacity: 0.5,
            fontSize: 11,
            px: 1,
            zIndex: 1100,
            pointerEvents: 'none'
          }}
        >
          Powered by Burinious Web Solutions
        </Box>
      </Box>

      <Paper
        elevation={14}
        sx={{
          position: 'fixed',
          left: 0,
          right: 0,
          width: '100%',
          bottom: 0,
          zIndex: 1200,
          borderRadius: '22px 22px 0 0',
          border: '1px solid rgba(20, 32, 34, 0.08)',
          overflow: 'hidden'
        }}
      >
        <BottomNavigation
          value={activePath}
          onChange={(_, next) => navigate(next)}
          showLabels
          sx={{ minHeight: 62, pb: 'env(safe-area-inset-bottom)' }}
        >
          {navItems.map((item) => (
            <BottomNavigationAction key={item.to} value={item.to} label={item.label} icon={item.icon} sx={{ minWidth: 0 }} />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  )
}

import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { Box, CircularProgress, CssBaseline, ThemeProvider, Typography } from '@mui/material'
import { RouterProvider, createHashRouter } from 'react-router-dom'
import theme from './theme.js'
import './styles.css'

const App = lazy(() => import('./App.jsx'))
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'))
const LogDay = lazy(() => import('./pages/LogDay.jsx'))
const History = lazy(() => import('./pages/History.jsx'))
const Settings = lazy(() => import('./pages/Settings.jsx'))

function RouteLoader() {
  return (
    <Box sx={{ minHeight: '55vh', display: 'grid', placeItems: 'center', textAlign: 'center', p: 2 }}>
      <Box>
        <CircularProgress size={28} />
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          Loading module...
        </Typography>
      </Box>
    </Box>
  )
}

const withFallback = (element) => <Suspense fallback={<RouteLoader />}>{element}</Suspense>

const router = createHashRouter([
  {
    path: '/',
    element: withFallback(<App />),
    children: [
      { index: true, element: withFallback(<Dashboard />) },
      { path: 'log', element: withFallback(<LogDay />) },
      { path: 'history', element: withFallback(<History />) },
      { path: 'settings', element: withFallback(<Settings />) },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Suspense fallback={<RouteLoader />}>
        <RouterProvider router={router} />
      </Suspense>
    </ThemeProvider>
  </React.StrictMode>
)

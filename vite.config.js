import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const appVersion = process.env.npm_package_version || '0.0.0'

export default defineConfig({
  base: './',
  define: {
    __APP_VERSION__: JSON.stringify(appVersion)
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          charts: ['recharts'],
          store: ['zustand', 'zustand/middleware', 'immer'],
          utils: ['date-fns', 'zod']
        }
      }
    }
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Burinious Weight Coach',
        short_name: 'Burinious Coach',
        description: '90-day weight loss coach app (offline-ready)',
        theme_color: '#0f766e',
        background_color: '#f5f7ef',
        display: 'standalone',
        start_url: './',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
  server: {
    port: 5173
  }
})

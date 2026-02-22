import React from 'react'
import { Box } from '@mui/material'

export default function CoachGlyph({ size = 28 }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 64 64"
      sx={{ width: size, height: size, display: 'block' }}
      aria-hidden
    >
      <defs>
        <linearGradient id="coachGlyphGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f766e" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="56" height="56" rx="18" fill="url(#coachGlyphGradient)" />
      <path
        d="M20 42c2-9 8-14 12-14s10 5 12 14"
        stroke="#ffffff"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="24" cy="24" r="4" fill="#ffffff" />
      <circle cx="40" cy="24" r="4" fill="#ffffff" />
      <path d="M16 22h4m24 0h4" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
    </Box>
  )
}

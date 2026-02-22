import React from 'react'
import { Box, Typography } from '@mui/material'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area
} from 'recharts'
import useAppStore from '../store/useAppStore.js'

export default function WeightChart() {
  const weights = useAppStore((state) => state.weights)
  const data = [...weights]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((entry) => ({ date: entry.date.slice(5), kg: Number(entry.kg) }))

  if (!data.length) {
    return (
      <Box
        sx={{
          height: 280,
          borderRadius: 3,
          border: '1px dashed rgba(20, 32, 34, 0.2)',
          display: 'grid',
          placeItems: 'center',
          textAlign: 'center',
          p: 2
        }}
      >
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            No weight entries yet
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Add your first weight in Log Day to unlock trend insights.
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', height: 280 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 12, bottom: 6, left: 4 }}>
          <defs>
            <linearGradient id="weightAreaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0f766e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="rgba(20, 32, 34, 0.15)" />
          <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#4b5b5e' }} />
          <YAxis
            tick={{ fontSize: 12, fill: '#4b5b5e' }}
            domain={[(dataMin) => Math.floor(dataMin - 1), (dataMax) => Math.ceil(dataMax + 1)]}
          />
          <Tooltip
            formatter={(value) => [`${value} kg`, 'Weight']}
            contentStyle={{
              borderRadius: 12,
              border: '1px solid rgba(20, 32, 34, 0.09)'
            }}
          />
          <Area type="monotone" dataKey="kg" stroke="none" fill="url(#weightAreaFill)" />
          <Line type="monotone" dataKey="kg" stroke="#0f766e" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  )
}

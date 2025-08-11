import React from 'react'
import { Card, CardContent, CardHeader, Chip, Stack, Typography } from '@mui/material'

export default function DayCard({ day, onClick }) {
  return (
    <Card onClick={onClick} sx={{ cursor: 'pointer', transition: 'all .2s', '&:hover': { transform: 'translateY(-2px)' } }}>
      <CardHeader title={day.date} subheader={day.focus} />
      <CardContent>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip label={day.workout} variant="outlined" />
        </Stack>
        {day.notes && <Typography sx={{ mt: 1 }} variant="body2" color="text.secondary">{day.notes}</Typography>}
      </CardContent>
    </Card>
  )
}
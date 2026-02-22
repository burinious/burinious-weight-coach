import React from 'react'
import { Card, CardContent, CardHeader, Chip, Stack, Typography } from '@mui/material'
import FitnessCenterRoundedIcon from '@mui/icons-material/FitnessCenterRounded'
import EventRoundedIcon from '@mui/icons-material/EventRounded'

export default function DayCard({ day, onClick }) {
  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        height: '100%',
        transition: 'transform .18s ease, box-shadow .18s ease',
        '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 16px 30px rgba(20, 32, 34, 0.12)' }
      }}
    >
      <CardHeader
        title={day.date}
        titleTypographyProps={{ variant: 'subtitle1', fontWeight: 700 }}
        subheader={day.focus}
        subheaderTypographyProps={{ color: 'text.secondary' }}
        avatar={<EventRoundedIcon color="primary" fontSize="small" />}
      />
      <CardContent>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip
            icon={<FitnessCenterRoundedIcon />}
            label={day.workout}
            variant="outlined"
            sx={{ maxWidth: '100%', height: 'auto', '& .MuiChip-label': { whiteSpace: 'normal' } }}
          />
        </Stack>
        {day.notes && <Typography sx={{ mt: 1 }} variant="body2" color="text.secondary">{day.notes}</Typography>}
      </CardContent>
    </Card>
  )
}

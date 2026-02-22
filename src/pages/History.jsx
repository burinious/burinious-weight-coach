import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Stack,
  Grid,
  Chip,
  Box
} from '@mui/material'
import {
  CalendarMonthRounded,
  RestaurantRounded,
  EggRounded,
  WaterDropRounded,
  DirectionsWalkRounded,
  FitnessCenterRounded,
  MonitorWeightRounded
} from '@mui/icons-material'
import useAppStore from '../store/useAppStore.js'

export default function History() {
  const { logs, weights } = useAppStore()
  const rows = Object.entries(logs)
    .map(([date, value]) => ({ date, ...value }))
    .sort((a, b) => b.date.localeCompare(a.date))

  const weightByDate = Object.fromEntries(weights.map((entry) => [entry.date, entry.kg]))

  return (
    <Stack spacing={2}>
      <Card>
        <CardContent>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={1}
          >
            <Box>
              <Typography variant="h6">History</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Review daily compliance, nutrition, movement, and weight trends.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              <Chip size="small" icon={<CalendarMonthRounded />} label={`${rows.length} logged days`} />
              <Chip size="small" color="secondary" icon={<MonitorWeightRounded />} label={`${weights.length} weigh-ins`} />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <Stack spacing={1.25}>
          {rows.length === 0 && (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  No history yet. Start by logging your first day.
                </Typography>
              </CardContent>
            </Card>
          )}
          {rows.map((row) => (
            <Card key={row.date} variant="outlined">
              <CardContent>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">{row.date}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <SmallStat icon={<RestaurantRounded fontSize="inherit" />} label="Calories" value={row.calories} unit="kcal" />
                  </Grid>
                  <Grid item xs={6}>
                    <SmallStat icon={<EggRounded fontSize="inherit" />} label="Protein" value={row.protein} unit="g" />
                  </Grid>
                  <Grid item xs={6}>
                    <SmallStat icon={<WaterDropRounded fontSize="inherit" />} label="Water" value={row.water} unit="ml" />
                  </Grid>
                  <Grid item xs={6}>
                    <SmallStat icon={<DirectionsWalkRounded fontSize="inherit" />} label="Steps" value={row.steps} />
                  </Grid>
                  <Grid item xs={6}>
                    <SmallStat icon={<FitnessCenterRounded fontSize="inherit" />} label="Workout" value={row.workoutMins} unit="min" />
                  </Grid>
                  <Grid item xs={6}>
                    <SmallStat icon={<MonitorWeightRounded fontSize="inherit" />} label="Weight" value={weightByDate[row.date]} unit="kg" />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>

      <Card sx={{ display: { xs: 'none', md: 'block' } }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Calories</TableCell>
                  <TableCell>Protein (g)</TableCell>
                  <TableCell>Water (ml)</TableCell>
                  <TableCell>Steps</TableCell>
                  <TableCell>Workout (min)</TableCell>
                  <TableCell>Weight (kg)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.date}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{formatValue(row.calories)}</TableCell>
                    <TableCell>{formatValue(row.protein)}</TableCell>
                    <TableCell>{formatValue(row.water)}</TableCell>
                    <TableCell>{formatValue(row.steps)}</TableCell>
                    <TableCell>{formatValue(row.workoutMins)}</TableCell>
                    <TableCell>{formatValue(weightByDate[row.date])}</TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Typography variant="body2" sx={{ color: 'text.secondary', py: 1 }}>
                        No history yet. Start by logging your first day.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Stack>
  )
}

function SmallStat({ icon, label, value, unit }) {
  return (
    <Stack spacing={0.25}>
      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'text.secondary' }}>
        <Box sx={{ fontSize: 14, display: 'grid', placeItems: 'center', color: 'primary.main' }}>{icon}</Box>
        <Typography variant="caption">{label}</Typography>
      </Stack>
      <Typography variant="body2" sx={{ fontWeight: 650 }}>
        {formatValue(value)}
        {typeof value === 'number' && unit ? ` ${unit}` : ''}
      </Typography>
    </Stack>
  )
}

function formatValue(value) {
  return typeof value === 'number' ? value : '--'
}

import React from 'react'
import { Grid, Card, CardContent, Typography, Button, Stack, Box } from '@mui/material'
import useAppStore from '../store/useAppStore.js'
import WeightChart from '../components/WeightChart.jsx'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { settings, plan, logs, weights } = useAppStore()
  const todayISO = format(new Date(), 'yyyy-MM-dd')
  const todayPlan = plan.find(p => p.date === todayISO)
  const todayLog = logs[todayISO] || {}
  const latestWeight = weights.sort((a,b)=> b.date.localeCompare(a.date))[0]?.kg

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="overline" sx={{ opacity: .5 }}>Burinious Web Solutions</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Weight trend</Typography>
            <WeightChart />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Today</Typography>
            <Typography variant="body2" sx={{ opacity: .8 }}>{todayPlan?.focus} • Target {settings.dailyCalorieTarget} kcal • Protein {settings.proteinTarget} g</Typography>
            <Box sx={{ my: 2 }}>
              <Typography variant="h4">{latestWeight ? latestWeight + ' kg' : '—'}</Typography>
              <Typography variant="caption" sx={{ opacity: .7 }}>Latest weight</Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button variant="contained" component={Link} to="/log">Log today</Button>
              <Button variant="outlined" component={Link} to="/settings">Settings</Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Quick stats</Typography>
            <Stack direction="row" spacing={3} flexWrap="wrap">
              <Stat label="Calories" value={todayLog.calories ?? '—'} suffix="kcal" />
              <Stat label="Protein" value={todayLog.protein ?? '—'} suffix="g" />
              <Stat label="Water" value={todayLog.water ?? '—'} suffix="ml" />
              <Stat label="Steps" value={todayLog.steps ?? '—'} />
              <Stat label="Workout" value={todayLog.workoutMins ?? '—'} suffix="min" />
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

function Stat({ label, value, suffix }) {
  return (
    <Box>
      <Typography variant="h5">{value}{typeof value==='number' && suffix ? ' '+suffix : ''}</Typography>
      <Typography variant="caption" sx={{ opacity: .7 }}>{label}</Typography>
    </Box>
  )
}
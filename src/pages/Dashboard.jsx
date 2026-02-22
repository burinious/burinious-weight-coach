import React from 'react'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Box,
  Chip,
  LinearProgress,
  Alert
} from '@mui/material'
import {
  ScaleRounded,
  TrendingDownRounded,
  FlagRounded,
  TaskAltRounded,
  LocalFireDepartmentRounded,
  InsightsRounded,
  EggRounded,
  MonitorWeightRounded,
  RestaurantRounded,
  WaterDropRounded,
  DirectionsWalkRounded,
  FitnessCenterRounded
} from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import { differenceInCalendarDays, format, isValid, parseISO, subDays } from 'date-fns'
import useAppStore from '../store/useAppStore.js'
import WeightChart from '../components/WeightChart.jsx'
import DayCard from '../components/DayCard.jsx'

function clampPercent(value) {
  return Math.max(0, Math.min(100, value))
}

function getCurrentStreak(logs, todayISO) {
  const dates = new Set(Object.keys(logs))
  const anchor = parseISO(todayISO)
  if (!isValid(anchor)) return 0
  let streak = 0
  for (let i = 0; i < 365; i++) {
    const date = format(subDays(anchor, i), 'yyyy-MM-dd')
    if (!dates.has(date)) break
    streak += 1
  }
  return streak
}

function average(values) {
  if (!values.length) return null
  return values.reduce((acc, value) => acc + value, 0) / values.length
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { settings, plan, logs, weights, programStarted, startProgram } = useAppStore()
  const todayISO = format(new Date(), 'yyyy-MM-dd')
  const programDays = Number(settings.programDays) || 90

  const todayLog = logs[todayISO] || {}
  const sortedWeights = [...weights].sort((a, b) => a.date.localeCompare(b.date))
  const latestWeight = sortedWeights[sortedWeights.length - 1]?.kg
  const startingWeight = sortedWeights[0]?.kg
  const weightDelta =
    startingWeight != null && latestWeight != null ? Number((latestWeight - startingWeight).toFixed(1)) : null
  const lossKg = weightDelta != null ? Number((-weightDelta).toFixed(1)) : null
  const goalProgress = lossKg != null ? clampPercent((lossKg / settings.goalKg) * 100) : 0

  const startDate = parseISO(settings.startDate)
  const elapsedDaysRaw = isValid(startDate) ? differenceInCalendarDays(new Date(), startDate) + 1 : 0
  const elapsedDays = programStarted ? Math.max(0, Math.min(elapsedDaysRaw, programDays)) : 0
  const elapsedProgress = programStarted ? clampPercent((elapsedDays / programDays) * 100) : 0

  const loggedDays = Object.keys(logs).length
  const expectedLogs = Math.max(1, elapsedDays)
  const consistency = programStarted ? clampPercent((loggedDays / expectedLogs) * 100) : 0

  const todayMetrics = [
    {
      label: 'Calories',
      value: todayLog.calories,
      target: settings.dailyCalorieTarget,
      unit: 'kcal',
      icon: <RestaurantRounded fontSize="small" />
    },
    {
      label: 'Protein',
      value: todayLog.protein,
      target: settings.proteinTarget,
      unit: 'g',
      icon: <EggRounded fontSize="small" />
    },
    {
      label: 'Water',
      value: todayLog.water,
      target: settings.waterTarget,
      unit: 'ml',
      icon: <WaterDropRounded fontSize="small" />
    },
    {
      label: 'Steps',
      value: todayLog.steps,
      target: settings.stepTarget,
      unit: '',
      icon: <DirectionsWalkRounded fontSize="small" />
    },
    {
      label: 'Workout',
      value: todayLog.workoutMins,
      target: 45,
      unit: 'min',
      icon: <FitnessCenterRounded fontSize="small" />
    }
  ]

  const todayIdx = plan.findIndex((entry) => entry.date === todayISO)
  const nextSessions = todayIdx >= 0 ? plan.slice(todayIdx, todayIdx + 3) : plan.slice(0, 3)

  const recentDates = Array.from({ length: 7 }, (_, idx) => format(subDays(new Date(), idx), 'yyyy-MM-dd'))
  const daysLoggedLast7 = recentDates.filter((date) => Boolean(logs[date])).length
  const streak = getCurrentStreak(logs, todayISO)

  const last14Dates = Array.from({ length: 14 }, (_, idx) => format(subDays(new Date(), idx), 'yyyy-MM-dd'))
  const recentCalorieValues = last14Dates
    .map((date) => logs[date]?.calories)
    .filter((value) => typeof value === 'number')
  const avgCalories = average(recentCalorieValues)
  const calorieDelta =
    avgCalories != null ? Math.round(avgCalories - Number(settings.dailyCalorieTarget || 0)) : null

  const proteinHitDays = last14Dates.filter((date) => {
    const protein = logs[date]?.protein
    return typeof protein === 'number' && protein >= settings.proteinTarget
  }).length

  const insights = [
    {
      icon: <TaskAltRounded fontSize="small" />,
      text: `${daysLoggedLast7}/7 logged days in the last week`
    },
    {
      icon: <LocalFireDepartmentRounded fontSize="small" />,
      text: `${streak} day active logging streak`
    },
    {
      icon: <InsightsRounded fontSize="small" />,
      text:
        calorieDelta == null
          ? 'Need more calorie data for trend analysis'
          : `Average calories are ${Math.abs(calorieDelta)} kcal ${calorieDelta >= 0 ? 'over' : 'under'} target`
    },
    {
      icon: <EggRounded fontSize="small" />,
      text: `${proteinHitDays}/14 days hit protein target`
    }
  ]

  return (
    <Stack spacing={2.25}>
      <Card className="stagger-rise">
        <CardContent>
          <Stack spacing={2}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              spacing={1}
            >
              <Box>
                <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 1.1 }}>
                  Burinious Web Solutions
                </Typography>
                <Typography variant="h4" sx={{ mt: 0.5, fontSize: { xs: '1.6rem', md: '2rem' } }}>
                  Coach Dashboard
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                  {programStarted
                    ? `${programDays}-day program started on ${settings.startDate}`
                    : `Set your duration and press Start to begin your ${programDays}-day program`}
                </Typography>
              </Box>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ width: { xs: '100%', sm: 'auto' } }}>
                {programStarted ? (
                  <Button variant="contained" component={Link} to="/log" fullWidth>
                    Log today
                  </Button>
                ) : (
                  <Button variant="contained" onClick={() => startProgram(todayISO)} fullWidth>
                    Start program
                  </Button>
                )}
                <Button variant="outlined" component={Link} to="/settings" fullWidth>
                  Settings
                </Button>
              </Stack>
            </Stack>

            {!programStarted && (
              <Alert severity="info">
                Your plan is ready but paused. Press Start program to generate day 1 and unlock tracking insights.
              </Alert>
            )}

            <Grid container spacing={1.25}>
              <Grid item xs={6} md={3}>
                <MiniMetric icon={<ScaleRounded fontSize="small" />} title="Current weight" value={latestWeight != null ? `${latestWeight} kg` : '--'} />
              </Grid>
              <Grid item xs={6} md={3}>
                <MiniMetric
                  icon={<TrendingDownRounded fontSize="small" />}
                  title="Weight change"
                  value={weightDelta != null ? `${weightDelta > 0 ? '+' : ''}${weightDelta} kg` : '--'}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <MiniMetric icon={<FlagRounded fontSize="small" />} title="Goal progress" value={`${Math.round(goalProgress)}%`} />
              </Grid>
              <Grid item xs={6} md={3}>
                <MiniMetric icon={<TaskAltRounded fontSize="small" />} title="Consistency" value={`${Math.round(consistency)}%`} />
              </Grid>
            </Grid>

            <Grid container spacing={1.25}>
              <Grid item xs={12} md={6}>
                <ProgressBar
                  title={`Program day ${elapsedDays} of ${programDays}`}
                  value={elapsedProgress}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <ProgressBar title={`Fat-loss target ${settings.goalKg} kg`} value={goalProgress} />
              </Grid>
            </Grid>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Card className="stagger-rise" sx={{ animationDelay: '80ms' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.25 }}>
                <Typography variant="h6">Weight trend</Typography>
                <Chip icon={<MonitorWeightRounded />} label={`${weights.length} entries`} size="small" />
              </Stack>
              <WeightChart />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="stagger-rise" sx={{ animationDelay: '140ms' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Insights
              </Typography>
              <Stack spacing={1}>
                {insights.map((insight) => (
                  <Stack key={insight.text} direction="row" spacing={1} alignItems="flex-start">
                    <Box sx={{ color: 'primary.main', mt: 0.25 }}>{insight.icon}</Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {insight.text}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
              <Stack direction="row" spacing={1} sx={{ mt: 2 }} useFlexGap flexWrap="wrap">
                <Chip size="small" color="primary" label={`${settings.dailyCalorieTarget} kcal`} />
                <Chip size="small" color="secondary" label={`${settings.proteinTarget} g protein`} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card className="stagger-rise" sx={{ animationDelay: '200ms' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Today's numbers
          </Typography>
          <Grid container spacing={1.25}>
            {todayMetrics.map((metric) => {
              const hasValue = typeof metric.value === 'number'
              const progress = hasValue && metric.target ? clampPercent((metric.value / metric.target) * 100) : 0
              const valueLabel = hasValue ? `${metric.value}${metric.unit ? ` ${metric.unit}` : ''}` : '--'
              return (
                <Grid item xs={12} sm={6} md={4} key={metric.label}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent sx={{ py: 1.5 }}>
                      <Stack direction="row" spacing={0.75} alignItems="center">
                        <Box sx={{ color: 'primary.main', display: 'grid', placeItems: 'center' }}>{metric.icon}</Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {metric.label}
                        </Typography>
                      </Stack>
                      <Typography variant="h6" sx={{ mt: 0.6 }}>
                        {valueLabel}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{ mt: 1.25, height: 8, borderRadius: 8 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        </CardContent>
      </Card>

      <Card className="stagger-rise" sx={{ animationDelay: '260ms' }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
            <Typography variant="h6">Upcoming sessions</Typography>
            <Button size="small" component={Link} to="/history">
              View history
            </Button>
          </Stack>
          {!programStarted && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Start your program to generate the upcoming schedule.
            </Typography>
          )}
          {programStarted && (
            <Grid container spacing={1.25}>
              {nextSessions.map((entry) => (
                <Grid item xs={12} md={4} key={entry.date}>
                  <DayCard day={entry} onClick={() => navigate('/log')} />
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>
    </Stack>
  )
}

function MiniMetric({ icon, title, value }) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent sx={{ py: 1.25 }}>
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Box sx={{ color: 'primary.main', display: 'grid', placeItems: 'center' }}>{icon}</Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.2 }}>
            {title}
          </Typography>
        </Stack>
        <Typography variant="h6" sx={{ mt: 0.5, fontSize: { xs: '1.05rem', md: '1.2rem' } }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  )
}

function ProgressBar({ title, value }) {
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }} spacing={1}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
          {Math.round(value)}%
        </Typography>
      </Stack>
      <LinearProgress variant="determinate" value={value} sx={{ height: 9, borderRadius: 8 }} />
    </Box>
  )
}

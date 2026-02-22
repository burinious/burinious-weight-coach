import React, { useMemo, useState } from 'react'
import { Card, CardContent, Grid, TextField, Button, Stack, Typography, Alert, Chip } from '@mui/material'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import useAppStore from '../store/useAppStore.js'

const numericOptional = (min, max) =>
  z.preprocess(
    (value) => (value === '' || value === null || value === undefined ? undefined : value),
    z.coerce.number().min(min).max(max).optional()
  )

const schema = z.object({
  date: z.string().min(1),
  calories: numericOptional(0, 10000),
  protein: numericOptional(0, 500),
  water: numericOptional(0, 10000),
  steps: numericOptional(0, 100000),
  workoutMins: numericOptional(0, 600),
  weightKg: numericOptional(20, 400)
})

function createForm(date, dayLog = {}, dayWeight = '') {
  return {
    date,
    calories: dayLog.calories ?? '',
    protein: dayLog.protein ?? '',
    water: dayLog.water ?? '',
    steps: dayLog.steps ?? '',
    workoutMins: dayLog.workoutMins ?? '',
    weightKg: dayWeight ?? ''
  }
}

export default function LogDay() {
  const today = format(new Date(), 'yyyy-MM-dd')
  const { logDay, addWeight, logs, weights, settings, programStarted, startProgram } = useAppStore()
  const [msg, setMsg] = useState(null)
  const [form, setForm] = useState(() => {
    const todayLog = logs[today] || {}
    const todayWeight = weights.find((entry) => entry.date === today)?.kg ?? ''
    return createForm(today, todayLog, todayWeight)
  })

  const existing = logs[form.date] || {}
  const existingWeight = weights.find((entry) => entry.date === form.date)?.kg

  const fieldMeta = useMemo(
    () => [
      { key: 'calories', label: 'Calories (kcal)', target: settings.dailyCalorieTarget },
      { key: 'protein', label: 'Protein (g)', target: settings.proteinTarget },
      { key: 'water', label: 'Water (ml)', target: settings.waterTarget },
      { key: 'steps', label: 'Steps', target: settings.stepTarget },
      { key: 'workoutMins', label: 'Workout (mins)', target: 45 },
      { key: 'weightKg', label: 'Weight (kg)', target: null }
    ],
    [settings.dailyCalorieTarget, settings.proteinTarget, settings.stepTarget, settings.waterTarget]
  )

  const onDateChange = (nextDate) => {
    const dayLog = logs[nextDate] || {}
    const dayWeight = weights.find((entry) => entry.date === nextDate)?.kg ?? ''
    setForm(createForm(nextDate, dayLog, dayWeight))
    setMsg(null)
  }

  const onChangeValue = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setMsg(null)
  }

  const onSubmit = () => {
    const parsed = schema.safeParse(form)
    if (!parsed.success) {
      setMsg({ severity: 'error', text: parsed.error.issues[0]?.message || 'Please check your inputs.' })
      return
    }

    const { date, weightKg, ...rest } = parsed.data
    logDay(date, rest)
    if (weightKg != null) addWeight(date, weightKg)
    setMsg({ severity: 'success', text: `Saved entries for ${date}.` })
  }

  if (!programStarted) {
    return (
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6">Start your program first</Typography>
            <Alert severity="info">
              Logging is unlocked after you start your plan. Set duration in Settings, then tap Start program.
            </Alert>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <Button variant="contained" onClick={() => startProgram(today)}>
                Start now
              </Button>
              <Button variant="outlined" component={Link} to="/settings">
                Go to settings
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    )
  }

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
            <BoxTitle title="Log your day" subtitle="Track intake, activity, and body weight in under one minute." />
            <TextField
              type="date"
              label="Date"
              value={form.date}
              onChange={(event) => onDateChange(event.target.value)}
              sx={{ maxWidth: { xs: '100%', sm: 210 } }}
            />
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            {msg && <Alert severity={msg.severity}>{msg.text}</Alert>}
            <Grid container spacing={1.5}>
              {fieldMeta.map((field) => (
                <Grid key={field.key} item xs={12} sm={6} md={4}>
                  <TextField
                    type="number"
                    label={field.label}
                    value={form[field.key]}
                    onChange={(event) => onChangeValue(field.key, event.target.value)}
                    helperText={field.target ? `Target: ${field.target}` : 'Optional'}
                    inputProps={{ min: 0 }}
                  />
                </Grid>
              ))}
            </Grid>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <Button onClick={onSubmit} variant="contained" size="large">
                Save day log
              </Button>
              <Button onClick={() => onDateChange(today)} variant="outlined" size="large">
                Jump to today
              </Button>
            </Stack>

            {(Object.keys(existing).length > 0 || existingWeight != null) && (
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                <Chip size="small" color="secondary" label="Existing entries loaded for this date" />
                {existingWeight != null && <Chip size="small" label={`Weight: ${existingWeight} kg`} />}
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}

function BoxTitle({ title, subtitle }) {
  return (
    <Stack spacing={0.5}>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {subtitle}
      </Typography>
    </Stack>
  )
}

import React, { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Stack,
  Typography,
  Alert,
  MenuItem,
  Chip,
  InputAdornment
} from '@mui/material'
import { format } from 'date-fns'
import { z } from 'zod'
import {
  CalendarMonthRounded,
  FlagRounded,
  RestaurantRounded,
  EggRounded,
  DirectionsWalkRounded,
  WaterDropRounded,
  TuneRounded,
  RocketLaunchRounded,
  AutorenewRounded,
  DeleteForeverRounded
} from '@mui/icons-material'
import useAppStore from '../store/useAppStore.js'

const durationOptions = [30, 45, 60, 90, 120, 180]

const settingsSchema = z.object({
  startDate: z.string().optional(),
  programDays: z.coerce.number().int().min(14).max(365),
  dailyCalorieTarget: z.coerce.number().min(900).max(6000),
  proteinTarget: z.coerce.number().min(30).max(400),
  stepTarget: z.coerce.number().min(1000).max(50000),
  waterTarget: z.coerce.number().min(500).max(7000),
  goalKg: z.coerce.number().min(1).max(100)
})

export default function Settings() {
  const { settings, programStarted, setSettings, startProgram, resetAll } = useAppStore()
  const [form, setForm] = useState(settings)
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    setForm(settings)
  }, [settings])

  const onSave = () => {
    const parsed = settingsSchema.safeParse(form)
    if (!parsed.success) {
      setMsg({ severity: 'error', text: parsed.error.issues[0]?.message || 'Please check your settings values.' })
      return
    }

    const sanitized = {
      ...parsed.data,
      startDate: parsed.data.startDate || settings.startDate || ''
    }
    setSettings(sanitized)

    if (programStarted) {
      startProgram(sanitized.startDate || format(new Date(), 'yyyy-MM-dd'))
      setMsg({ severity: 'success', text: 'Settings saved and active plan regenerated.' })
      return
    }

    setMsg({ severity: 'success', text: 'Settings saved. Press Start program to begin.' })
  }

  const onStartProgram = () => {
    const parsed = settingsSchema.safeParse(form)
    if (!parsed.success) {
      setMsg({ severity: 'error', text: parsed.error.issues[0]?.message || 'Please check your settings values.' })
      return
    }

    const startDate = parsed.data.startDate || format(new Date(), 'yyyy-MM-dd')
    setSettings({ ...parsed.data, startDate })
    startProgram(startDate)
    setMsg({
      severity: 'success',
      text: `${parsed.data.programDays}-day program started from ${startDate}.`
    })
  }

  const onReset = () => {
    if (confirm('Reset all settings, logs, weights, and plan?')) {
      resetAll()
      setMsg({ severity: 'success', text: 'All local data has been reset.' })
    }
  }

  return (
    <Stack spacing={2}>
      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between">
            <BoxTitle
              icon={<TuneRounded color="primary" />}
              title="Settings"
              subtitle="Configure your targets, duration, and start date. Change duration anytime."
            />
            <Chip color="secondary" label={`${form.programDays || settings.programDays || 90} day plan`} size="small" />
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            {msg && <Alert severity={msg.severity}>{msg.text}</Alert>}
            <Grid container spacing={1.25}>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Program duration (days)"
                  value={form.programDays}
                  onChange={(event) => setForm({ ...form, programDays: Number(event.target.value) })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ color: 'primary.main' }}>
                        <CalendarMonthRounded fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                >
                  {durationOptions.map((days) => (
                    <MenuItem key={days} value={days}>
                      {days} days
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Start date"
                  type="date"
                  value={form.startDate || ''}
                  onChange={(event) => setForm({ ...form, startDate: event.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Goal to lose (kg)"
                  type="number"
                  value={form.goalKg}
                  onChange={(event) => setForm({ ...form, goalKg: Number(event.target.value) })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ color: 'primary.main' }}>
                        <FlagRounded fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Daily calorie target"
                  type="number"
                  value={form.dailyCalorieTarget}
                  onChange={(event) => setForm({ ...form, dailyCalorieTarget: Number(event.target.value) })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ color: 'primary.main' }}>
                        <RestaurantRounded fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Protein target (g)"
                  type="number"
                  value={form.proteinTarget}
                  onChange={(event) => setForm({ ...form, proteinTarget: Number(event.target.value) })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ color: 'primary.main' }}>
                        <EggRounded fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Step target"
                  type="number"
                  value={form.stepTarget}
                  onChange={(event) => setForm({ ...form, stepTarget: Number(event.target.value) })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ color: 'primary.main' }}>
                        <DirectionsWalkRounded fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Water target (ml)"
                  type="number"
                  value={form.waterTarget}
                  onChange={(event) => setForm({ ...form, waterTarget: Number(event.target.value) })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ color: 'primary.main' }}>
                        <WaterDropRounded fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            </Grid>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <Button variant="contained" onClick={onSave} startIcon={<AutorenewRounded />} fullWidth>
                Save settings
              </Button>
              <Button variant="outlined" color="secondary" onClick={onStartProgram} startIcon={<RocketLaunchRounded />} fullWidth>
                {programStarted ? 'Restart program' : 'Start program'}
              </Button>
              <Button variant="outlined" color="error" onClick={onReset} startIcon={<DeleteForeverRounded />} fullWidth>
                Reset all data
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}

function BoxTitle({ icon, title, subtitle }) {
  return (
    <Stack spacing={0.5}>
      <Stack direction="row" spacing={1} alignItems="center">
        {icon}
        <Typography variant="h6">{title}</Typography>
      </Stack>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {subtitle}
      </Typography>
    </Stack>
  )
}

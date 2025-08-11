import React, { useState } from 'react'
import { Card, CardContent, Grid, TextField, Button, Stack, Typography, Alert } from '@mui/material'
import useAppStore from '../store/useAppStore.js'
import { format } from 'date-fns'
import { z } from 'zod'

const schema = z.object({
  date: z.string(),
  calories: z.coerce.number().min(0).max(10000).optional(),
  protein: z.coerce.number().min(0).max(500).optional(),
  water: z.coerce.number().min(0).max(10000).optional(),
  steps: z.coerce.number().min(0).max(100000).optional(),
  workoutMins: z.coerce.number().min(0).max(600).optional(),
  weightKg: z.coerce.number().min(20).max(400).optional()
})

export default function LogDay() {
  const today = format(new Date(), 'yyyy-MM-dd')
  const { logDay, addWeight, logs } = useAppStore()
  const [form, setForm] = useState({ date: today })
  const [msg, setMsg] = useState(null)

  const existing = logs[form.date] || {}

  const onSubmit = () => {
    const parsed = schema.safeParse(form)
    if (!parsed.success) {
      setMsg('Please check your inputs.')
      return
    }
    const payload = { ...parsed.data }
    const { weightKg, ...rest } = payload
    logDay(payload.date, rest)
    if (weightKg) addWeight(payload.date, weightKg)
    setMsg('Saved!')
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6">Log your day</Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              {msg && <Alert severity="success">{msg}</Alert>}
              <TextField type="date" label="Date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} />
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}><TextField label="Calories (kcal)" type="number" value={form.calories ?? ''} onChange={e=>setForm({...form, calories:e.target.value})} /></Grid>
                <Grid item xs={6} md={3}><TextField label="Protein (g)" type="number" value={form.protein ?? ''} onChange={e=>setForm({...form, protein:e.target.value})} /></Grid>
                <Grid item xs={6} md={3}><TextField label="Water (ml)" type="number" value={form.water ?? ''} onChange={e=>setForm({...form, water:e.target.value})} /></Grid>
                <Grid item xs={6} md={3}><TextField label="Steps" type="number" value={form.steps ?? ''} onChange={e=>setForm({...form, steps:e.target.value})} /></Grid>
                <Grid item xs={6} md={3}><TextField label="Workout (mins)" type="number" value={form.workoutMins ?? ''} onChange={e=>setForm({...form, workoutMins:e.target.value})} /></Grid>
                <Grid item xs={6} md={3}><TextField label="Weight (kg)" type="number" value={form.weightKg ?? ''} onChange={e=>setForm({...form, weightKg:e.target.value})} /></Grid>
              </Grid>
              <Button onClick={onSubmit} variant="contained">Save</Button>
              {existing && Object.keys(existing).length>0 && (
                <Typography variant="body2" sx={{opacity:.7}}>Existing for this date will be merged.</Typography>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
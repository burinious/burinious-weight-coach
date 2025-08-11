import React, { useState } from 'react'
import { Card, CardContent, Grid, TextField, Button, Stack, Typography } from '@mui/material'
import useAppStore from '../store/useAppStore.js'
import { seedPlan } from '../utils/plan.js'

export default function Settings() {
  const { settings, setSettings, update } = useAppStore()
  const [form, setForm] = useState(settings)

  const onSave = () => {
    setSettings(form)
    update(state => { state.plan = seedPlan(form.startDate, 90) })
    alert('Saved. Plan regenerated from new start date.')
  }

  const onReset = () => {
    if (confirm('Reset all data?')) {
      update(state => { state.logs = {}; state.weights = []; })
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6">Settings</Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField label="Start date" type="date" value={form.startDate} onChange={e=>setForm({...form, startDate:e.target.value})} />
              <TextField label="Daily calorie target" type="number" value={form.dailyCalorieTarget} onChange={e=>setForm({...form, dailyCalorieTarget:Number(e.target.value)})} />
              <TextField label="Protein target (g)" type="number" value={form.proteinTarget} onChange={e=>setForm({...form, proteinTarget:Number(e.target.value)})} />
              <TextField label="Step target" type="number" value={form.stepTarget} onChange={e=>setForm({...form, stepTarget:Number(e.target.value)})} />
              <TextField label="Water target (ml)" type="number" value={form.waterTarget} onChange={e=>setForm({...form, waterTarget:Number(e.target.value)})} />
              <Button variant="contained" onClick={onSave}>Save</Button>
              <Button variant="outlined" onClick={onReset}>Reset data</Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
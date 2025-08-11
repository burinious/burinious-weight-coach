import { addDays, format } from 'date-fns'

export function seedPlan(startDateISO, days=90) {
  const start = new Date(startDateISO)
  const list = []
  for (let i=0;i<days;i++) {
    const d = addDays(start, i)
    const iso = format(d, 'yyyy-MM-dd')
    list.push({
      date: iso,
      focus: focusForDay(i),
      workout: workoutForDay(i),
      notes: ''
    })
  }
  return list
}

function focusForDay(i) {
  const mod = i % 7
  if (mod === 0) return 'Upper Strength'
  if (mod === 1) return 'Cardio 30–45m'
  if (mod === 2) return 'Lower Strength'
  if (mod === 3) return 'HIIT 15–20m'
  if (mod === 4) return 'Full‑Body Strength'
  if (mod === 5) return 'Cardio + Core'
  return 'Rest / Mobility'
}

function workoutForDay(i) {
  const mod = i % 7
  const templates = {
    0: 'Push‑ups 3×12 • Rows 3×12 • Shoulder press 3×12 • Plank 3×30s',
    1: 'Brisk walk/jog 30–45m. Optional cycling/jump rope 10–15m.',
    2: 'Squats 3×15 • Lunges 3×12/leg • Glute bridge 3×15 • Side planks 3×30s',
    3: 'EMOM 10–15m: 30s burpees, 30s rest, alt with squat jumps/push‑ups.',
    4: 'Deadlifts (light) 3×12 • Push‑ups 3×12 • Mountain climbers 3×20 • Plank 3×45s',
    5: 'Cardio 40m + Core: crunches 3×20 • leg raises 3×12 • plank 3×45s',
    6: 'Stretching 15–20m or a 20m easy walk.'
  }
  return templates[mod]
}
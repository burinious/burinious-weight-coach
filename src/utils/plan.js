import { addDays, format, isValid, parseISO } from 'date-fns'

export function seedPlan(startDateISO, days = 90) {
  const parsedStart = parseISO(startDateISO)
  const start = isValid(parsedStart) ? parsedStart : new Date()
  const list = []

  for (let i = 0; i < days; i++) {
    const date = addDays(start, i)
    const iso = format(date, 'yyyy-MM-dd')
    list.push({
      date: iso,
      focus: focusForDay(i),
      workout: workoutForDay(i),
      notes: ''
    })
  }

  return list
}

function focusForDay(index) {
  const mod = index % 7
  if (mod === 0) return 'Upper Strength'
  if (mod === 1) return 'Cardio 30-45m'
  if (mod === 2) return 'Lower Strength'
  if (mod === 3) return 'HIIT 15-20m'
  if (mod === 4) return 'Full-Body Strength'
  if (mod === 5) return 'Cardio + Core'
  return 'Rest / Mobility'
}

function workoutForDay(index) {
  const mod = index % 7
  const templates = {
    0: 'Push-ups 3x12 | Rows 3x12 | Shoulder press 3x12 | Plank 3x30s',
    1: 'Brisk walk/jog 30-45m. Optional cycling/jump rope 10-15m.',
    2: 'Squats 3x15 | Lunges 3x12/leg | Glute bridge 3x15 | Side planks 3x30s',
    3: 'EMOM 10-15m: 30s burpees, 30s rest, alternate with squat jumps/push-ups.',
    4: 'Deadlifts (light) 3x12 | Push-ups 3x12 | Mountain climbers 3x20 | Plank 3x45s',
    5: 'Cardio 40m + Core: crunches 3x20 | leg raises 3x12 | plank 3x45s',
    6: 'Stretching 15-20m or a 20m easy walk.'
  }
  return templates[mod]
}

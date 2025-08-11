import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { format } from 'date-fns'
import { seedPlan } from '../utils/plan.js'
import { produce } from 'immer'

const defaultSettings = {
  startDate: format(new Date(), 'yyyy-MM-dd'),
  dailyCalorieTarget: 1800,
  proteinTarget: 130,
  stepTarget: 9000,
  waterTarget: 3000,
  goalKg: 15
}

const useAppStore = create(persist((set, get) => ({
  settings: defaultSettings,
  logs: {},
  weights: [],
  plan: seedPlan(defaultSettings.startDate, 90),
  setSettings: (patch) => set(state => ({ settings: { ...state.settings, ...patch } })),
  logDay: (date, data) => set(state => {
    const d = date || format(new Date(), 'yyyy-MM-dd')
    return { logs: { ...state.logs, [d]: { ...(state.logs[d]||{}), ...data } } }
  }),
  addWeight: (date, kg) => set(state => ({ weights: [...state.weights.filter(w => w.date !== date), { date, kg }] })),
  resetAll: () => set({ settings: defaultSettings, logs: {}, weights: [], plan: seedPlan(format(new Date(),'yyyy-MM-dd'),90) }),
  update: (fn) => set(produce(fn))
}), {
  name: 'wl-tracker',
  storage: createJSONStorage(() => localStorage)
}))

export default useAppStore
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { format } from 'date-fns'
import { seedPlan } from '../utils/plan.js'
import { produce } from 'immer'

const createDefaultSettings = () => ({
  startDate: '',
  programDays: 90,
  dailyCalorieTarget: 1800,
  proteinTarget: 130,
  stepTarget: 9000,
  waterTarget: 3000,
  goalKg: 15
})

function todayISO() {
  return format(new Date(), 'yyyy-MM-dd')
}

function normalizePersistedState(persistedState) {
  if (!persistedState) return persistedState

  const settings = { ...createDefaultSettings(), ...(persistedState.settings || {}) }
  const safeProgramDays = Number(settings.programDays) || 90
  const plan = Array.isArray(persistedState.plan) ? persistedState.plan : []
  const derivedStartDate = settings.startDate || plan[0]?.date || ''
  const started =
    typeof persistedState.programStarted === 'boolean'
      ? persistedState.programStarted
      : Boolean(plan.length)

  const normalizedSettings = { ...settings, startDate: derivedStartDate, programDays: safeProgramDays }
  const normalizedPlan = started
    ? plan.length
      ? plan
      : seedPlan(derivedStartDate || todayISO(), safeProgramDays)
    : []

  return {
    ...persistedState,
    settings: normalizedSettings,
    programStarted: started,
    plan: normalizedPlan
  }
}

const initialSettings = createDefaultSettings()

const useAppStore = create(
  persist(
    (set) => ({
      settings: initialSettings,
      logs: {},
      weights: [],
      plan: [],
      programStarted: false,

      setSettings: (patch) => set((state) => ({ settings: { ...state.settings, ...patch } })),

      startProgram: (startDateISO) =>
        set((state) => {
          const startDate = startDateISO || state.settings.startDate || todayISO()
          const programDays = Number(state.settings.programDays) || 90
          return {
            programStarted: true,
            settings: { ...state.settings, startDate, programDays },
            plan: seedPlan(startDate, programDays)
          }
        }),

      regeneratePlan: () =>
        set((state) => {
          const startDate = state.settings.startDate || todayISO()
          const programDays = Number(state.settings.programDays) || 90
          return {
            settings: { ...state.settings, startDate, programDays },
            plan: seedPlan(startDate, programDays)
          }
        }),

      logDay: (date, data) =>
        set((state) => {
          const d = date || todayISO()
          return { logs: { ...state.logs, [d]: { ...(state.logs[d] || {}), ...data } } }
        }),

      addWeight: (date, kg) =>
        set((state) => ({ weights: [...state.weights.filter((entry) => entry.date !== date), { date, kg }] })),

      resetAll: () => {
        const nextSettings = createDefaultSettings()
        set({ settings: nextSettings, logs: {}, weights: [], plan: [], programStarted: false })
      },

      update: (fn) => set(produce(fn))
    }),
    {
      name: 'wl-tracker',
      version: 2,
      migrate: (persistedState) => normalizePersistedState(persistedState),
      storage: createJSONStorage(() => localStorage)
    }
  )
)

export default useAppStore

import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { doc, setDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase.js'
import { useAuth } from './AuthContext.jsx'
import exercisesData from '../../exercises_db.json'

const ALL_EXERCISES = exercisesData.exercises

// ─── Дефолтные тренировки ────────────────────────────────────────────────────
const DEFAULT_WORKOUTS = [
  {
    id: 'w1',
    name: 'Разминка',
    description: 'Подготовка организма к тренировке — суставы, разогрев, мобильность',
    category: 'cardio',
    difficulty: 'beginner',
    duration: 15,
    exercises: [
      { name: 'Вращение плечами', sets: 2, reps: 20, duration: null },
      { name: 'Круговые движения шеей', sets: 2, reps: 10, duration: null },
      { name: 'Наклоны корпуса в стороны', sets: 2, reps: 20, duration: null },
      { name: 'Круговые движения тазом', sets: 2, reps: 20, duration: null },
      { name: 'Ходьба с подъёмом колен', sets: 2, reps: 20, duration: null },
      { name: 'Прыжки «Звезда»', sets: 2, reps: 20, duration: null },
      { name: 'Динамические выпады', sets: 2, reps: 16, duration: null },
    ],
  },
  {
    id: 'w2',
    name: 'Базовая силовая',
    description: 'Отжимания, приседания, планка — основа физической подготовки',
    category: 'strength',
    difficulty: 'intermediate',
    duration: 35,
    exercises: [
      { name: 'Отжимания от пола', sets: 3, reps: 10, duration: null },
      { name: 'Приседания', sets: 3, reps: 12, duration: null },
      { name: 'Ягодичный мост', sets: 3, reps: 12, duration: null },
      { name: 'Планка', sets: 3, reps: null, duration: 30 },
      { name: 'Обратные отжимания от стула', sets: 3, reps: 10, duration: null },
      { name: 'Выпады на месте', sets: 3, reps: 10, duration: null },
    ],
  },
  {
    id: 'w3',
    name: 'Кор и пресс',
    description: 'Укрепление мышц живота и стабилизаторов туловища',
    category: 'strength',
    difficulty: 'intermediate',
    duration: 25,
    exercises: [
      { name: 'Планка', sets: 3, reps: null, duration: 30 },
      { name: 'Боковая планка', sets: 3, reps: null, duration: 20 },
      { name: 'Скручивания на пресс', sets: 3, reps: 15, duration: null },
      { name: 'Подъём ног лёжа', sets: 3, reps: 15, duration: null },
      { name: 'Велосипед', sets: 3, reps: 20, duration: null },
      { name: 'Русские повороты', sets: 3, reps: 20, duration: null },
    ],
  },
  {
    id: 'w4',
    name: 'HIIT Кардио',
    description: 'Высокоинтенсивная интервальная тренировка для сжигания жира',
    category: 'cardio',
    difficulty: 'advanced',
    duration: 30,
    exercises: [
      { name: 'Берпи', sets: 3, reps: 10, duration: null },
      { name: 'Альпинист', sets: 3, reps: 20, duration: null },
      { name: 'Выпрыгивания из приседа', sets: 3, reps: 10, duration: null },
      { name: 'Прыжки из выпада', sets: 3, reps: 10, duration: null },
      { name: 'Прыжки «Звезда»', sets: 2, reps: 20, duration: null },
    ],
  },
  {
    id: 'w5',
    name: 'Спина и плечи',
    description: 'Укрепление мышц спины, плечевого пояса и осанки',
    category: 'strength',
    difficulty: 'intermediate',
    duration: 30,
    exercises: [
      { name: 'Сведение лопаток стоя', sets: 3, reps: 15, duration: null },
      { name: 'Обратные махи лёжа', sets: 3, reps: 15, duration: null },
      { name: 'Пловец лёжа', sets: 3, reps: 10, duration: null },
      { name: 'Горизонтальная тяга под столом', sets: 3, reps: 10, duration: null },
      { name: 'Отжимания домиком', sets: 3, reps: 10, duration: null },
      { name: 'Супермен', sets: 3, reps: 12, duration: null },
    ],
  },
]

const WORKOUTS_VERSION = 'v2'
const PLANNED_VERSION  = 'v4-april2026'

const WARMUP_A_IDS = ['e33', 'e43', 'e35', 'e36']
const WARMUP_B_IDS = ['e49', 'e38', 'e39', 'e41']
const WARMUP_C_IDS = ['e33', 'e37', 'e44', 'e46']

const WORKOUT_A_IDS = [...WARMUP_A_IDS, 'e01', 'e04', 'e08', 'e12', 'e06']
const WORKOUT_B_IDS = [...WARMUP_B_IDS, 'e13', 'e17', 'e14', 'e16', 'e18']
const WORKOUT_C_IDS = [...WARMUP_C_IDS, 'e13', 'e01', 'e17', 'e21', 'e20', 'e26']

const MARCH_SCHEDULE = {
  '2026-03-02': WORKOUT_A_IDS, '2026-03-04': WORKOUT_B_IDS, '2026-03-06': WORKOUT_C_IDS,
  '2026-03-09': WORKOUT_A_IDS, '2026-03-11': WORKOUT_B_IDS, '2026-03-13': WORKOUT_C_IDS,
  '2026-03-16': WORKOUT_A_IDS, '2026-03-18': WORKOUT_B_IDS, '2026-03-20': WORKOUT_C_IDS,
  '2026-03-23': WORKOUT_A_IDS, '2026-03-25': WORKOUT_B_IDS, '2026-03-27': WORKOUT_C_IDS,
  '2026-03-30': WORKOUT_A_IDS,
}

const APRIL_SCHEDULE = {
  // Первая половина (1–12): Ср, Пт, Пн, Ср, Пт
  '2026-04-01': WORKOUT_B_IDS, '2026-04-03': WORKOUT_C_IDS,
  '2026-04-06': WORKOUT_A_IDS, '2026-04-08': WORKOUT_B_IDS, '2026-04-10': WORKOUT_C_IDS,
  // Вторая половина (13–30): Пн, Ср, Пт
  '2026-04-13': WORKOUT_A_IDS, '2026-04-15': WORKOUT_B_IDS, '2026-04-17': WORKOUT_C_IDS,
  '2026-04-20': WORKOUT_A_IDS, '2026-04-22': WORKOUT_B_IDS, '2026-04-24': WORKOUT_C_IDS,
  '2026-04-27': WORKOUT_A_IDS, '2026-04-29': WORKOUT_B_IDS,
}

function buildDefaultPlannedWorkouts() {
  const result = {}
  const combined = { ...MARCH_SCHEDULE, ...APRIL_SCHEDULE }
  for (const [date, ids] of Object.entries(combined)) {
    result[date] = ids.map(id => ALL_EXERCISES.find(e => e.id === id)).filter(Boolean)
  }
  return result
}

function loadLocalWorkouts() {
  try {
    const ver = localStorage.getItem('workoutsVersion')
    const saved = localStorage.getItem('workouts')
    if (ver === WORKOUTS_VERSION && saved) return JSON.parse(saved)
  } catch {}
  return DEFAULT_WORKOUTS
}

function loadLocalSessions() {
  try {
    const saved = localStorage.getItem('sessions')
    return saved ? JSON.parse(saved) : []
  } catch { return [] }
}

function loadLocalPlanned() {
  try {
    const ver = localStorage.getItem('plannedVersion')
    const saved = localStorage.getItem('plannedWorkouts')
    if (ver === PLANNED_VERSION && saved) return JSON.parse(saved)
  } catch {}
  return buildDefaultPlannedWorkouts()
}

function loadLocalGroups() {
  try {
    const saved = localStorage.getItem('exerciseGroups')
    return saved ? JSON.parse(saved) : []
  } catch { return [] }
}

const WorkoutContext = createContext(null)

export function WorkoutProvider({ children }) {
  const { user } = useAuth()

  const [workouts,        setWorkouts]        = useState(loadLocalWorkouts)
  const [sessions,        setSessions]        = useState(loadLocalSessions)
  const [plannedWorkouts, setPlannedWorkouts] = useState(loadLocalPlanned)
  const [exerciseGroups,  setExerciseGroups]  = useState(loadLocalGroups)

  const firestoreLoaded = useRef(false)
  const saveTimer       = useRef(null)

  // ── localStorage (offline / без входа) ──────────────────────────────────────
  useEffect(() => {
    if (user) return
    localStorage.setItem('workouts', JSON.stringify(workouts))
    localStorage.setItem('workoutsVersion', WORKOUTS_VERSION)
  }, [workouts, user])

  useEffect(() => {
    if (user) return
    localStorage.setItem('sessions', JSON.stringify(sessions))
  }, [sessions, user])

  useEffect(() => {
    if (user) return
    localStorage.setItem('plannedWorkouts', JSON.stringify(plannedWorkouts))
    localStorage.setItem('plannedVersion', PLANNED_VERSION)
  }, [plannedWorkouts, user])

  useEffect(() => {
    if (user) return
    localStorage.setItem('exerciseGroups', JSON.stringify(exerciseGroups))
  }, [exerciseGroups, user])

  // ── Firestore: realtime sync ─────────────────────────────────────────────────
  useEffect(() => {
    if (!user) { firestoreLoaded.current = false; return }

    firestoreLoaded.current = false

    const userRef = doc(db, 'users', user.uid)

    const unsub = onSnapshot(userRef, snap => {
      if (snap.exists()) {
        const data = snap.data()
        if (Array.isArray(data.workouts))       setWorkouts(data.workouts)
        if (Array.isArray(data.sessions))       setSessions(data.sessions)
        if (data.plannedWorkouts && typeof data.plannedWorkouts === 'object')
          setPlannedWorkouts(data.plannedWorkouts)
        if (Array.isArray(data.exerciseGroups)) setExerciseGroups(data.exerciseGroups)
      } else {
        // Первый вход — мигрируем localStorage → Firestore
        setDoc(userRef, {
          workouts:        loadLocalWorkouts(),
          sessions:        loadLocalSessions(),
          plannedWorkouts: loadLocalPlanned(),
          exerciseGroups:  loadLocalGroups(),
        }).catch(console.error)
      }
      firestoreLoaded.current = true
    }, err => {
      console.error('Firestore error:', err)
    })

    return unsub
  }, [user])

  // ── Debounced write to Firestore ─────────────────────────────────────────────
  useEffect(() => {
    if (!user || !firestoreLoaded.current) return
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      setDoc(
        doc(db, 'users', user.uid),
        { workouts, sessions, plannedWorkouts, exerciseGroups },
        { merge: true }
      ).catch(console.error)
    }, 1000)
  }, [workouts, sessions, plannedWorkouts, exerciseGroups, user])

  // ── Actions ──────────────────────────────────────────────────────────────────
  function addWorkout(workout) {
    const newWorkout = { ...workout, id: 'w' + Date.now() }
    setWorkouts(prev => [...prev, newWorkout])
  }

  function deleteWorkout(id) {
    setWorkouts(prev => prev.filter(w => w.id !== id))
  }

  function logSession(workoutId, workoutName, durationSeconds, exerciseCount, exercises) {
    const session = {
      id: 's' + Date.now(),
      workoutId,
      workoutName,
      date: new Date().toISOString(),
      duration: durationSeconds,
      exerciseCount: exerciseCount ?? null,
      exercises: exercises ?? [],
    }
    setSessions(prev => [session, ...prev])
  }

  function deleteSession(id) {
    setSessions(prev => prev.filter(s => s.id !== id))
  }

  function planExercise(dateKey, exercise) {
    setPlannedWorkouts(prev => {
      const existing = prev[dateKey] ?? []
      if (existing.some(e => e.id === exercise.id)) return prev
      return { ...prev, [dateKey]: [...existing, exercise] }
    })
  }

  function removePlannedExercise(dateKey, exerciseId) {
    setPlannedWorkouts(prev => {
      const updated = (prev[dateKey] ?? []).filter(e => e.id !== exerciseId)
      return { ...prev, [dateKey]: updated }
    })
  }

  function clearDayPlan(dateKey) {
    setPlannedWorkouts(prev => ({ ...prev, [dateKey]: [] }))
  }

  // ── Exercise Groups CRUD ─────────────────────────────────────────────────────
  function createGroup(name, exerciseIds) {
    const group = {
      id: 'g' + Date.now(),
      name,
      exerciseIds: exerciseIds || [],
      createdAt: new Date().toISOString(),
    }
    setExerciseGroups(prev => [...prev, group])
  }

  function updateGroup(groupId, updates) {
    setExerciseGroups(prev =>
      prev.map(g => g.id === groupId ? { ...g, ...updates } : g)
    )
  }

  function deleteGroup(groupId) {
    setExerciseGroups(prev => prev.filter(g => g.id !== groupId))
  }

  function addExerciseToGroup(groupId, exerciseId) {
    setExerciseGroups(prev =>
      prev.map(g =>
        g.id === groupId && !g.exerciseIds.includes(exerciseId)
          ? { ...g, exerciseIds: [...g.exerciseIds, exerciseId] }
          : g
      )
    )
  }

  function removeExerciseFromGroup(groupId, exerciseId) {
    setExerciseGroups(prev =>
      prev.map(g =>
        g.id === groupId
          ? { ...g, exerciseIds: g.exerciseIds.filter(id => id !== exerciseId) }
          : g
      )
    )
  }

  function addGroupToPlan(dateKey, group) {
    const exercisesToAdd = group.exerciseIds
      .map(id => ALL_EXERCISES.find(e => e.id === id))
      .filter(Boolean)

    setPlannedWorkouts(prev => {
      const existing = prev[dateKey] ?? []
      const existingIds = new Set(existing.map(e => e.id))
      const newExercises = exercisesToAdd.filter(e => !existingIds.has(e.id))
      if (newExercises.length === 0) return prev
      return { ...prev, [dateKey]: [...existing, ...newExercises] }
    })
  }

  return (
    <WorkoutContext.Provider value={{
      workouts, sessions, exercises: ALL_EXERCISES, plannedWorkouts, exerciseGroups,
      addWorkout, deleteWorkout, logSession, deleteSession,
      planExercise, removePlannedExercise, clearDayPlan,
      createGroup, updateGroup, deleteGroup,
      addExerciseToGroup, removeExerciseFromGroup,
      addGroupToPlan,
    }}>
      {children}
    </WorkoutContext.Provider>
  )
}

export function useWorkouts() {
  return useContext(WorkoutContext)
}


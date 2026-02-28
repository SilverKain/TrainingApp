import { createContext, useContext, useState, useEffect } from 'react'
import exercisesData from '../../exercises_db.json'

const ALL_EXERCISES = exercisesData.exercises

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

const WorkoutContext = createContext(null)

const WORKOUTS_VERSION = 'v2' // bump this to reset saved workouts
const PLANNED_VERSION  = 'v2-march2026' // bump to reset planned schedule

// Разминки для тренировки A (верх тела): марш, махи руками, локти, кисти
const WARMUP_A_IDS = ['e33', 'e43', 'e35', 'e36']
// Разминки для тренировки B (низ тела): ходьба, тазобедренные, колени, динамические приседания
const WARMUP_B_IDS = ['e49', 'e38', 'e39', 'e41']
// Разминки для тренировки C (полное тело): марш, вращение корпусом, наклоны, выпады
const WARMUP_C_IDS = ['e33', 'e37', 'e44', 'e46']

// Тренировка A — Верх тела (Пн): Грудь, плечи, спина, трицепс
const WORKOUT_A_IDS = [...WARMUP_A_IDS, 'e01', 'e04', 'e08', 'e12', 'e06']
// Тренировка B — Низ тела (Ср): Квадрицепс, ягодицы, бёдра, икры
const WORKOUT_B_IDS = [...WARMUP_B_IDS, 'e13', 'e17', 'e14', 'e16', 'e18']
// Тренировка C — Полное тело (Пт): Всё тело
const WORKOUT_C_IDS = [...WARMUP_C_IDS, 'e13', 'e01', 'e17', 'e21', 'e20', 'e26']

// График март 2026: 3 раза в неделю (Пн/Ср/Пт), начало 2 марта
const MARCH_SCHEDULE = {
  '2026-03-02': WORKOUT_A_IDS, '2026-03-04': WORKOUT_B_IDS, '2026-03-06': WORKOUT_C_IDS,
  '2026-03-09': WORKOUT_A_IDS, '2026-03-11': WORKOUT_B_IDS, '2026-03-13': WORKOUT_C_IDS,
  '2026-03-16': WORKOUT_A_IDS, '2026-03-18': WORKOUT_B_IDS, '2026-03-20': WORKOUT_C_IDS,
  '2026-03-23': WORKOUT_A_IDS, '2026-03-25': WORKOUT_B_IDS, '2026-03-27': WORKOUT_C_IDS,
  '2026-03-30': WORKOUT_A_IDS,
}

function buildDefaultPlannedWorkouts() {
  const result = {}
  for (const [date, ids] of Object.entries(MARCH_SCHEDULE)) {
    result[date] = ids.map(id => ALL_EXERCISES.find(e => e.id === id)).filter(Boolean)
  }
  return result
}

export function WorkoutProvider({ children }) {
  const [workouts, setWorkouts] = useState(() => {
    try {
      const ver = localStorage.getItem('workoutsVersion')
      const saved = localStorage.getItem('workouts')
      if (ver === WORKOUTS_VERSION && saved) return JSON.parse(saved)
      return DEFAULT_WORKOUTS
    } catch {
      return DEFAULT_WORKOUTS
    }
  })

  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem('sessions')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // plannedWorkouts: { [YYYY-MM-DD]: [exercise, ...] }
  const [plannedWorkouts, setPlannedWorkouts] = useState(() => {
    try {
      const ver = localStorage.getItem('plannedVersion')
      const saved = localStorage.getItem('plannedWorkouts')
      if (ver === PLANNED_VERSION && saved) return JSON.parse(saved)
      return buildDefaultPlannedWorkouts()
    } catch {
      return buildDefaultPlannedWorkouts()
    }
  })

  useEffect(() => {
    localStorage.setItem('workouts', JSON.stringify(workouts))
    localStorage.setItem('workoutsVersion', WORKOUTS_VERSION)
  }, [workouts])

  useEffect(() => {
    localStorage.setItem('sessions', JSON.stringify(sessions))
  }, [sessions])

  useEffect(() => {
    localStorage.setItem('plannedWorkouts', JSON.stringify(plannedWorkouts))
    localStorage.setItem('plannedVersion', PLANNED_VERSION)
  }, [plannedWorkouts])

  function addWorkout(workout) {
    const newWorkout = { ...workout, id: 'w' + Date.now() }
    setWorkouts(prev => [...prev, newWorkout])
  }

  function deleteWorkout(id) {
    setWorkouts(prev => prev.filter(w => w.id !== id))
  }

  function logSession(workoutId, workoutName, durationSeconds) {
    const session = {
      id: 's' + Date.now(),
      workoutId,
      workoutName,
      date: new Date().toISOString(),
      duration: durationSeconds,
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

  return (
    <WorkoutContext.Provider value={{
      workouts, sessions, exercises: ALL_EXERCISES, plannedWorkouts,
      addWorkout, deleteWorkout, logSession, deleteSession,
      planExercise, removePlannedExercise, clearDayPlan,
    }}>
      {children}
    </WorkoutContext.Provider>
  )
}

export function useWorkouts() {
  return useContext(WorkoutContext)
}

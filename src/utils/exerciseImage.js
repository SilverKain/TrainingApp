const BASE_URL = `${import.meta.env.BASE_URL}exercises/`
const CUSTOM_PREFIX = 'custom_img_'

/**
 * Получить URL изображения упражнения.
 * Приоритет: кастомная (localStorage) → стандартная (exercises_db).
 */
export function getExerciseImage(exercise) {
  // Проверяем кастомную картинку
  try {
    const custom = localStorage.getItem(`${CUSTOM_PREFIX}${exercise.id}`)
    if (custom) return custom
  } catch {}

  // Стандартная из базы
  if (exercise.image) return `${BASE_URL}${exercise.image}`
  return null
}

/**
 * Есть ли кастомная картинка у упражнения.
 */
export function hasCustomImage(exerciseId) {
  try {
    return !!localStorage.getItem(`${CUSTOM_PREFIX}${exerciseId}`)
  } catch {
    return false
  }
}

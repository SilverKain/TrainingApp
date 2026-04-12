import { useState, useCallback } from 'react'

const KEY = (id) => `custom_img_${id}`
const MAX_SIZE = 900   // макс. ширина/высота в пикселях
const QUALITY  = 0.80  // качество JPEG

/** Сжать файл через Canvas и вернуть data URL */
function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const scale = Math.min(1, MAX_SIZE / Math.max(img.width, img.height))
        const w = Math.round(img.width  * scale)
        const h = Math.round(img.height * scale)
        const canvas = document.createElement('canvas')
        canvas.width  = w
        canvas.height = h
        canvas.getContext('2d').drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', QUALITY))
      }
      img.onerror = reject
      img.src = e.target.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Хук для управления кастомными картинками упражнений.
 * Хранит картинки как сжатые data URL в localStorage.
 * Возвращает { getImageUrl, uploadImage, removeImage, uploading }.
 */
export function useExerciseImages() {
  const [uploading, setUploading] = useState(null) // exerciseId или null

  /** Получить data URL картинки упражнения (из localStorage) */
  function getImageUrl(exerciseId) {
    try {
      return localStorage.getItem(KEY(exerciseId)) || null
    } catch {
      return null
    }
  }

  /** Сжать файл и сохранить data URL в localStorage */
  const uploadImage = useCallback(async (exerciseId, file) => {
    setUploading(exerciseId)
    try {
      const dataUrl = await compressImage(file)
      localStorage.setItem(KEY(exerciseId), dataUrl)
      return dataUrl
    } catch (err) {
      console.error('Image upload error:', err)
      throw err
    } finally {
      setUploading(null)
    }
  }, [])

  /** Удалить картинку упражнения из localStorage */
  const removeImage = useCallback(async (exerciseId) => {
    try {
      localStorage.removeItem(KEY(exerciseId))
    } catch (err) {
      console.error('Image remove error:', err)
      throw err
    }
  }, [])

  return { getImageUrl, uploadImage, removeImage, uploading }
}

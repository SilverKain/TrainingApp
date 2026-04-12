# Архитектура проекта FitTracker

## Стек технологий

| Технология | Версия | Роль |
|---|---|---|
| React | 18.3 | UI-фреймворк |
| Vite | 7.3 | Сборщик / dev-сервер |
| Tailwind CSS | 3.4 | Утилитарные стили |
| Firebase Auth | 12 | Аутентификация |
| Firestore | 12 | Облачная БД |
| gh-pages | — | Деплой на GitHub Pages |

---

## Дерево файлов и ответственность

```
Training-App/
│
├── index.html                  # Точка входа HTML, монтирует <div id="root">
├── vite.config.js              # Конфигурация Vite (base: '/TrainingApp/')
├── tailwind.config.js          # Конфигурация Tailwind
├── postcss.config.js           # PostCSS (автопрефиксер)
├── package.json                # Зависимости, скрипты (dev/build/deploy)
├── firestore.rules             # Правила безопасности Firestore
├── exercises_db.json           # База упражнений (статические данные ~50+ упр.)
├── .env                        # Переменные окружения Firebase (не в git)
│
├── public/
│   └── exercises/              # Изображения упражнений (e01.png, e02.png …)
│
└── src/
    ├── main.jsx                # Рендер React-дерева в DOM
    ├── App.jsx                 # Корневой компонент: роутинг, провайдеры
    ├── firebase.js             # Инициализация Firebase SDK
    ├── style.css               # Глобальные стили + Tailwind директивы
    │
    ├── context/
    │   ├── AuthContext.jsx     # Контекст авторизации
    │   └── WorkoutContext.jsx  # Контекст тренировок и данных
    │
    └── components/
        ├── Navbar.jsx          # Навигационная панель (desktop + mobile)
        ├── Landing.jsx         # Главная страница с приветствием
        ├── TodayPage.jsx       # Страница «Сегодня» (план дня)
        ├── WorkoutSession.jsx  # Активная тренировка (таймер + упражнения)
        ├── WorkoutList.jsx     # База упражнений из exercises_db.json
        ├── WorkoutCard.jsx     # Карточка тренировки (список WorkoutList)
        ├── CreateWorkout.jsx   # Форма создания тренировки
        ├── Progress.jsx        # Статистика и прогресс
        ├── Calendar.jsx        # Календарь с отметками сессий
        ├── AuthModal.jsx       # Модальное окно входа/регистрации
        ├── Theory.jsx          # Теоретический контент (статья)
        ├── Timer.jsx           # Секундомер / таймер обратного счёта
        └── Home.jsx            # Устаревший вариант главной (не выводится в App)
```

---

## Схема взаимодействия файлов

```
index.html
    └─► src/main.jsx
            └─► src/App.jsx
                    ├─ ОБОРАЧИВАЕТ В ПРОВАЙДЕРЫ:
                    │       ├─► context/AuthContext.jsx
                    │       └─► context/WorkoutContext.jsx
                    │
                    ├─► components/Navbar.jsx          (всегда виден)
                    │
                    └─ РОУТИНГ (state: page):
                            ├── page='home'     → Landing.jsx
                            ├── page='today'    → TodayPage.jsx
                            ├── page='session'  → WorkoutSession.jsx
                            ├── page='theory'   → Theory.jsx
                            ├── page='workouts' → WorkoutList.jsx + WorkoutCard.jsx
                            ├── page='progress' → Progress.jsx
                            └── page='create'   → CreateWorkout.jsx
```

---

## Контексты (глобальное состояние)

### `AuthContext.jsx`

**Зависимости:** `firebase.js` → Firebase Auth SDK

**Предоставляет через хук `useAuth()`:**

| Значение | Тип | Описание |
|---|---|---|
| `user` | `object\|null` | Текущий пользователь Firebase |
| `loading` | `boolean` | Идёт ли проверка сессии |
| `signUp(email, password, name)` | функция | Регистрация через email |
| `logIn(email, password)` | функция | Вход по email/паролю |
| `logInWithGoogle()` | функция | Вход через Google OAuth |
| `logOut()` | функция | Выход из аккаунта |

**Использует:** Firebase `onAuthStateChanged` для реактивного отслеживания сессии.

---

### `WorkoutContext.jsx`

**Зависимости:** `firebase.js` (Firestore), `AuthContext.jsx`, `exercises_db.json`

**Хранилище данных** (3 режима синхронизации):

```
Пользователь не залогинен  →  localStorage
Пользователь залогинен     →  Firestore (realtime onSnapshot)
Первый вход                →  localStorage → мигрирует в Firestore
```

**Предоставляет через хук `useWorkouts()`:**

| Значение | Описание |
|---|---|
| `workouts` | Список тренировочных программ |
| `sessions` | История завершённых тренировок |
| `exercises` | Все упражнения из `exercises_db.json` |
| `plannedWorkouts` | Словарь `{ "YYYY-MM-DD": [...упражнения] }` |
| `addWorkout(workout)` | Добавить тренировку |
| `deleteWorkout(id)` | Удалить тренировку |
| `logSession(...)` | Записать завершённую сессию |
| `deleteSession(id)` | Удалить запись сессии |
| `planExercise(dateKey, exercise)` | Запланировать упражнение на дату |
| `removePlannedExercise(dateKey, id)` | Убрать из плана |
| `clearDayPlan(dateKey)` | Очистить план на день |

**Встроенные данные:**
- 5 дефолтных тренировочных программ (`DEFAULT_WORKOUTS`)
- Расписание на март 2026 (`MARCH_SCHEDULE`) из упражнений базы

---

## Компоненты: зависимости и функции

### `Navbar.jsx`
- **Зависимости:** нет (получает `page` и `setPage` через props)
- **Функция:** Навигация между страницами. Desktop — верхняя панель, mobile — нижний таббар.
- **Страницы в меню:** Главная, Сегодня, Теория, Прогресс

---

### `Landing.jsx`
- **Зависимости:** `useAuth()`, `AuthModal`
- **Функция:** Главная страница с приветствием, плитки-ссылки на разделы, блок авторизации (войти/выйти).

---

### `AuthModal.jsx`
- **Зависимости:** `useAuth()`
- **Функция:** Модальное окно входа и регистрации. Поддерживает email/пароль и Google OAuth. Локализует ошибки Firebase.

---

### `TodayPage.jsx`
- **Зависимости:** `useWorkouts()`, `Calendar`
- **Функция:** Показывает план на сегодня (`plannedWorkouts[today]`), позволяет открыть детали упражнения, отметить выполнение, добавить упражнение в план. Включает мини-таймер отдыха между подходами.

---

### `Calendar.jsx`
- **Зависимости:** `useWorkouts()` (читает `sessions`, `plannedWorkouts`)
- **Функция:** Отображает месячный календарь. Дни с выполненными тренировками отмечены одним цветом, запланированные — другим. Позволяет выбрать дату.

---

### `WorkoutSession.jsx`
- **Зависимости:** `useWorkouts()` (использует `logSession`)
- **Функция:** Экран активной тренировки. Пошаговое прохождение упражнений с таймером отдыха (`CircleTimer`), подтверждение подходов, завершение сессии вызывает `logSession`.

---

### `WorkoutList.jsx`
- **Зависимости:** `useWorkouts()` (читает `exercises`)
- **Функция:** Список всех упражнений из `exercises_db.json`. Фильтрация по категории и уровню. Карточки упражнений с описанием техники и изображениями из `public/exercises/`.

---

### `WorkoutCard.jsx`
- **Зависимости:** `useWorkouts()` (использует `deleteWorkout`)
- **Функция:** Карточка тренировочной программы (из `workouts`). Разворачивает список упражнений, кнопки «Начать» и «Удалить».

---

### `CreateWorkout.jsx`
- **Зависимости:** `useWorkouts()` (использует `addWorkout`)
- **Функция:** Форма создания пользовательской тренировки. Динамический список упражнений с переключением режима повторения/секунд.

---

### `Progress.jsx`
- **Зависимости:** `useWorkouts()` (читает `sessions`, `deleteSession`)
- **Функция:** Статистика — общее число тренировок, суммарное время, столбчатый график активности за 7 дней, история сессий с возможностью удалить.

---

### `Theory.jsx`
- **Зависимости:** нет
- **Функция:** Статический теоретический контент — принципы гипертрофии, суперкомпенсация, принципы тренинга и т.д.

---

### `Timer.jsx`
- **Зависимости:** `useWorkouts()` (использует `logSession`)
- **Функция:** Секундомер и таймер обратного отсчёта. По завершении предлагает залогировать тренировку.

---

### `Home.jsx`
- **Зависимости:** `useWorkouts()`, `Calendar`
- **Статус:** Файл присутствует в проекте, но **не подключён в `App.jsx`** (заменён на `Landing.jsx`).

---

## Поток данных: вход и синхронизация

```
Пользователь открывает приложение
        │
        ▼
AuthContext: onAuthStateChanged
        │
        ├── user = null ──► WorkoutContext: читает localStorage
        │
        └── user = {uid} ──► WorkoutContext: подписывается на Firestore
                                    │
                                    ├── snap.exists() ──► загружает данные из Firestore
                                    │
                                    └── !snap.exists() ──► мигрирует localStorage → Firestore
```

---

## Поток данных: выполнение тренировки

```
TodayPage / WorkoutList
    │  onStartWorkout(workout)
    ▼
App.jsx: setActiveWorkout(workout), setPage('session')
    │
    ▼
WorkoutSession.jsx
    │  (пользователь проходит упражнения)
    │  onFinish() → logSession(id, name, duration, count, exercises)
    ▼
WorkoutContext: setSessions([newSession, ...prev])
    │
    ├── user залогинен → debounced setDoc() в Firestore (задержка 1 с)
    └── user не залогинен → localStorage.setItem('sessions', ...)
```

---

## Работа с Firebase

### `firebase.js` — единственная точка инициализации

```js
// Экспортирует:
export const auth          // FirebaseAuth — для входа/выхода
export const db            // Firestore — для хранения данных
export const googleProvider // GoogleAuthProvider — OAuth
```

### Структура Firestore

```
/users/{uid}/
    workouts:        WorkoutProgram[]    // тренировочные программы
    sessions:        Session[]           // история сессий
    plannedWorkouts: { [date]: Exercise[] }  // план по датам
```

### Правила безопасности (`firestore.rules`)

Пользователь может читать и писать **только свои** документы:
```
/users/{userId} → allow read, write if auth.uid == userId
```

---

## Конфигурация окружения (`.env`)

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Все переменные имеют префикс `VITE_` — это требование Vite для доступа через `import.meta.env`.

---

## Деплой

```
npm run build   →  Vite собирает dist/
npm run deploy  →  gh-pages публикует dist/ → GitHub Pages
                   URL: https://silverkain.github.io/TrainingApp/
```

Base URL в `vite.config.js` установлен как `/TrainingApp/`, поэтому ссылки на изображения строятся через `import.meta.env.BASE_URL`.

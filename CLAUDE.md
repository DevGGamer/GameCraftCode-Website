# GameCraftCode Website

Платформа онлайн-обучения программированию для детей. Монорепозиторий с FastAPI бэкендом и React фронтендом.

## Tech Stack

**Backend** (`app/`): FastAPI + SQLAlchemy + Alembic + PostgreSQL + MinIO (S3-хранилище файлов)
**Frontend** (`frontend/`): React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui (Radix UI)
**Infra**: Docker Compose (PostgreSQL, pgAdmin, MinIO, backend, frontend)

## Project Structure

```
app/                          # Backend (FastAPI)
  main.py                     # Точка входа: CORS, роутеры, Alembic миграции при старте
  models.py                   # SQLAlchemy модели (6 таблиц)
  database.py                 # Подключение к БД (DATABASE_URL из env)
  schemas.py                  # Pydantic DTO-модели (вход/выход для всех ролей)
  dependencies.py             # Общие зависимости (get_db, require_role, minio_client)
  auth.py                     # JWT (python-jose) + argon2 хеширование паролей
  routers/                    # FastAPI роутеры (6 модулей)
    auth.py                   # /api/login, /api/protected
    profile.py                # GET/PUT /api/profile (аватар, streak, активность)
    users.py                  # CRUD /api/users, reset-password, /api/teachers (admin)
    courses.py                # /api/courses, /api/user_course/, привязка к курсам
    lessons.py                # /api/lessons/.../start|complete
    upload.py                 # /api/upload/{bucket} (MinIO)
  alembic.ini                 # Конфигурация Alembic
  migrations/                 # Alembic миграции
    env.py                    # Конфиг (читает DATABASE_URL, импортирует модели)
    script.py.mako            # Шаблон миграций
    versions/                 # Файлы миграций
  init_data.py                # Скрипт начальных данных
  requirements.txt            # Python зависимости
  Dockerfile                  # python:3.13-slim + uvicorn

frontend/                     # Frontend (React + Vite)
  src/
    config.ts                 # Единый конфиг API_URL (из VITE_API_URL)
    api.ts                    # Централизованный axios с JWT-интерсептором
    contexts/
      AuthContext.tsx          # React Context: user, stats, login, logout, refreshProfile
    components/
      ProtectedRoute.tsx       # Обёртка маршрутов: аутентификация + проверка ролей
      dashboard/
        DashboardLayout.tsx    # Общий layout дашборда (sidebar + header)
      ui/                      # shadcn/ui компоненты (Button, Card, Dialog, etc.)
      Header.tsx, Footer.tsx, StarField.tsx, ...
    pages/
      Index.tsx                # Лендинг (Hero, About, Programs, Gallery, Pricing, Reviews)
      Login.tsx                # Авторизация (JWT + remember me)
      CourseDetail.tsx          # Публичная страница курса
      NotFound.tsx              # 404
      CoursesPage/              # Управление курсами
      EducationPage/            # Обучение (студент)
      SettingsPage/             # Настройки (тема)
      StudentsPage/             # Список студентов (заглушка)
      dashboard/
        Dashboard.tsx           # Главная панель (приветствие, текущий курс, навигация)
        Profile.tsx             # Профиль (редактирование, аватар)
        AdminPanel.tsx          # Админ-панель (CRUD пользователей, сброс пароля)
        MyCourses.tsx           # Мои курсы (из API)
        CurrentCourse.tsx       # Содержимое курса (модули, уроки)
        VideoLesson.tsx         # Видеоплеер урока
        AssignmentView.tsx      # Просмотр задания (мок)
        AssignmentSubmit.tsx    # Отправка задания (мок)
        AssignmentFeedback.tsx  # Обратная связь (мок)
        Achievements.tsx        # Достижения (заглушка + count из API)
        Schedule.tsx            # Расписание (заглушка)
        MyProjects.tsx          # Мои проекты (заглушка)
        Community.tsx           # Сообщество (заглушка)
        BalanceTopUp.tsx        # Пополнение баланса (мок)
        MethodologistPanel.tsx  # Панель методиста (скелет)
        CourseBuilder.tsx       # Конструктор курсов (скелет)
  Dockerfile                   # Multi-stage: node build → nginx
  nginx.conf                   # SPA routing (try_files)

docker-compose.yml             # Все сервисы (db, pgadmin, minio, backend, frontend)
.env                           # Секреты (не в git)
.env.example                   # Шаблон переменных
```

## Database Models (PostgreSQL)

| Модель | Таблица | Описание |
|--------|---------|----------|
| **Users** | `users` | id, login (unique), password (argon2), name, surname, email, phone, birth_date, role, level, coins, balance, created_at |
| **UserCourses** | `user_courses` | student_id → users, teacher_id → users, course_id, start_date, completed_lessons (JSONB) |
| **UserAchievement** | `user_achievements` | user_id → users, achievement_id. Unique (user_id, achievement_id) |
| **UserActivity** | `user_activity` | user_id → users, activity_date. Unique (user_id, activity_date). Для подсчёта streak |
| **ParentStudent** | `parent_student_relationships` | Composite PK: parent_id → users, student_id → users |
| **TeacherInfo** | `teacher_info` | Composite PK: teacher_id → users, course_id |

Роли пользователей: `admin`, `teacher`, `student`, `parent`

## Database Migrations (Alembic)

Миграции в `app/migrations/`. При старте приложения автоматически выполняется `alembic upgrade head`.

```bash
# Создать новую миграцию после изменения models.py
alembic -c app/alembic.ini revision --autogenerate -m "описание"

# Применить миграции вручную
alembic -c app/alembic.ini upgrade head

# Откатить последнюю миграцию
alembic -c app/alembic.ini downgrade -1

# Посмотреть текущую ревизию
alembic -c app/alembic.ini current
```

## API Endpoints (app/routers/)

### Auth (`routers/auth.py`)
| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| POST | /api/login | — | Public | Авторизация, возвращает JWT (24h). Rate limit: 10 попыток / 600 сек |
| GET | /api/protected | Bearer | All | Проверка токена, возвращает payload (id, role, login) |

### Profile (`routers/profile.py`)
| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | /api/profile | Bearer | All | Профиль + статистика (coins, balance, streak, level, achievements) |
| PUT | /api/profile | Bearer | All | Обновление (name, surname, email, phone, birthDate, avatar) |

### Users (`routers/users.py`) — Admin only
| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | /api/users | Bearer | admin | Список всех пользователей (role-specific DTO) |
| GET | /api/users/{id} | Bearer | admin | Пользователь по ID |
| POST | /api/users | Bearer | admin | Создание (с вложенными связями: курсы, дети, предметы) |
| PUT | /api/users/{id} | Bearer | admin | Обновление (пересоздание связей при смене роли) |
| DELETE | /api/users/{id} | Bearer | admin | Удаление (каскад + очистка аватара в MinIO) |
| POST | /api/users/{id}/reset-password | Bearer | admin | Сброс пароля (генерация, хеширование, возврат plain) |
| GET | /api/teachers | Bearer | admin | Список преподавателей |

### Courses (`routers/courses.py`)
| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | /api/courses | Bearer | All | Все курсы из MinIO (passport.json) |
| GET | /api/user_course/ | Bearer | All | Курсы текущего пользователя с прогрессом |
| GET | /api/user_course/{student_id} | Bearer | All | Курсы конкретного студента |
| GET | /api/add_user_course_and_teacher/{student_id}/{course}/{block}/{teacher_id} | Bearer | All | Привязка студента к курсу |

### Lessons (`routers/lessons.py`)
| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| POST | /api/lessons/{student_name}/{lesson_id}/start | Bearer | All | Начать урок (presigned URL для видео) |
| POST | /api/lessons/{student_name}/{lesson_id}/complete | Bearer | All | Завершить урок |

### Upload (`routers/upload.py`)
| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| POST | /api/upload/{bucket} | Bearer | All | Загрузка файлов в MinIO (multi-file) |

## Backend Schemas (app/schemas.py)

**Входные:**
- `LoginRequest` — login, password
- `UserInfoRequest` — name, surname, email, phone, birthDate, avatar (UploadFile)

**DTO по ролям (выходные):**
- `UserBaseDTO` — id, name, surname, email, phone, role
- `StudentDTO` → UserBaseDTO + parent_id, courses[]
- `ParentDTO` → UserBaseDTO + children[]
- `TeacherDTO` → UserBaseDTO + courses[]
- `AdminDTO` → UserBaseDTO
- `UserResponseDTO` — Union всех role DTO

**Создание/обновление:**
- `StudentIn`, `ParentIn`, `TeacherIn`, `AdminIn` — по ролям с вложенными связями
- `UserCreateDTO` — Union всех creation DTO

## Backend Auth (app/auth.py)

| Функция | Описание |
|---------|----------|
| `hash_password(password)` | Хеширование Argon2 |
| `verify_password(plain, hashed)` | Проверка пароля |
| `generate_random_password(length=12)` | Генерация случайного пароля (alphanumeric) |
| `generate_token(user)` | Создание JWT (id, role, login, exp=24h) |
| `verify_token(auth_header)` | Декодирование и валидация JWT |

Обратная совместимость: при логине plain-text пароли автоматически мигрируются в Argon2.

## Backend Dependencies (app/dependencies.py)

| Export | Описание |
|--------|----------|
| `get_db()` | Генератор SQLAlchemy Session (Depends) |
| `require_role(*roles)` | Фабрика зависимостей для RBAC. Возвращает dependency, проверяющий role из JWT |
| `minio_client` | Экземпляр Minio (credentials из env: MINIO_ACCESS_KEY, MINIO_SECRET_KEY) |
| `MINIO_PUBLIC_URL` | URL MinIO для presigned URLs (env: MINIO_ENDPOINT, default: localhost:4000) |

## Environment Variables

Все секреты в `.env` файле (шаблон — `.env.example`):

| Variable | Used by | Description |
|----------|---------|-------------|
| POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB | db, backend | Креды PostgreSQL |
| PGADMIN_DEFAULT_EMAIL, PGADMIN_DEFAULT_PASSWORD | pgadmin | Креды pgAdmin |
| MINIO_ROOT_USER, MINIO_ROOT_PASSWORD | minio, backend | Креды MinIO |
| JWT_SECRET | backend | Секрет для JWT токенов |
| CORS_ORIGINS | backend | Разрешённые origin'ы через запятую (default: `*`) |
| VITE_API_URL | frontend (build-time) | URL бэкенда (default: http://localhost:8000) |

Backend: `os.getenv()` с fallback-значениями.
Frontend: `import.meta.env.VITE_API_URL` (Vite build-time) → единый конфиг `frontend/src/config.ts`.

## Ports

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 3000 | nginx (production) / Vite dev server |
| Backend | 8000 | FastAPI + Uvicorn |
| PostgreSQL | 5432 | БД |
| pgAdmin | 8080 | UI для PostgreSQL |
| MinIO API | 4000 (host) → 9000 (container) | S3-совместимое хранилище |
| MinIO Console | 4001 (host) → 9001 (container) | UI MinIO |

## MinIO Storage

Курсы хранятся в MinIO как JSON-файлы (`passport.json`) и медиа. Бакеты:
- `courses` — данные курсов (passport.json, иконки, видео)
- `users` — аватарки пользователей

Backend подключается к MinIO через `MINIO_ENDPOINT` (в Docker: `minio:9000`, локально: `localhost:4000`).
Аватары и видео отдаются через presigned URLs (1 час).

## Frontend Routes (App.tsx)

### Публичные
| Path | Компонент | Статус |
|------|-----------|--------|
| / | Index | Готов |
| /login | Login | Готов |
| /course/:courseSlug | CourseDetail | Готов |
| * | NotFound | Готов |

### Защищённые (ProtectedRoute)
| Path | Компонент | Статус |
|------|-----------|--------|
| /dashboard | Dashboard | Готов (API) |
| /dashboard/profile | Profile | Готов (API) |
| /dashboard/courses | MyCourses | Готов (API) |
| /dashboard/courses/:courseId | CurrentCourse | Готов (client state) |
| /dashboard/courses/:courseId/lesson/:lessonId | VideoLesson | Готов (client state) |
| /dashboard/courses/:courseId/assignment/:id | AssignmentView | Мок |
| /dashboard/courses/:courseId/assignment/:id/submit | AssignmentSubmit | Мок |
| /dashboard/courses/:courseId/assignment/:id/feedback | AssignmentFeedback | Мок |
| /dashboard/schedule | Schedule | Заглушка |
| /dashboard/projects | MyProjects | Заглушка |
| /dashboard/community | Community | Заглушка |
| /dashboard/achievements | Achievements | Частично (count из API) |
| /dashboard/balance | BalanceTopUp | Мок |
| /dashboard/education | EducationPage | Частично |
| /dashboard/students | StudentsPage | Заглушка |
| /dashboard/settings | SettingsPage | Тема |

### Ролевые ограничения
| Path | Компонент | Роли | Статус |
|------|-----------|------|--------|
| /dashboard/admin | AdminPanel | admin | Готов (API) |
| /dashboard/methodologist | MethodologistPanel | admin, teacher | Скелет |
| /dashboard/course-builder/:courseId | CourseBuilder | admin, teacher | Скелет |

## Development

```bash
# Локально
cd frontend && npm install && npm run dev    # :3000
cd app && uvicorn app.main:app --reload      # :8000

# Docker
docker-compose up --build                    # Все сервисы
docker-compose up --build -d                 # В фоне
docker-compose down                          # Остановить

# Alembic (из корня проекта)
alembic -c app/alembic.ini revision --autogenerate -m "описание"
alembic -c app/alembic.ini upgrade head
```

## Key Patterns

- **Auth**: JWT токены (24h) в `Authorization: Bearer <token>`. Генерация/верификация в `app/auth.py`. Argon2 хеширование с авто-миграцией plain-text паролей при логине
- **RBAC**: `require_role("admin", "teacher")` — фабрика зависимостей FastAPI. Проверяет роль из JWT payload
- **CORS**: `CORS_ORIGINS` env (default `*`). Для production — конкретные домены через запятую
- **Frontend Auth**: `useAuth()` контекст — user, stats, login(), logout(), refreshProfile(). `<ProtectedRoute allowedRoles={[...]}>`
- **API client**: `frontend/src/api.ts` — axios с JWT-интерсептором (auto-attach token, auto-logout на 401)
- **API URL**: единый конфиг `frontend/src/config.ts` → `import { API_URL } from "@/config"`
- **Frontend routing**: React Router DOM v6, SPA — nginx через `try_files $uri /index.html`
- **UI Kit**: shadcn/ui в `frontend/src/components/ui/`. Tailwind CSS + шрифты Nunito, Space Grotesk
- **DB migrations**: Alembic — автоматический `upgrade head` при старте приложения
- **File storage**: MinIO S3 — курсы в `courses` бакете, аватары в `users`. Presigned URLs на 1 час

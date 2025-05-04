# MaK CRM & Telegram Bot (twenty)

## О проекте
CRM-система и Telegram-бот для компании MaK CRM, реализуемые с нуля на базе open-source платформы [twenty](https://github.com/twentyhq/twenty). Цель — эффективное взаимодействие между отделами, партнёрами и франчайзи, автоматизация и стандартизация бизнес-процессов в сфере кредитного брокериджа.

## Технологический стек
- **Основа CRM:** twenty (Elixir, Phoenix, LiveView, PostgreSQL, TailwindCSS)
- **Frontend:** Phoenix LiveView, TailwindCSS
- **Backend:** Elixir, Phoenix, Ecto
- **База данных:** PostgreSQL
- **Telegram-бот:** Elixir (ExGram/Telegex)
- **Интеграции:** amoCRM API, REST API
- **Контейнеризация:** Docker
- **CI/CD:** GitHub Actions
- **Git:** интеграция с GitHub, полный контроль версий, автоматическая синхронизация с публичным репозиторием

## Структура проекта
- `/lib` — основной код приложения (Phoenix, Ecto, LiveView)
- `/priv` — миграции, статические файлы
- `/test` — тесты
- `/docs` — документация проекта
- `/telegram_bot` — Telegram-бот (Elixir)
- [Roadmap реализации](roadmap.md)

## Правила разработки
1. Весь код должен быть хорошо документирован (ExDoc)
2. Для каждого нового функционала — отдельная ветка
3. Перед мержем в основную ветку — обязательный код-ревью
4. Все изменения отражаются в changelog.md
5. Тесты обязательны для критичных компонентов (Elixir ExUnit)

## Архитектурные и фронтенд-правила (Phoenix LiveView)

1. Для каждой сущности (например, Client, Franchisee, Partner):
   - Используется модуль LiveView с шаблонами для CRUD (без SPA/React)
   - Конфигурация форм и таблиц через отдельные модули/структуры
   - Весь CRUD-интерфейс реализуется через LiveView и компоненты TailwindCSS
   - Не создаются отдельные frontend-приложения на React/Vue

2. Структура модуля:
   - Модуль LiveView (например, MakCrmWeb.ClientLive)
   - Модуль Ecto-схемы (например, MakCrm.Client)
   - Контроллер (если нужен REST API)
   - Все бизнес-правила — в контексте (например, MakCrm.Clients)

3. Для новых страниц/модулей:
   - Сначала создаётся схема и миграция (Ecto)
   - Затем LiveView-модуль и шаблоны
   - Не плодить лишних файлов — только схема, контекст, LiveView, шаблоны

4. Для заглушек (если модуль в разработке):
   - Использовать компонент LiveView с сообщением о разработке

5. Для backend-сущностей придерживаться структуры: схема, миграция, контекст, LiveView/контроллер

---

Эти правила обеспечивают единый стиль, ускоряют разработку и упрощают поддержку MaK CRM на базе twenty.

## Роли и права доступа (RBAC)
- **admin** — полный доступ ко всем сущностям и функциям CRM
- **employee** — доступ к клиентам, лидам, аналитике
- **franchisee** — доступ к своим лидам, аукциону, аналитике
- **partner** — доступ к кабинету партнёра, рефералам, аналитике
- **guest** — ограниченный доступ (например, только регистрация)
- Все модели поддерживают мультитенантность через tenant_id (если потребуется)

## Интеграции
- **amoCRM:** двусторонняя синхронизация клиентов/лидов
- **Telegram-бот:** уведомления, регистрация, обработка лидов
- **Внешние API:** верификация, финансы, аналитика
- Полностью актуализировано ТЗ (ТЗ_CRM_2025.md): добавлены требования по гибкому конструктору отчётов, обработке дублей, интеграции с внешними чатами, расширенным полям регистрации, механике грейдов, автоматизации документов, гибкости этапов воронки, поддержке интеграций с другими мессенджерами. Все пожелания заказчика из исходного TZ CRM.md учтены.

## Быстрый старт (локально)

```bash
# Клонировать репозиторий
 git clone https://github.com/maslennikov-ig/MaK-CRM.git
 cd MaK-CRM

# Скопировать env-файлы
 cp .env.example .env

# Собрать и запустить через Docker Compose
 docker compose up --build

# Миграции и сиды (если нужно)
 docker compose exec app mix ecto.setup

# Запуск Telegram-бота (если вынесен в отдельный сервис)
 docker compose up telegram_bot
```

## Документация
- `/docs` — архитектура, инфраструктура, ТЗ, changelog, roadmap
- [architecture.md](docs/architecture.md) — архитектура
- [infrastructure.md](docs/infrastructure.md) — инфраструктура
- [ТЗ_CRM_2025.md](docs/ТЗ_CRM_2025.md) — техническое задание
- [changelog.md](docs/changelog.md) — журнал изменений
- [roadmap.md](docs/roadmap.md) — поэтапный план

---

_Документ актуален для MaK-CRM на базе twenty, май 2025._

# MaK-CRM (на базе twenty)

## Описание
MaK-CRM — современная CRM-система на базе платформы twenty (https://github.com/twentyhq/twenty), построенная по принципам monorepo (nx, yarn).

## Основные команды (nx)

### Фронтенд
- `npx nx test twenty-front` — юнит-тесты
- `npx nx storybook:build twenty-front` — билд Storybook
- `npx nx storybook:serve-and-test:static` — тесты Storybook
- `npx nx lint twenty-front` — линтер
- `npx nx typecheck twenty-front` — проверка типов
- `npx nx run twenty-front:graphql:generate` — генерация GraphQL-типов

### Бэкенд
- `npx nx database:reset twenty-server` — сброс БД
- `npx nx run twenty-server:database:init:prod` — инициализация БД
- `npx nx run twenty-server:database:migrate:prod` — миграции
- `npx nx run twenty-server:start` — запуск сервера
- `npx nx run twenty-server:lint` — линтер
- `npx nx run twenty-server:typecheck` — проверка типов
- `npx nx run twenty-server:test` — юнит-тесты
- `npx nx run twenty-server:test:integration:with-db-reset` — интеграционные тесты
- `npx nx run twenty-server:command workspace:sync-metadata -f` — синк метаданных

### Переводы
- `npx nx run twenty-front:lingui:extract` — извлечение переводов
- `npx nx run twenty-front:lingui:compile` — компиляция переводов

## Структура пакетов
- `packages/twenty-front` — фронтенд (React)
- `packages/twenty-server` — бэкенд (NestJS)
- `packages/twenty-ui` — UI-kit
- `packages/twenty-shared` — shared-утилиты
- `packages/twenty-website` — сайт и документация

## Стандарты и гайдлайны
- Строгая типизация (TypeScript strict, no any)
- Одна сущность/компонент — один файл
- Модули по фичам (feature-modules)
- Тесты рядом с кодом, покрытие 80%+
- Локализация через Lingui, Crowdin
- Только функциональные компоненты, только именованные экспорты
- Следовать гайдлайнам из .cursor/rules

_Документ синхронизирован с правилами и best practices twenty._

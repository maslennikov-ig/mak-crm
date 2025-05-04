# Архитектура MaK-CRM (на базе twenty)

## Общий обзор
MaK-CRM построен на базе open-source платформы twenty (см. https://github.com/twentyhq/twenty) и использует современные практики монорепозитория (nx).

### Основные пакеты:
- `packages/twenty-front`: основной фронтенд (React, Recoil, Apollo)
- `packages/twenty-server`: основной бэкенд (NestJS, TypeORM, PostgreSQL, Redis, BullMQ)
- `packages/twenty-ui`: UI-kit и дизайн-система (React)
- `packages/twenty-shared`: общие утилиты, типы, константы
- `packages/twenty-website`: сайт и документация (NextJS)

### Технологический стек:
- **Frontend:** React (только функциональные компоненты, именованные экспорты), Recoil (глобальное состояние), Apollo (GraphQL)
- **Backend:** NestJS, TypeORM (core/metadata), TwentyORM (workspace/tenant), PostgreSQL, Redis, BullMQ (очереди), S3/локальное хранилище
- **Monorepo:** nx, yarn
- **Тесты:** Jest, Playwright, Storybook, MSW
- **I18n:** Lingui, Crowdin
- **CI/CD:** GitHub Actions, Docker

### Архитектурные принципы:
- Модульность, масштабируемость, независимость фич
- Строгая типизация (TypeScript strict)
- Единые гайдлайны по стилю, структуре, тестированию, переводам
- Мульти-арендность (multi-tenant) через схемы PostgreSQL и TwentyORM
- Безопасность: JWT, RBAC, аудит, резервное копирование

## Структура БД
- Основная схема: данные приложения
- Метаданные: настройки, кастомизации
- Workspace-схемы: отдельные данные для каждого tenant

## Инфраструктура
- Требования: Node.js, yarn, PostgreSQL, Redis, S3, Docker
- Поддержка горизонтального масштабирования, автоматизации, мониторинга

_Документ синхронизирован с правилами и best practices twenty._

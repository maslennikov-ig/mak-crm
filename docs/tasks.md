# Этап 2. Базовая CRM-платформа

## 2.1 Модели и миграции (TypeORM/TwentyORM)
- [x] User (core schema, TypeORM)
    - [x] Описать сущность User (id, имя, email, телефон, роль, tenant_id и др.)
    - [x] Миграция для создания таблицы users (добавление полей tenant_id и role)
    - [x] Тесты на CRUD (Jest/Supertest, покрытие 80%+)
    - [x] Проверить соответствие code-style-guidelines.md
    - [x] Проверить структуру по file-structure-guidelines.md
    - [x] Строгая типизация (typescript-guidelines.md)
    - [x] Документация по структуре User (Swagger, ссылка на ТЗ 2.1.1, 2.1.5)
- [x] Role (core schema, TypeORM)
    - [x] Описать сущность Role (id, название, описание, права)
    - [x] Миграция для создания таблицы roles
    - [x] Тесты на CRUD
    - [x] Проверить соответствие code-style-guidelines.md
    - [x] Проверить структуру по file-structure-guidelines.md
    - [x] Строгая типизация
    - [x] Документация (Swagger)
- [ ] Client (core schema, TypeORM)
    - [ ] Описать сущность Client (id, ФИО, контакты, источник, tenant_id и др.)
    - [ ] Миграция для clients
    - [ ] Тесты на CRUD
    - [ ] Проверить соответствие code-style-guidelines.md
    - [ ] Проверить структуру по file-structure-guidelines.md
    - [ ] Строгая типизация
    - [ ] Документация (Swagger)
- [ ] Lead (core schema, TypeORM)
    - [ ] Описать сущность Lead (id, client_id, статус, источник, дата, комментарии и др.)
    - [ ] Миграция leads
    - [ ] Тесты на CRUD
    - [ ] Проверить соответствие code-style-guidelines.md
    - [ ] Проверить структуру по file-structure-guidelines.md
    - [ ] Строгая типизация
    - [ ] Документация (Swagger)
- [ ] Workspace/tenant модели (workspace schema, TwentyORM)
    - [ ] Реализовать мультиарендность через tenant_id/схемы (см. architecture.md)
    - [ ] Тесты на разграничение данных между tenant
    - [ ] Проверить структуру по file-structure-guidelines.md

## 2.2 Аутентификация и RBAC
- [ ] Настроить Passport.js с JWT (token-based flow)
    - [ ] Реализовать регистрацию/логин
    - [ ] Тесты на авторизацию, refresh, logout
    - [ ] Проверить code-style и типизацию
    - [ ] Документация по эндпоинтам (Swagger)
- [ ] Реализовать RBAC (матрица прав)
    - [ ] CRUD ролей, назначение ролей пользователям
    - [ ] Ограничение доступа к эндпоинтам по ролям
    - [ ] Тесты на разграничение доступа (admin, employee, partner, franchisee, guest)
    - [ ] Документация по ролям и правам

## 2.3 CRUD-интерфейсы (NestJS, REST/GraphQL)
- [ ] UserController
    - [ ] CRUD endpoints (REST/GraphQL)
    - [ ] DTO, валидация, тесты
    - [ ] Документация (Swagger, GraphQL schema)
    - [ ] Проверить code-style и типизацию
- [ ] ClientController
    - [ ] CRUD endpoints, DTO, тесты
    - [ ] Документация (Swagger, GraphQL schema)
- [ ] LeadController
    - [ ] CRUD endpoints, DTO, тесты
    - [ ] Документация (Swagger, GraphQL schema)
- [ ] RoleController
    - [ ] CRUD endpoints, DTO, тесты
    - [ ] Документация (Swagger, GraphQL schema)

## 2.4 Импорт/экспорт клиентов (backend + frontend)
- [ ] Импорт клиентов (CSV, Excel, ручной ввод)
    - [ ] Реализовать парсер CSV/Excel (backend)
    - [ ] UI для ручного ввода (frontend, React, только функциональные компоненты)
    - [ ] Валидация и обработка ошибок (UX сценарии)
    - [ ] Покрыть тестами (разные форматы, edge cases)
    - [ ] Все строки через Lingui (translations.md)
- [ ] Экспорт клиентов
    - [ ] API и UI для экспорта
    - [ ] Тесты на экспорт больших выборок
    - [ ] Проверить UX (loading, ошибки)

## 2.5 Проверка дублей
- [ ] Реализовать поиск дублей по ключевым полям (телефон, email)
- [ ] Уведомление ответственного при попытке создать дубль (notification system)
- [ ] Покрыть тестами (edge cases)
- [ ] Все сообщения через Lingui

## 2.6 Сегментация и статусы
- [ ] Реализовать фильтрацию по источникам и статусам (backend + frontend)
- [ ] CRUD справочника статусов лида
- [ ] Покрыть тестами (фильтрация, статусы)
- [ ] Все UI-строки через Lingui

## 2.7 Frontend особенности (twenty-front)
- [ ] Использовать только функциональные компоненты (react-general-guidelines.md)
- [ ] Только именованные экспорты
- [ ] Глобальное состояние через Recoil (atoms/selectors в states/ по фичам)
- [ ] Серверное состояние через Apollo Client, отдельные queries/fragments
- [ ] Структура директорий: modules/, components/, hooks/, states/, types/
- [ ] Покрытие тестами (Jest, React Testing Library, Storybook, MSW)
- [ ] Использовать data-testid для тестов
- [ ] Все UI-строки через Lingui

## Контрольные точки
- [ ] Smoke-тесты CRUD-интерфейсов (co-located)
- [ ] Проверка RBAC для всех ролей
- [ ] Импорт/экспорт протестирован на реальных файлах
- [ ] Проверка механизма дублей
- [ ] Валидация миграций и тестовых данных
- [ ] Минимальный UX review (удобство, ошибки, loading)
- [ ] Проверить соответствие code-style, структуре, тестированию, переводам, типизации для всех задач

---
_Все задачи и подзадачи снабжены чекбоксами и прямыми ссылками на ключевые правила и документы. Формат полностью соответствует стандартам twenty и windsurf/task-list.mdc._
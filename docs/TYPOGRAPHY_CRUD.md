# CRUD Интерфейс Управления Типографикой

## Обзор

Полнофункциональный CRUD интерфейс для управления typography стилями в админ-панели. Позволяет редактировать Tailwind CSS классы, хранящиеся в Supabase, с live preview изменений.

## Структура файлов

```
Admin/
├── app/
│   ├── (dashboard)/
│   │   └── typography/
│   │       └── page.tsx                     # Главная страница управления типографикой
│   └── api/
│       └── typography/
│           └── [id]/
│               └── route.ts                  # API endpoint для обновления стилей (PUT)
├── components/
│   └── typography/
│       ├── index.ts                          # Barrel export
│       ├── TypographyTable.tsx               # Таблица со списком всех стилей
│       ├── TypographyEditForm.tsx            # Форма редактирования с live preview
│       └── TypographyPreview.tsx             # Компонент предпросмотра стиля
├── types/
│   └── typography.ts                         # TypeScript типы и константы
└── docs/
    └── TYPOGRAPHY_CRUD.md                    # Этот файл
```

## Созданные файлы

### 1. **types/typography.ts**
**Назначение:** TypeScript типы и константы для работы с typography_styles

**Основные типы:**
- `TypographyStyle` - полная структура стиля из БД
- `TypographyFormData` - данные формы (без readonly полей)
- Типы для единиц измерения: `FontSizeUnit`, `LineHeightUnit`, etc.
- Константы для селектов: `FONT_WEIGHT_OPTIONS`, `TEXT_TRANSFORM_OPTIONS`, etc.

### 2. **components/typography/TypographyPreview.tsx**
**Назначение:** Компонент для live preview типографского стиля

**Особенности:**
- Принимает `TypographyStyle` или `TypographyFormData`
- Отображает пример текста с применёнными стилями
- Показывает все CSS свойства в читаемом виде
- Используется в таблице и в форме редактирования

### 3. **components/typography/TypographyEditForm.tsx**
**Назначение:** Client Component форма для редактирования стиля

**Функционал:**
- Все поля для редактирования typography параметров
- Live preview в реальном времени при изменении значений
- Модальное окно с overlay
- Обработка ошибок и success состояний
- Автоматическое закрытие после успешного сохранения
- Color picker + text input для цвета
- Select'ы с предопределёнными значениями

**Поля формы:**
- font_size + font_size_unit (px, rem, em)
- font_weight (100-900)
- color (text input + color picker)
- line_height + line_height_unit (px, rem, unitless)
- letter_spacing + letter_spacing_unit (px, rem, em)
- text_transform (none, uppercase, lowercase, capitalize)
- font_style (normal, italic, oblique)
- border_radius + border_radius_unit (px, rem, %)

### 4. **components/typography/TypographyTable.tsx**
**Назначение:** Client Component таблица со списком всех стилей

**Функционал:**
- Отображение всех typography стилей в виде таблицы
- Preview каждого стиля прямо в таблице
- Кнопка "Редактировать" для каждого стиля
- Управление состоянием модального окна редактирования
- Color preview с квадратиком цвета

**Колонки таблицы:**
- Класс (class_name)
- Размер (font_size + unit)
- Вес (font_weight)
- Цвет (color с preview)
- Высота строки (line_height + unit)
- Предпросмотр (живой пример текста)
- Действия (кнопка редактирования)

### 5. **components/typography/index.ts**
**Назначение:** Barrel export для удобного импорта

```typescript
export { TypographyTable } from './TypographyTable';
export { TypographyEditForm } from './TypographyEditForm';
export { TypographyPreview } from './TypographyPreview';
```

### 6. **app/(dashboard)/typography/page.tsx**
**Назначение:** Server Component главная страница

**Функционал:**
- Загрузка всех стилей из Supabase при SSR
- Обработка ошибок загрузки
- Информационная панель с инструкциями
- Техническая информация о подключении
- Интеграция TypographyTable компонента

### 7. **app/api/typography/[id]/route.ts**
**Назначение:** API Route для обновления стиля

**Endpoint:** `PUT /api/typography/:id`

**Функционал:**
- Проверка авторизации пользователя
- Валидация входных данных
- Обновление записи в Supabase
- Обработка ошибок
- Возврат обновлённых данных

**Request Body (TypographyFormData):**
```json
{
  "font_size": 16,
  "font_size_unit": "px",
  "font_weight": 400,
  "color": "#000000",
  "line_height": 1.5,
  "line_height_unit": "unitless",
  "letter_spacing": 0,
  "letter_spacing_unit": "px",
  "text_transform": "none",
  "font_style": "normal",
  "border_radius": 0,
  "border_radius_unit": "px"
}
```

## Технические детали

### Используемые технологии
- **Next.js 16** (App Router)
- **React 19.2** (Server & Client Components)
- **TypeScript 5**
- **Supabase** (Database + Auth)
- **Tailwind CSS 4** (стилизация)

### Архитектурные решения

1. **Server Components по умолчанию:**
   - Главная страница typography - Server Component
   - Загрузка данных происходит на сервере
   - Меньший bundle size на клиенте

2. **Client Components где необходимо:**
   - TypographyTable (управление состоянием модального окна)
   - TypographyEditForm (интерактивная форма, live preview)
   - Используется директива 'use client'

3. **API Routes для мутаций:**
   - PUT запросы через API routes
   - Централизованная авторизация
   - Proper error handling

4. **Type Safety:**
   - Строгая типизация всех данных
   - TypeScript типы совпадают со структурой БД
   - Константы для dropdown значений

### Supabase Schema

Таблица `typography_styles`:
```sql
CREATE TABLE typography_styles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_name TEXT NOT NULL UNIQUE,
  font_size NUMERIC NOT NULL,
  font_size_unit TEXT NOT NULL,
  font_weight INTEGER NOT NULL,
  color TEXT NOT NULL,
  line_height NUMERIC NOT NULL,
  line_height_unit TEXT NOT NULL,
  letter_spacing NUMERIC NOT NULL,
  letter_spacing_unit TEXT NOT NULL,
  text_transform TEXT NOT NULL,
  font_style TEXT NOT NULL,
  border_radius NUMERIC NOT NULL,
  border_radius_unit TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Ожидаемые классы (9 штук)

1. `.title-h1` - Главный заголовок
2. `.subtitle-s` - Подзаголовок
3. `.body-b` - Основной текст
4. `.body-s` - Малый основной текст
5. `.paragraph-p` - Параграф
6. `.input-i` - Текст в input полях
7. `.button-text-bt` - Текст на кнопках
8. `.caption-c` - Подпись
9. `.label-l` - Label текст

## Как использовать

### Для пользователя админ-панели:

1. Перейдите на страницу `/dashboard/typography`
2. Найдите нужный стиль в таблице
3. Нажмите кнопку "Редактировать"
4. Измените нужные параметры
5. Наблюдайте изменения в live preview
6. Нажмите "Сохранить"
7. Изменения применятся на сайте

### Для разработчика:

**Добавление нового поля:**
1. Обновите тип `TypographyStyle` в `types/typography.ts`
2. Добавьте поле в форму в `TypographyEditForm.tsx`
3. Обновите preview в `TypographyPreview.tsx`
4. Добавьте колонку в `TypographyTable.tsx` (опционально)
5. Обновите API route `app/api/typography/[id]/route.ts`

**Импорт компонентов:**
```typescript
import { TypographyTable, TypographyEditForm, TypographyPreview } from '@/components/typography';
```

**Импорт типов:**
```typescript
import { TypographyStyle, TypographyFormData } from '@/types/typography';
```

## Безопасность

- Все API routes проверяют авторизацию через Supabase Auth
- Только авторизованные пользователи могут редактировать стили
- Валидация данных на сервере
- TypeScript гарантирует type safety

## Производительность

- Server-side rendering главной страницы
- Minimal JavaScript на клиенте
- Только необходимые компоненты используют 'use client'
- Автоматический code splitting Next.js

## Возможные улучшения

1. **Bulk operations** - Массовое редактирование нескольких стилей
2. **История изменений** - Отслеживание кто и когда менял стили
3. **Reset to default** - Сброс к дефолтным значениям
4. **Export/Import** - Экспорт и импорт стилей в JSON
5. **Preview на реальных примерах** - Показывать примеры из реального контента сайта
6. **Поиск и фильтрация** - Для большого количества стилей
7. **Version control** - Откат к предыдущим версиям

## Тестирование

Build прошёл успешно без ошибок TypeScript:
```bash
npm run build
✓ Compiled successfully
✓ Generating static pages
```

## Поддержка

Для вопросов и багов обращайтесь к документации Next.js и Supabase:
- [Next.js 16 Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

**Дата создания:** 2025-11-03
**Версия:** 1.0.0
**Задача:** MN-108

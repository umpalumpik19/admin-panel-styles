/**
 * TypeScript типы для работы с css_variables из Supabase
 */

// Категории CSS переменных
export type VariableCategory = 'colors' | 'sizes' | 'animations' | 'fonts' | 'buttons';

/**
 * Основной тип для CSS переменной из БД
 */
export interface CSSVariable {
  id: string;
  variable_name: string; // Имя без префикса --, например: 'primary-color'
  variable_value: string; // Значение переменной, например: '#FF5733'
  category: VariableCategory;
  description?: string | null; // Опциональное описание
  created_at?: string;
  updated_at?: string;
}

/**
 * Тип для формы редактирования (без readonly полей)
 */
export interface VariableFormData {
  variable_value: string;
  description?: string | null;
}

/**
 * Константы для категорий
 */
export const VARIABLE_CATEGORIES: VariableCategory[] = ['colors', 'sizes', 'animations', 'fonts', 'buttons'];

/**
 * Названия категорий на русском для UI
 */
export const CATEGORY_LABELS: Record<VariableCategory, string> = {
  colors: 'Цвета',
  sizes: 'Размеры',
  animations: 'Анимации',
  fonts: 'Шрифты',
  buttons: 'Кнопки',
};

/**
 * Иконки для категорий (emoji)
 */
export const CATEGORY_ICONS: Record<VariableCategory, string> = {
  colors: '🎨',
  sizes: '📏',
  animations: '⚡',
  fonts: '🔤',
  buttons: '🔘',
};

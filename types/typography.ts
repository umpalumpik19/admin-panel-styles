/**
 * TypeScript типы для работы с typography_styles из Supabase
 */

// Возможные единицы измерения
export type FontSizeUnit = 'px' | 'rem' | 'em';
export type LineHeightUnit = 'px' | 'rem' | 'unitless';
export type LetterSpacingUnit = 'px' | 'rem' | 'em';
export type BorderRadiusUnit = 'px' | 'rem' | '%';

// Возможные значения text-transform
export type TextTransform = 'none' | 'uppercase' | 'lowercase' | 'capitalize';

// Возможные значения font-style
export type FontStyle = 'normal' | 'italic' | 'oblique';

// Возможные значения font-weight
export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

/**
 * Основной тип для typography стиля из БД
 */
export interface TypographyStyle {
  id: string;
  class_name: string;
  font_size: number;
  font_size_unit: FontSizeUnit;
  font_weight: FontWeight;
  color: string;
  line_height: number;
  line_height_unit: LineHeightUnit;
  letter_spacing: number;
  letter_spacing_unit: LetterSpacingUnit;
  text_transform: TextTransform;
  font_style: FontStyle;
  border_radius: number;
  border_radius_unit: BorderRadiusUnit;
  created_at?: string;
  updated_at?: string;
}

/**
 * Тип для формы редактирования (без readonly полей)
 */
export interface TypographyFormData {
  font_size: number;
  font_size_unit: FontSizeUnit;
  font_weight: FontWeight;
  color: string;
  line_height: number;
  line_height_unit: LineHeightUnit;
  letter_spacing: number;
  letter_spacing_unit: LetterSpacingUnit;
  text_transform: TextTransform;
  font_style: FontStyle;
  border_radius: number;
  border_radius_unit: BorderRadiusUnit;
}

/**
 * Константы для селектов
 */
export const FONT_SIZE_UNITS: FontSizeUnit[] = ['px', 'rem', 'em'];
export const LINE_HEIGHT_UNITS: LineHeightUnit[] = ['px', 'rem', 'unitless'];
export const LETTER_SPACING_UNITS: LetterSpacingUnit[] = ['px', 'rem', 'em'];
export const BORDER_RADIUS_UNITS: BorderRadiusUnit[] = ['px', 'rem', '%'];
export const TEXT_TRANSFORM_OPTIONS: TextTransform[] = ['none', 'uppercase', 'lowercase', 'capitalize'];
export const FONT_STYLE_OPTIONS: FontStyle[] = ['normal', 'italic', 'oblique'];
export const FONT_WEIGHT_OPTIONS: FontWeight[] = [100, 200, 300, 400, 500, 600, 700, 800, 900];

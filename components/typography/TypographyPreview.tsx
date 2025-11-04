import { TypographyStyle, TypographyFormData } from '@/types/typography';

interface TypographyPreviewProps {
  style: TypographyStyle | TypographyFormData;
  className?: string;
}

/**
 * Компонент для preview типографского стиля в реальном времени
 * Показывает как выглядит текст с применёнными шрифтовыми стилями
 */
export function TypographyPreview({ style, className }: TypographyPreviewProps) {
  // Формируем CSS стили из объекта (только шрифтовые свойства)
  const previewStyles: React.CSSProperties = {
    fontFamily: style.font_family,
    fontSize: `${style.font_size}${style.font_size_unit}`,
    fontWeight: style.font_weight,
    fontStyle: style.font_style,
    lineHeight: style.line_height_unit === 'unitless'
      ? style.line_height
      : `${style.line_height}${style.line_height_unit}`,
    letterSpacing: `${style.letter_spacing}${style.letter_spacing_unit}`,
    textTransform: style.text_transform,
  };

  return (
    <div className={`bg-gray-50 p-6 rounded-lg border border-gray-200 ${className || ''}`}>
      <div className="mb-2 text-sm font-medium text-gray-700">
        Предпросмотр стиля:
      </div>
      <div style={previewStyles} className="bg-white p-4 rounded">
        Пример текста с применёнными стилями
      </div>
      <div className="mt-3 text-xs text-gray-500 font-mono">
        <div className="grid grid-cols-2 gap-2">
          <div>font-family: {style.font_family}</div>
          <div>font-size: {style.font_size}{style.font_size_unit}</div>
          <div>font-weight: {style.font_weight}</div>
          <div>font-style: {style.font_style}</div>
          <div>line-height: {style.line_height}{style.line_height_unit === 'unitless' ? '' : style.line_height_unit}</div>
          <div>letter-spacing: {style.letter_spacing}{style.letter_spacing_unit}</div>
          <div className="col-span-2">text-transform: {style.text_transform}</div>
        </div>
      </div>
    </div>
  );
}

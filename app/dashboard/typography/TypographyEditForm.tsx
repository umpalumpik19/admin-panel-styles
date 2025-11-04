'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TypographyStyle, TypographyFormData, FONT_SIZE_UNITS, LINE_HEIGHT_UNITS, LETTER_SPACING_UNITS, TEXT_TRANSFORM_OPTIONS, FONT_STYLE_OPTIONS, FONT_WEIGHT_OPTIONS, FONT_FAMILY_OPTIONS } from '@/types/typography';
import { TypographyPreview } from '@/components/typography/TypographyPreview';

interface TypographyEditFormProps {
  style: TypographyStyle;
  onCancel: () => void;
}

/**
 * Форма редактирования typography стиля
 * Включает все поля для редактирования + live preview
 */
export function TypographyEditForm({ style, onCancel }: TypographyEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Состояние формы с live preview (только шрифтовые свойства)
  const [formData, setFormData] = useState<TypographyFormData>({
    font_family: style.font_family,
    font_size: style.font_size,
    font_size_unit: style.font_size_unit,
    font_weight: style.font_weight,
    font_style: style.font_style,
    line_height: style.line_height,
    line_height_unit: style.line_height_unit,
    letter_spacing: style.letter_spacing,
    letter_spacing_unit: style.letter_spacing_unit,
    text_transform: style.text_transform,
  });

  // Обработчик изменений полей
  const handleChange = (field: keyof TypographyFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch(`/api/typography/${style.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Ошибка при сохранении');
      }

      setSuccess(true);
      router.refresh();

      // Автоматически закрываем форму через 1.5 секунды после успеха
      setTimeout(() => {
        onCancel();
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        {/* Заголовок */}
        <div className="mb-6 pb-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Редактирование стиля: <code className="text-indigo-600">{style.class_name}</code>
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Изменяйте значения и наблюдайте результат в реальном времени
          </p>
        </div>

        {/* Сообщения об ошибках и успехе */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">Стиль успешно сохранён!</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Левая колонка - форма */}
            <div className="space-y-4">
              {/* Font Family */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Семейство шрифтов
                </label>
                <select
                  value={formData.font_family}
                  onChange={(e) => handleChange('font_family', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {FONT_FAMILY_OPTIONS.map(family => (
                    <option key={family} value={family} style={{ fontFamily: family }}>
                      {family}
                    </option>
                  ))}
                </select>
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Размер шрифта
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.01"
                    value={formData.font_size}
                    onChange={(e) => handleChange('font_size', parseFloat(e.target.value))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <select
                    value={formData.font_size_unit}
                    onChange={(e) => handleChange('font_size_unit', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {FONT_SIZE_UNITS.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Font Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Толщина шрифта
                </label>
                <select
                  value={formData.font_weight}
                  onChange={(e) => handleChange('font_weight', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {FONT_WEIGHT_OPTIONS.map(weight => (
                    <option key={weight} value={weight}>{weight}</option>
                  ))}
                </select>
              </div>

              {/* Line Height */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Высота строки
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.01"
                    value={formData.line_height}
                    onChange={(e) => handleChange('line_height', parseFloat(e.target.value))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <select
                    value={formData.line_height_unit}
                    onChange={(e) => handleChange('line_height_unit', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {LINE_HEIGHT_UNITS.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Letter Spacing */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Межбуквенный интервал
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.01"
                    value={formData.letter_spacing}
                    onChange={(e) => handleChange('letter_spacing', parseFloat(e.target.value))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <select
                    value={formData.letter_spacing_unit}
                    onChange={(e) => handleChange('letter_spacing_unit', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {LETTER_SPACING_UNITS.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Text Transform */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Преобразование текста
                </label>
                <select
                  value={formData.text_transform}
                  onChange={(e) => handleChange('text_transform', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {TEXT_TRANSFORM_OPTIONS.map(transform => (
                    <option key={transform} value={transform}>{transform}</option>
                  ))}
                </select>
              </div>

              {/* Font Style */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Стиль шрифта
                </label>
                <select
                  value={formData.font_style}
                  onChange={(e) => handleChange('font_style', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {FONT_STYLE_OPTIONS.map(styleOption => (
                    <option key={styleOption} value={styleOption}>{styleOption}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Правая колонка - preview */}
            <div className="lg:sticky lg:top-4 h-fit">
              <TypographyPreview style={formData} />
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="mt-6 pt-4 border-t flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Сохранение...' : success ? 'Сохранено!' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

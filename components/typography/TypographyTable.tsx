'use client';

import { useState } from 'react';
import { TypographyStyle } from '@/types/typography';
import { TypographyEditForm } from './TypographyEditForm';

interface TypographyTableProps {
  styles: TypographyStyle[];
}

/**
 * Таблица со списком всех typography стилей
 * Отображает основную информацию и кнопку редактирования
 */
export function TypographyTable({ styles }: TypographyTableProps) {
  const [editingStyle, setEditingStyle] = useState<TypographyStyle | null>(null);

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Класс
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Размер
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Вес
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Цвет
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Высота строки
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Предпросмотр
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {styles.map((style) => {
                // Формируем inline стиль для preview
                const previewStyle: React.CSSProperties = {
                  fontSize: `${style.font_size}${style.font_size_unit}`,
                  fontWeight: style.font_weight,
                  color: style.color,
                  lineHeight: style.line_height_unit === 'unitless'
                    ? style.line_height
                    : `${style.line_height}${style.line_height_unit}`,
                };

                return (
                  <tr key={style.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-sm font-mono text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                        {style.class_name}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {style.font_size}{style.font_size_unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {style.font_weight}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border border-gray-300"
                          style={{ backgroundColor: style.color }}
                          title={style.color}
                        />
                        <span className="text-sm text-gray-900 font-mono">{style.color}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {style.line_height}{style.line_height_unit === 'unitless' ? '' : style.line_height_unit}
                    </td>
                    <td className="px-6 py-4">
                      <div style={previewStyle}>
                        Пример текста
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setEditingStyle(style)}
                        className="text-indigo-600 hover:text-indigo-900 font-medium"
                      >
                        Редактировать
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Если нет стилей */}
        {styles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">
              Стили не найдены. Проверьте подключение к базе данных.
            </p>
          </div>
        )}
      </div>

      {/* Модальное окно редактирования */}
      {editingStyle && (
        <TypographyEditForm
          style={editingStyle}
          onCancel={() => setEditingStyle(null)}
        />
      )}
    </>
  );
}

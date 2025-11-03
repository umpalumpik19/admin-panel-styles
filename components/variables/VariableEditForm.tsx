'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CSSVariable, VariableFormData } from '@/types/variables';
import { VariablePreview } from './VariablePreview';

interface VariableEditFormProps {
  variable: CSSVariable;
  onCancel: () => void;
}

/**
 * Форма редактирования CSS переменной
 * Для категории 'colors' показывает color picker
 * Включает live preview изменений
 */
export function VariableEditForm({ variable, onCancel }: VariableEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Состояние формы
  const [formData, setFormData] = useState<VariableFormData>({
    variable_value: variable.variable_value,
    description: variable.description || '',
  });

  // Для live preview создаем временную переменную
  const previewVariable: CSSVariable = {
    ...variable,
    variable_value: formData.variable_value,
    description: formData.description,
  };

  // Обработчик изменений полей
  const handleChange = (field: keyof VariableFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch(`/api/variables/${variable.id}`, {
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
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        {/* Заголовок */}
        <div className="mb-6 pb-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Редактирование переменной: <code className="text-indigo-600">--{variable.variable_name}</code>
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Категория: {variable.category}
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
            <p className="text-sm text-green-800">Переменная успешно сохранена!</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Имя переменной (readonly) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Имя переменной
              </label>
              <input
                type="text"
                value={`--${variable.variable_name}`}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 font-mono cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">
                Имя переменной нельзя изменить
              </p>
            </div>

            {/* Категория (readonly) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Категория
              </label>
              <input
                type="text"
                value={variable.category}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed capitalize"
              />
            </div>

            {/* Значение переменной */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Значение переменной *
              </label>
              {variable.category === 'colors' ? (
                // Для цветов показываем text input + color picker
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.variable_value}
                    onChange={(e) => handleChange('variable_value', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    placeholder="#FF5733 или rgb(255, 87, 51)"
                    required
                  />
                  <input
                    type="color"
                    value={formData.variable_value.startsWith('#') ? formData.variable_value : '#000000'}
                    onChange={(e) => handleChange('variable_value', e.target.value)}
                    className="w-16 h-10 border border-gray-300 rounded-md cursor-pointer"
                  />
                </div>
              ) : (
                // Для остальных категорий обычный text input
                <input
                  type="text"
                  value={formData.variable_value}
                  onChange={(e) => handleChange('variable_value', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  placeholder="Введите значение"
                  required
                />
              )}
            </div>

            {/* Описание */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Описание
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Опциональное описание для переменной"
              />
            </div>

            {/* Preview */}
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Предпросмотр</h4>
              <VariablePreview variable={previewVariable} />
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

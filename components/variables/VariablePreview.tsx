'use client';

import { CSSVariable } from '@/types/variables';

interface VariablePreviewProps {
  variable: CSSVariable;
}

/**
 * Компонент preview для CSS переменной
 * Для категории 'colors' показывает цветной квадратик
 * Для остальных категорий показывает текстовое значение
 */
export function VariablePreview({ variable }: VariablePreviewProps) {
  // Для цветов показываем color preview
  if (variable.category === 'colors') {
    return (
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded border border-gray-300 shadow-sm"
          style={{ backgroundColor: variable.variable_value }}
          title={variable.variable_value}
        />
        <span className="text-sm text-gray-900 font-mono">{variable.variable_value}</span>
      </div>
    );
  }

  // Для остальных категорий просто текст
  return (
    <span className="text-sm text-gray-900 font-mono">
      {variable.variable_value}
    </span>
  );
}

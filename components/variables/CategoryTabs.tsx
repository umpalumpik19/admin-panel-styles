'use client';

import { VariableCategory, VARIABLE_CATEGORIES, CATEGORY_LABELS, CATEGORY_ICONS } from '@/types/variables';
import { CSSVariable } from '@/types/variables';

interface CategoryTabsProps {
  selectedCategory: VariableCategory | 'all';
  onCategoryChange: (category: VariableCategory | 'all') => void;
  variables: CSSVariable[];
}

/**
 * Компонент табов для фильтрации по категориям
 * Показывает количество переменных в каждой категории
 */
export function CategoryTabs({ selectedCategory, onCategoryChange, variables }: CategoryTabsProps) {
  // Подсчитываем количество переменных в каждой категории
  const getCategoryCount = (category: VariableCategory | 'all') => {
    if (category === 'all') {
      return variables.length;
    }
    return variables.filter(v => v.category === category).length;
  };

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
        {/* Tab "Все" */}
        <button
          onClick={() => onCategoryChange('all')}
          className={`
            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
            ${selectedCategory === 'all'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }
          `}
        >
          <span className="mr-2">📦</span>
          Все
          <span className="ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium bg-gray-100 text-gray-900">
            {getCategoryCount('all')}
          </span>
        </button>

        {/* Табы для каждой категории */}
        {VARIABLE_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${selectedCategory === category
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <span className="mr-2">{CATEGORY_ICONS[category]}</span>
            {CATEGORY_LABELS[category]}
            <span className={`
              ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium
              ${selectedCategory === category
                ? 'bg-indigo-100 text-indigo-600'
                : 'bg-gray-100 text-gray-900'
              }
            `}>
              {getCategoryCount(category)}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}

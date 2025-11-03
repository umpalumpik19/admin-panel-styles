'use client';

import { useState, useMemo } from 'react';
import { CSSVariable, VariableCategory, CATEGORY_LABELS } from '@/types/variables';
import { VariableEditForm } from './VariableEditForm';
import { VariablePreview } from './VariablePreview';
import { CategoryTabs } from './CategoryTabs';

interface VariablesTableProps {
  variables: CSSVariable[];
}

/**
 * Таблица со списком всех CSS переменных
 * Поддерживает фильтрацию по категориям и поиск
 */
export function VariablesTable({ variables }: VariablesTableProps) {
  const [editingVariable, setEditingVariable] = useState<CSSVariable | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<VariableCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Фильтрация переменных
  const filteredVariables = useMemo(() => {
    let filtered = variables;

    // Фильтр по категории
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(v => v.category === selectedCategory);
    }

    // Фильтр по поисковому запросу
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(v =>
        v.variable_name.toLowerCase().includes(query) ||
        v.variable_value.toLowerCase().includes(query) ||
        (v.description && v.description.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [variables, selectedCategory, searchQuery]);

  return (
    <>
      {/* Табы категорий */}
      <CategoryTabs
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        variables={variables}
      />

      {/* Поиск */}
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Поиск по имени, значению или описанию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Таблица */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Переменная
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Категория
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Значение
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Описание
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVariables.map((variable) => (
                <tr key={variable.id} className="hover:bg-gray-50">
                  {/* Имя переменной */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <code className="text-sm font-mono text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                      --{variable.variable_name}
                    </code>
                  </td>

                  {/* Категория */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                      {CATEGORY_LABELS[variable.category]}
                    </span>
                  </td>

                  {/* Значение с preview */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <VariablePreview variable={variable} />
                  </td>

                  {/* Описание */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate" title={variable.description || ''}>
                      {variable.description || <span className="text-gray-400 italic">Нет описания</span>}
                    </div>
                  </td>

                  {/* Действия */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setEditingVariable(variable)}
                      className="text-indigo-600 hover:text-indigo-900 font-medium"
                    >
                      Редактировать
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Если ничего не найдено */}
        {filteredVariables.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Ничего не найдено</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? 'Попробуйте изменить поисковый запрос' : 'Нет переменных в этой категории'}
            </p>
          </div>
        )}
      </div>

      {/* Модальное окно редактирования */}
      {editingVariable && (
        <VariableEditForm
          variable={editingVariable}
          onCancel={() => setEditingVariable(null)}
        />
      )}
    </>
  );
}

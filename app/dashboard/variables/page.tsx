import { createServerSupabaseClient } from '@/lib/supabase/server';
import { CSSVariable } from '@/types/variables';
import { VariablesTable } from '@/components/variables/VariablesTable';

/**
 * Страница управления CSS переменными
 * Загружает все css_variables из Supabase и отображает в таблице
 * Поддерживает редактирование, фильтрацию по категориям и поиск
 */
export default async function VariablesPage() {
  const supabase = await createServerSupabaseClient();

  // Загружаем все CSS переменные из БД
  const { data: variables, error } = await supabase
    .from('css_variables')
    .select('*')
    .order('category', { ascending: true })
    .order('variable_name', { ascending: true });

  if (error) {
    console.error('Error loading CSS variables:', error);
  }

  const cssVariables: CSSVariable[] = variables || [];

  // Подсчет переменных по категориям для статистики
  const stats = cssVariables.reduce((acc, variable) => {
    acc[variable.category] = (acc[variable.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="px-4 sm:px-0">
      {/* Заголовок страницы */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Управление переменными</h2>
        <p className="text-gray-500 mt-1">
          Редактирование CSS переменных сайта. Всего переменных: {cssVariables.length}
        </p>
      </div>

      {/* Сообщение об ошибке загрузки */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-sm font-medium text-red-800">
            Ошибка загрузки данных
          </h3>
          <p className="text-sm text-red-700 mt-1">
            {error.message}
          </p>
        </div>
      )}

      {/* Статистика по категориям */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {Object.entries(stats).map(([category, count]) => (
          <div key={category} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl">
                    {category === 'colors' && '🎨'}
                    {category === 'sizes' && '📏'}
                    {category === 'animations' && '⚡'}
                    {category === 'fonts' && '🔤'}
                    {category === 'buttons' && '🔘'}
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate capitalize">
                      {category === 'colors' && 'Цвета'}
                      {category === 'sizes' && 'Размеры'}
                      {category === 'animations' && 'Анимации'}
                      {category === 'fonts' && 'Шрифты'}
                      {category === 'buttons' && 'Кнопки'}
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      {count}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Информационная панель */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-blue-800">
              Как использовать
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Используйте табы для фильтрации по категориям</li>
                <li>Нажмите "Редактировать" чтобы изменить значение переменной</li>
                <li>Для цветов доступен color picker для удобного выбора</li>
                <li>Все изменения сразу применяются на сайте после сохранения</li>
                <li>Имя переменной и категорию изменить нельзя</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Таблица с переменными */}
      {cssVariables.length > 0 ? (
        <VariablesTable variables={cssVariables} />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Переменные не найдены
          </h3>
          <p className="text-gray-500">
            Проверьте подключение к базе данных Supabase и наличие данных в таблице{' '}
            <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">css_variables</code>
          </p>
        </div>
      )}

      {/* Техническая информация */}
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Техническая информация
        </h3>
        <div className="text-xs text-gray-600 space-y-1 font-mono">
          <div>Таблица: css_variables</div>
          <div>Supabase Project: xuatcmcuqhgwmgwifxzd</div>
          <div>Всего переменных загружено: {cssVariables.length}</div>
          <div>Ожидаемых переменных: 49</div>
          <div>Категории: colors ({stats.colors || 0}), sizes ({stats.sizes || 0}), animations ({stats.animations || 0}), fonts ({stats.fonts || 0}), buttons ({stats.buttons || 0})</div>
        </div>
      </div>
    </div>
  );
}

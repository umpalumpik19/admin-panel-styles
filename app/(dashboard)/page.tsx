import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * Главная страница Dashboard
 * Отображает статистику и приветствие
 */
export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();

  // Получаем статистику из таблицы typography_styles
  const { count: typographyCount } = await supabase
    .from('typography_styles')
    .select('*', { count: 'exact', head: true });

  return (
    <div className="space-y-6 px-4 sm:px-0">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Панель управления</h2>
        <p className="text-gray-500 mt-1">
          Добро пожаловать, {user?.email}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">
            Классы типографики
          </h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{typographyCount || 0}</p>
          <p className="mt-1 text-sm text-gray-500">
            Tailwind классы шрифтов из globals.css
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">
            Статус системы
          </h3>
          <p className="mt-2 text-3xl font-bold text-green-600">✓</p>
          <p className="mt-1 text-sm text-gray-500">
            Все системы работают
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">
          Информация
        </h3>
        <p className="text-sm text-blue-700">
          Эта админ-панель позволяет управлять Tailwind классами шрифтов для сайта Natura Matrace.
          Используйте раздел "Типографика" для редактирования стилей текста.
        </p>
      </div>
    </div>
  );
}

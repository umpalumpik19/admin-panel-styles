import { createServerSupabaseClient } from '@/lib/supabase/server';
import { TypographyStyle } from '@/types/typography';
import { TypographyTable } from '@/components/typography/TypographyTable';

/**
 * Страница управления типографикой
 * Загружает все typography_styles из Supabase и отображает в таблице
 * Поддерживает редактирование через модальное окно
 */
export default async function TypographyPage() {
  const supabase = await createServerSupabaseClient();

  // Загружаем все typography стили из БД
  const { data: styles, error } = await supabase
    .from('typography_styles')
    .select('*')
    .order('class_name', { ascending: true });

  if (error) {
    console.error('Error loading typography styles:', error);
  }

  const typographyStyles: TypographyStyle[] = styles || [];

  return (
    <div className="px-4 sm:px-0">
      {/* Заголовок страницы */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Управление типографикой</h2>
        <p className="text-gray-500 mt-1">
          Редактирование Tailwind классов для текста. Всего классов: {typographyStyles.length}
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
                <li>Нажмите "Редактировать" чтобы изменить стиль</li>
                <li>Все изменения отображаются в реальном времени в preview</li>
                <li>После сохранения изменения применятся на сайте</li>
                <li>class_name является идентификатором и не может быть изменён</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Таблица со стилями */}
      {typographyStyles.length > 0 ? (
        <TypographyTable styles={typographyStyles} />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Стили не найдены
          </h3>
          <p className="text-gray-500">
            Проверьте подключение к базе данных Supabase и наличие данных в таблице{' '}
            <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">typography_styles</code>
          </p>
        </div>
      )}

      {/* Техническая информация */}
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Техническая информация
        </h3>
        <div className="text-xs text-gray-600 space-y-1 font-mono">
          <div>Таблица: typography_styles</div>
          <div>Supabase Project: xuatcmcuqhgwmgwifxzd</div>
          <div>Всего стилей загружено: {typographyStyles.length}</div>
          <div>Ожидаемых классов: 9 (.title-h1, .subtitle-s, .body-b, .body-s, .paragraph-p, .input-i, .button-text-bt, .caption-c, .label-l)</div>
        </div>
      </div>
    </div>
  );
}

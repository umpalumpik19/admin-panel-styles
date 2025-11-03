import { createClient } from '@supabase/supabase-js';

/**
 * Создает клиент Supabase с правами администратора (Service Role)
 * ВАЖНО: Использовать ТОЛЬКО на сервере (API routes, Server Components)
 * Никогда не передавать этот клиент на клиентскую сторону!
 *
 * @returns Клиент Supabase с административными правами
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      'Отсутствуют необходимые переменные окружения для Supabase Admin: ' +
      'NEXT_PUBLIC_SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY'
    );
  }

  // Создаём клиент с Service Role Key для административных операций
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

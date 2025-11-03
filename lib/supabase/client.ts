import { createBrowserClient } from '@supabase/ssr';

/**
 * Создает клиент Supabase для использования в Client Components
 * @returns Клиент Supabase для браузера
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

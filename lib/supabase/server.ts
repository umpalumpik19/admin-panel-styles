import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Создает клиент Supabase для использования в Server Components
 * Правильно обрабатывает cookies для SSR
 * @returns Асинхронный клиент Supabase для сервера
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Может быть вызван из Server Component
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Может быть вызван из Server Component
          }
        },
      },
    }
  );
}

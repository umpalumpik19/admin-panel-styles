'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Компонент для периодической проверки валидности сессии пользователя
 * Если пользователь удален из системы, автоматически выходит из админки
 */
export function SessionValidator() {
  const router = useRouter();

  useEffect(() => {
    // Проверка валидности сессии каждые 60 секунд
    const checkSession = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();

        // Если пользователь не найден или произошла ошибка - выходим
        if (!user || error) {
          console.log('[SessionValidator] Пользователь невалиден, выход из системы');
          await supabase.auth.signOut();
          router.push('/login');
        }
      } catch (error) {
        console.error('[SessionValidator] Ошибка проверки сессии:', error);
      }
    };

    // Периодическая проверка каждые 60 секунд (БЕЗ первоначальной проверки)
    const interval = setInterval(checkSession, 60000);

    // Слушаем только событие выхода
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        console.log('[SessionValidator] Пользователь вышел из системы');
        router.push('/login');
      }
    });

    return () => {
      clearInterval(interval);
      subscription.unsubscribe();
    };
  }, [router]);

  // Компонент не рендерит ничего в DOM
  return null;
}

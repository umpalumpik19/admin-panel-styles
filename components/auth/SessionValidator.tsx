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
    // Проверка валидности сессии каждые 30 секунд
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
        // При критической ошибке - выходим для безопасности
        await supabase.auth.signOut();
        router.push('/login');
      }
    };

    // Первоначальная проверка
    checkSession();

    // Периодическая проверка каждые 30 секунд
    const interval = setInterval(checkSession, 30000);

    // Также слушаем события auth state change от Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' && !session) {
        console.log('[SessionValidator] Auth state change:', event);
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

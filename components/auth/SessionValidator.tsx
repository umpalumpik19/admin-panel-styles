'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Компонент для проверки валидности сессии пользователя
 * Если пользователь удален из системы, автоматически выходит из админки
 *
 * ВРЕМЕННО ОТКЛЮЧЕН - использует только auth state change listener
 */
export function SessionValidator() {
  const router = useRouter();

  useEffect(() => {
    console.log('[SessionValidator] Компонент инициализирован');

    // Слушаем только событие выхода (без периодических проверок)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[SessionValidator] Auth event:', event, 'Session exists:', !!session);

      if (event === 'SIGNED_OUT') {
        console.log('[SessionValidator] Пользователь вышел из системы, редирект на /login');
        router.push('/login');
      }
    });

    return () => {
      console.log('[SessionValidator] Компонент размонтирован');
      subscription.unsubscribe();
    };
  }, [router]);

  // Компонент не рендерит ничего в DOM
  return null;
}

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

/**
 * API route для создания тестового администратора
 * Использует service role ключ для создания пользователя
 */
export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Missing Supabase configuration' },
        { status: 500 }
      );
    }

    // Создаем клиент с service role ключом
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Создаем тестового пользователя
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'admin@test.com',
      password: 'TestAdmin123!',
      email_confirm: true,
    });

    if (error) {
      // Проверяем, не существует ли уже пользователь
      if (error.message.includes('already registered')) {
        return NextResponse.json({
          success: true,
          message: 'Пользователь уже существует',
          email: 'admin@test.com',
        });
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Тестовый пользователь создан',
      email: 'admin@test.com',
      userId: data.user.id,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { CreateUserPayload, UsersListResponse, CreateUserResponse } from '@/types/users';

/**
 * GET /api/users - Получение списка всех администраторов
 * Требует авторизации
 */
export async function GET(request: NextRequest) {
  try {
    // Проверка авторизации текущего пользователя
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Необходима авторизация' },
        { status: 401 }
      );
    }

    // Получение списка пользователей через Admin API
    const adminClient = createAdminClient();
    const { data, error } = await adminClient.auth.admin.listUsers({
      page: 1,
      perPage: 1000, // Получаем всех пользователей (можно добавить пагинацию позже)
    });

    if (error) {
      console.error('Ошибка получения списка пользователей:', error);
      return NextResponse.json(
        { success: false, error: 'Ошибка при получении списка пользователей' },
        { status: 500 }
      );
    }

    const response: UsersListResponse = {
      success: true,
      users: data.users.map(u => ({
        id: u.id,
        email: u.email || '',
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at,
        email_confirmed_at: u.email_confirmed_at,
        user_metadata: u.user_metadata,
        app_metadata: u.app_metadata,
      })),
      total: data.users.length,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Ошибка в GET /api/users:', error);
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/users - Создание нового администратора
 * Требует авторизации
 */
export async function POST(request: NextRequest) {
  try {
    // Проверка авторизации текущего пользователя
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Необходима авторизация' },
        { status: 401 }
      );
    }

    // Получение данных из запроса
    const body: CreateUserPayload = await request.json();

    // Валидация данных
    if (!body.email || !body.password) {
      return NextResponse.json(
        { success: false, error: 'Email и пароль обязательны' },
        { status: 400 }
      );
    }

    // Проверка формата email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Неверный формат email' },
        { status: 400 }
      );
    }

    // Проверка длины пароля
    if (body.password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Пароль должен содержать минимум 8 символов' },
        { status: 400 }
      );
    }

    // Создание нового пользователя через Admin API
    const adminClient = createAdminClient();
    const { data, error } = await adminClient.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: body.email_confirm ?? true, // Автоматически подтверждаем email
    });

    if (error) {
      console.error('Ошибка создания пользователя:', error);

      // Обработка специфичных ошибок
      if (error.message.includes('already registered')) {
        return NextResponse.json(
          { success: false, error: 'Пользователь с таким email уже существует' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { success: false, error: error.message || 'Ошибка при создании пользователя' },
        { status: 500 }
      );
    }

    const response: CreateUserResponse = {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email || '',
        created_at: data.user.created_at,
        last_sign_in_at: data.user.last_sign_in_at,
        email_confirmed_at: data.user.email_confirmed_at,
        user_metadata: data.user.user_metadata,
        app_metadata: data.user.app_metadata,
      },
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Ошибка в POST /api/users:', error);
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

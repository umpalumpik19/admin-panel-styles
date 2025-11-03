import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { DeleteUserResponse } from '@/types/users';

/**
 * DELETE /api/users/[id] - Удаление администратора
 * Требует авторизации
 * Защищает от удаления самого себя
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // Получаем ID из params
    const { id } = await params;

    // Проверка - нельзя удалить самого себя
    if (id === user.id) {
      return NextResponse.json(
        { success: false, error: 'Нельзя удалить свою собственную учётную запись' },
        { status: 403 }
      );
    }

    // Удаление пользователя через Admin API
    const adminClient = createAdminClient();
    const { error } = await adminClient.auth.admin.deleteUser(id);

    if (error) {
      console.error('Ошибка удаления пользователя:', error);

      // Обработка специфичных ошибок
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { success: false, error: 'Пользователь не найден' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { success: false, error: error.message || 'Ошибка при удалении пользователя' },
        { status: 500 }
      );
    }

    const response: DeleteUserResponse = {
      success: true,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Ошибка в DELETE /api/users/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

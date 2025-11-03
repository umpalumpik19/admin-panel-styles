import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { VariableFormData } from '@/types/variables';

/**
 * API Route для обновления CSS переменной
 * PUT /api/variables/[id]
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    // Проверка авторизации
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      );
    }

    // Парсинг данных из запроса
    const formData: VariableFormData = await request.json();

    // Валидация данных
    if (!formData.variable_value) {
      return NextResponse.json(
        { error: 'Значение переменной обязательно' },
        { status: 400 }
      );
    }

    // Обновление в БД
    const { data, error } = await supabase
      .from('css_variables')
      .update({
        variable_value: formData.variable_value,
        description: formData.description || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Ошибка при обновлении переменной' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message || 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

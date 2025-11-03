import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { TypographyFormData } from '@/types/typography';

/**
 * API Route для обновления typography стиля
 * PUT /api/typography/[id]
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
    const formData: TypographyFormData = await request.json();

    // Валидация данных
    if (!formData.font_size || !formData.font_weight || !formData.color) {
      return NextResponse.json(
        { error: 'Отсутствуют обязательные поля' },
        { status: 400 }
      );
    }

    // Обновление в БД
    const { data, error } = await supabase
      .from('typography_styles')
      .update({
        font_size: formData.font_size,
        font_size_unit: formData.font_size_unit,
        font_weight: formData.font_weight,
        color: formData.color,
        line_height: formData.line_height,
        line_height_unit: formData.line_height_unit,
        letter_spacing: formData.letter_spacing,
        letter_spacing_unit: formData.letter_spacing_unit,
        text_transform: formData.text_transform,
        font_style: formData.font_style,
        border_radius: formData.border_radius,
        border_radius_unit: formData.border_radius_unit,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Ошибка при обновлении стиля' },
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

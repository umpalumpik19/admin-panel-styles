/**
 * TypeScript типы для работы с пользователями (администраторами) из Supabase Auth
 */

/**
 * Основной тип для администратора из Supabase Auth
 */
export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string | null;
  email_confirmed_at?: string | null;
  // Метаданные пользователя
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
}

/**
 * Тип для формы создания нового администратора
 */
export interface CreateUserFormData {
  email: string;
  password: string;
  confirmPassword: string;
  sendInvitation?: boolean;
}

/**
 * Тип для данных создания пользователя в API
 */
export interface CreateUserPayload {
  email: string;
  password: string;
  email_confirm: boolean; // Автоматическое подтверждение email
}

/**
 * Тип для ответа API при создании пользователя
 */
export interface CreateUserResponse {
  success: boolean;
  user?: AdminUser;
  error?: string;
}

/**
 * Тип для ответа API со списком пользователей
 */
export interface UsersListResponse {
  success: boolean;
  users: AdminUser[];
  total: number;
  error?: string;
}

/**
 * Тип для ответа API при удалении пользователя
 */
export interface DeleteUserResponse {
  success: boolean;
  error?: string;
}

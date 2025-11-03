'use client';

import { useState, useEffect } from 'react';
import { AdminUser, UsersListResponse } from '@/types/users';
import { UsersTable } from '@/components/users/UsersTable';
import { CreateUserForm } from '@/components/users/CreateUserForm';
import { createClient } from '@/lib/supabase/client';

/**
 * Страница управления администраторами
 * Отображает список всех пользователей с возможностью добавления и удаления
 */
export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Загрузка текущего пользователя
  useEffect(() => {
    const loadCurrentUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };

    loadCurrentUser();
  }, []);

  // Загрузка списка пользователей
  const loadUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/users');
      const data: UsersListResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Ошибка при загрузке пользователей');
      }

      setUsers(data.users);
    } catch (err) {
      console.error('Ошибка загрузки пользователей:', err);
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  // Загрузка при монтировании
  useEffect(() => {
    loadUsers();
  }, []);

  // Обработчики
  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    loadUsers(); // Перезагрузка списка
  };

  const handleUserDeleted = () => {
    loadUsers(); // Перезагрузка списка после удаления
  };

  return (
    <div className="px-4 sm:px-0">
      {/* Заголовок с кнопкой создания */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Управление пользователями</h2>
          <p className="text-gray-500 mt-1">
            Управление доступом к админ-панели
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Создать администратора
        </button>
      </div>

      {/* Статистика */}
      <div className="mb-6">
        <div className="bg-white rounded-lg border border-gray-200 px-4 py-3">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span className="text-sm text-gray-600">
              Всего администраторов: <span className="font-semibold text-gray-900">{users.length}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Загрузка */}
      {isLoading && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-sm text-gray-500">Загрузка пользователей...</p>
        </div>
      )}

      {/* Ошибка */}
      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Ошибка</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
          <button
            onClick={loadUsers}
            className="mt-3 text-sm font-medium text-red-800 hover:text-red-900"
          >
            Попробовать снова
          </button>
        </div>
      )}

      {/* Таблица пользователей */}
      {!isLoading && !error && currentUserId && (
        <UsersTable
          users={users}
          currentUserId={currentUserId}
          onUserDeleted={handleUserDeleted}
        />
      )}

      {/* Форма создания нового администратора */}
      {showCreateForm && (
        <CreateUserForm
          onCancel={() => setShowCreateForm(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
}

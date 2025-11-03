'use client';

import { useState, useMemo } from 'react';
import { AdminUser } from '@/types/users';
import { DeleteUserDialog } from './DeleteUserDialog';
import { format } from 'date-fns';

interface UsersTableProps {
  users: AdminUser[];
  currentUserId: string;
  onUserDeleted: () => void;
}

/**
 * Таблица со списком всех администраторов
 * Поддерживает поиск по email и удаление пользователей
 */
export function UsersTable({ users, currentUserId, onUserDeleted }: UsersTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Фильтрация пользователей по поисковому запросу
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) {
      return users;
    }

    const query = searchQuery.toLowerCase();
    return users.filter(user =>
      user.email.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  // Сортировка по дате создания (новые первые)
  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [filteredUsers]);

  // Форматирование даты
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '—';
    try {
      return format(new Date(dateString), 'dd.MM.yyyy HH:mm');
    } catch {
      return '—';
    }
  };

  // Удаление пользователя
  const handleDeleteConfirm = async () => {
    if (!deletingUser) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/users/${deletingUser.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Ошибка при удалении пользователя');
      }

      // Успешное удаление
      setDeletingUser(null);
      onUserDeleted();
    } catch (error) {
      console.error('Ошибка удаления пользователя:', error);
      alert(error instanceof Error ? error.message : 'Произошла ошибка при удалении');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Поиск */}
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Поиск по email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Таблица */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата создания
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Последний вход
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedUsers.map((user) => {
                const isCurrentUser = user.id === currentUserId;

                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    {/* Email */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          {user.email}
                        </div>
                        {isCurrentUser && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            Вы
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Дата создания */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(user.created_at)}</div>
                    </td>

                    {/* Последний вход */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(user.last_sign_in_at)}</div>
                    </td>

                    {/* Статус */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.email_confirmed_at ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Активен
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Не подтверждён
                        </span>
                      )}
                    </td>

                    {/* Действия */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {isCurrentUser ? (
                        <span className="text-gray-400 italic">—</span>
                      ) : (
                        <button
                          onClick={() => setDeletingUser(user)}
                          className="text-red-600 hover:text-red-900 font-medium"
                        >
                          Удалить
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Если ничего не найдено */}
        {sortedUsers.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Ничего не найдено</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? 'Попробуйте изменить поисковый запрос' : 'Нет пользователей'}
            </p>
          </div>
        )}
      </div>

      {/* Диалог удаления */}
      {deletingUser && !isDeleting && (
        <DeleteUserDialog
          user={deletingUser}
          onCancel={() => setDeletingUser(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </>
  );
}

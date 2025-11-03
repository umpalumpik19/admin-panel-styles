import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Загрузка переменных окружения из .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env.local');
const envFile = readFileSync(envPath, 'utf-8');

// Парсинг .env файла
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

console.log('Проверка переменных:');
console.log('URL:', supabaseUrl ? 'найден' : 'не найден');
console.log('Service Key:', supabaseServiceKey ? 'найден' : 'не найден');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Отсутствуют переменные окружения SUPABASE');
  console.log('Найденные переменные:', Object.keys(envVars));
  process.exit(1);
}

// Создаем клиент с service role ключом для административных операций
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createTestUser() {
  try {
    console.log('🔄 Создание тестового пользователя...');

    const { data, error } = await supabase.auth.admin.createUser({
      email: 'admin@test.com',
      password: 'TestAdmin123!',
      email_confirm: true,
    });

    if (error) {
      // Проверяем, не существует ли уже пользователь
      if (error.message.includes('already registered')) {
        console.log('✅ Пользователь admin@test.com уже существует');
        return;
      }
      throw error;
    }

    console.log('✅ Тестовый пользователь успешно создан:');
    console.log('   Email: admin@test.com');
    console.log('   Password: TestAdmin123!');
    console.log('   ID:', data.user.id);
  } catch (error) {
    console.error('❌ Ошибка при создании пользователя:', error.message);
    process.exit(1);
  }
}

createTestUser();

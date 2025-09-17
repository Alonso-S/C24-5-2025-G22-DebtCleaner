import dotenv from 'dotenv';

dotenv.config();

function getEnv(key: string, fallback?: string): string {
  const value = process.env[key];
  if (!value && fallback === undefined) {
    throw new Error(`❌ Environment variable ${key} is not set.`);
  }
  return value || fallback!;
}

export const PORT = Number(getEnv('PORT', '3000'));
export const NODE_ENV = getEnv('NODE_ENV', 'development');
export const DB_URL = getEnv('DATABASE_URL');

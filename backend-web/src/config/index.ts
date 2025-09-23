import dotenv from "dotenv";
import type { StringValue } from "ms";

dotenv.config();

function getEnv(key: string, fallback?: string): string {
  const value = process.env[key];
  if (!value && fallback === undefined) {
    throw new Error(`❌ Environment variable ${key} is not set.`);
  }
  return value || fallback!;
}

export const PORT = Number(getEnv("PORT", "3000"));
export const NODE_ENV = getEnv("NODE_ENV", "development");
export const DB_URL = getEnv("DATABASE_URL");
export const JWT_SECRET = getEnv("JWT_SECRET");
export const JWT_EXPIRES_IN = getEnv("JWT_EXPIRES_IN", "1d") as StringValue;
export const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");
export const JWT_REFRESH_EXPIRES_IN = getEnv(
  "JWT_REFRESH_EXPIRES_IN",
  "7d"
) as StringValue;

export const GMAIL_USER = getEnv("GMAIL_USER");
export const GMAIL_APP_PASSWORD = getEnv("GMAIL_APP_PASSWORD");

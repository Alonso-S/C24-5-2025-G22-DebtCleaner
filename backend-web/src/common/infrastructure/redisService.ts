import Redis from "ioredis";

// Conexión a Redis
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

/**
 * Servicio para interactuar con Redis
 */
export const redisService = {
  /**
   * Guarda un valor en Redis con tiempo de expiración
   */
  async set(key: string, value: string, expirationSeconds: number): Promise<void> {
    await redis.set(key, value, "EX", expirationSeconds);
  },

  /**
   * Obtiene un valor de Redis
   */
  async get(key: string): Promise<string | null> {
    return redis.get(key);
  },

  /**
   * Elimina un valor de Redis
   */
  async del(key: string): Promise<void> {
    await redis.del(key);
  }
};
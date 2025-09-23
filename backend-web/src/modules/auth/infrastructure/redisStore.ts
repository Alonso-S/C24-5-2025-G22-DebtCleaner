import redis from "../../../common/infrastructure/redis";
import type { Email } from "../../../common/types/Email";

export const storeLoginCode = async (
  email: Email,
  code: string
): Promise<void> => {
  await redis.set(`login_code:${email}`, code, "EX", 600);
};

export const isLoginCodeCorrect = async (
  email: Email,
  code: string
): Promise<boolean> => {
  const storedCode = await redis.get(`login_code:${email}`);
  return storedCode === code;
};

export const deleteLoginCode = async (email: Email): Promise<void> => {
  await redis.del(`login_code:${email}`);
};

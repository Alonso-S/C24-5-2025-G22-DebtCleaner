import type { Email } from "../types/Email";

export const asEmail = (email: string): Email => {
  return email as Email;
};

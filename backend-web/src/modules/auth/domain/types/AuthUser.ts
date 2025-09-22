import type { Email } from "../../../../common/types/Email";

export type AuthUser = {
  id: number;
  name: string;
  email: Email;
  role: string;
};

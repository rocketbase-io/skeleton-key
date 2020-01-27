export interface AppUserCreate {
  admin: boolean;
  avatar: string;
  email: string;
  enabled: boolean;
  firstName: string;
  keyValues: Record<string, string>;
  lastName: string;
  password: string;
  username: string;
}

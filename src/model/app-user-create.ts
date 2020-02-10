export interface AppUserCreate {
  admin: boolean;
  email: string;
  enabled: boolean;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  keyValues: Record<string, string>;
  password: string;
  username: string;
}

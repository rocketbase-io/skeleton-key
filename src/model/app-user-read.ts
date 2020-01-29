export interface AppUserRead {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  email: string;
  avatar?: string;
  roles: string[];
  keyValues?: Record<string, string>;
  enabled: boolean;
  created: string;
  lastLogin?: string
}

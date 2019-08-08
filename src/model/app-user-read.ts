
export interface AppUserRead {
  avatar: string;
  created: string;
  email: string;
  enabled: boolean;
  firstName: string;
  id: string;
  keyValues: Record<string, string>;
  lastLogin: string;
  lastName: string;
  roles: string[];
  username: string;
}

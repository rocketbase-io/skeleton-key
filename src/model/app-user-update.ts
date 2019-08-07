
export interface AppUserUpdate {
  avatar: string;
  enabled: boolean;
  firstName: string;
  keyValues: Record<string, string>;
  lastName: string;
  roles: string[];
}

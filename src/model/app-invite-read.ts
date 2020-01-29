export interface AppInviteRead {
  id: string;
  invitor: string;
  message?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  roles: string[];
  keyValues?: Record<string, string>;
  created: string;
  expiration: string;
}

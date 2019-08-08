export interface RegistrationRequest {
  email: string;
  firstName: string;
  keyValues: Record<string, string>;
  lastName: string;
  password: string;
  username: string;
}

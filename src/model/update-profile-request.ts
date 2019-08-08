export interface UpdateProfileRequest {
  avatar: string;
  firstName: string;
  keyValues: Record<string, string>;
  lastName: string;
}

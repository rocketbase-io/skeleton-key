export interface ConfirmInviteRequest {
  inviteId: string;
  username: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
}

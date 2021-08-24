export interface RegistrationRequest {
  username: string;
  firstName?: string;
  lastName?: string;
  email: string;
  keyValues?: Record<string, string>;
  password: string;

  /**
   * optional parameter to overwrite system default
   * <p>
   * full qualified url to a custom UI that proceed the verification<br>
   * * ?verification=VALUE will get append
   */
  verificationUrl?: string;
}

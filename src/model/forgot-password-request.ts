/**
 * email or username is required
 */
export interface ForgotPasswordRequest {
  email?: string;
  username?: string;

  /**
   * optional parameter to overwrite system default
   * <p>
   * full qualified url to a custom UI that proceed the verification<br>
   * * ?verification=VALUE will get append
   */
  verificationUrl?: string;
}

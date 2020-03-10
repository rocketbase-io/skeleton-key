/**
 * email or username is required
 */
export interface ForgotPasswordRequest {
  email?: string;
  username?: string;

  /**
   * optional parameter to overwrite system default
   * full qualified url to a custom UI that proceed the verification
   * ?verification=VALUE will get append
   */
  resetPasswordUrl?: string;

  /**
   * optional parameter to overwrite system default
   * full qualified url to a custom UI that proceed the verification
   * ?verification=VALUE will get append
   * NOTE: Use resetPasswordUrl instead
   * @deprecated
   */
  verificationUrl?: string;
}

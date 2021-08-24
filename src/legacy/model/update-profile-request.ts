export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  avatar?: string;

  /**
   * will removed key that have value of null <br>
   * will only add/replace new/existing key values<br>
   * not mentioned key will still stay the same
   */
  keyValues?: Record<string, string>;
}

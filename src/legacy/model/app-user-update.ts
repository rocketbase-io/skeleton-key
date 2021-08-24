export interface AppUserUpdate {
  password?: boolean;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  enabled?: boolean;

  /**
   * will removed key that have value of null <br>
   * will only add/replace new/existing key values<br>
   * not mentioned key will still stay the same
   */
  keyValues?: Record<string, string>;
  roles?: string[];
}

/* istanbul ignore file */
export class InvalidCharacterError extends Error {
  constructor(public message: string) {
    super(message);
  }
}
InvalidCharacterError.prototype.name = "InvalidCharacterError";

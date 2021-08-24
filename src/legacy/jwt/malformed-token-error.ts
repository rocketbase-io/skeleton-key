export class MalformedTokenError extends Error {
  constructor(public message: string) {
    super(message);
  }
}
MalformedTokenError.prototype.name = "MalformedTokenError";

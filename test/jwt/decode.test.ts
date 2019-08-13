import "jasmine";
import {decode, MalformedTokenError} from "../../src/jwt";

describe("jwt", () => {

  describe("decode", () => {

    describe("#decode()", () => {

      it("should decode a valid jwt", () => {
        const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZXhwIjoyNTE2MjM5MDIyfQ.487jb8G1qYLxqI7cKLkIX0aIZImR80jkCo-F3q6xr9w";
        const decoded = decode(jwt);
        expect(decoded.header).toEqual({
          alg: "HS256",
          typ: "JWT"
        });
        expect(decoded.payload).toEqual({
          sub: "1234567890",
          name: "John Doe",
          exp: 2516239022
        } as any)
      });

      it("should throw for invalid jwt", () => {
        const invalidJwt = "eyJhbGciOiJIUzI1NiIsInR5cI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZXhwIjoyNTE2MjM5MDIyfQ.487jb8G1qYLxqI7cKLkIX0aIZImR80jkCo-F3q6xr9w"
        expect(() => decode(invalidJwt)).toThrowError(MalformedTokenError);
      });

    });

  });

});

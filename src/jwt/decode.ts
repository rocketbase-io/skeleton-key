import {JsonWebToken} from "./token";
import {b64UrlDecode} from "./url-decode";
import {MalformedTokenError} from "./malformed-token-error";

const jsonParse = (str: string) => JSON.parse(str);

/**
 * Decode a JWT header + payload and return the resulting bundle.
 * @param token The jwt
 */
export function decode(token: string): JsonWebToken {
  try {
    const [header, payload] = token.split(".")
      .slice(0, 2)
      .map(b64UrlDecode)
      .map(jsonParse);
    return {
      header,
      payload
    };
  } catch (ex) {
    throw new MalformedTokenError(ex);
  }
}


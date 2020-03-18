/* istanbul ignore file */
import { InvalidCharacterError } from "./invalid-character-error";

/**
 * The code was extracted from:
 * https://github.com/auth0/jwt-decode/blob/master/lib/base64_url_decode.js
 * (MIT License)
 */
function b64DecodeUnicode(str: string): string {
  return decodeURIComponent(
    atob(str).replace(/(.)/g, (m, p) => {
      let code = p
        .charCodeAt(0)
        .toString(16)
        .toUpperCase();
      if (code.length < 2) code = `0${code}`;
      return `%${code}`;
    })
  );
}

export function b64UrlDecode(str: string): string {
  let output = str.replace(/-/g, "+").replace(/_/g, "/");
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += "==";
      break;
    case 3:
      output += "=";
      break;
    default:
      throw new InvalidCharacterError("Illegal base64url string!");
  }
  try {
    return b64DecodeUnicode(output);
  } catch (err) {
    return atob(output);
  }
}

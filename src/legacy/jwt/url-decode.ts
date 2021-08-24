/* istanbul ignore file */
import { InvalidCharacterError } from "./invalid-character-error";
import { atob } from "./atob-polyfill";

/**
 * This code was adapted from:
 * https://github.com/auth0/jwt-decode/blob/master/lib/base64_url_decode.js
 * @license MIT
 */
function b64DecodeUnicode(str: string): string {
  return decodeURIComponent(
    atob(str).replace(/(.)/g, (m, p) => {
      let code = p.charCodeAt(0).toString(16).toUpperCase();
      if (code.length < 2) code = `0${code}`;
      return `%${code}`;
    })
  );
}

const urlReplacements = { "-": "+", _: "/" } as const;

export function b64UrlNormalize(str: string): string {
  if (!str) return "";
  str = str.replace(/[-_]/g, (match) => urlReplacements[match as "-" | "_"]);
  const padding = str.length % 4;
  if (padding === 1) throw new InvalidCharacterError("Illegal base64url string: " + str);
  else if (padding === 2) str += "==";
  else if (padding === 3) str += "=";
  return str;
}

export function b64UrlDecode(str: string): string {
  str = b64UrlNormalize(str);
  try {
    return b64DecodeUnicode(str);
  } catch (err) {
    return atob(str);
  }
}

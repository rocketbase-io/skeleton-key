
export interface JwtToken {
  header?: {
    alg: string;
    typ?: string;
    cty?: 'JWT' | string;
  };
  payload: {
    iss?: string;
    sub?: string;
    aud?: string[];
    exp: number;
    nbf?: number;
    iat?: number;
    jti?: string;
  };
}

export function decode(token: string): JwtToken {
  try {
    const parts = token.split('.')
      .slice(0, 2)
      .map(b64UrlDecode)
      // @ts-ignore
      .map(JSON.parse.bind(JSON));
    if (parts.length === 2) {
      return {
        header: parts[0],
        payload: parts[1],
      };
    } else {
      return {
        payload: parts[0],
      };
    }
  } catch (e) {
    throw new MalformedTokenError(e);
  }
}

/**
 * The code was extracted from:
 * https://github.com/davidchambers/Base64.js
 */
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

class InvalidCharacterError extends Error {
  constructor(public message: string) {
    super(message);
  }
}
InvalidCharacterError.prototype.name = 'InvalidCharacterError';

class MalformedTokenError extends Error {
  constructor(public message: string) {
    super(message);
  }
}
MalformedTokenError.prototype.name = 'MalformedTokenError';

function polyfill(input: string): string {
  const str = String(input).replace(/=+$/, '');
  if (str.length % 4 === 1) {
    throw new InvalidCharacterError('\'atob\' failed: The string to be decoded is not correctly encoded.');
  }
  for (
    // initialize result and counters
    // tslint:disable-next-line
    let bc = 0, bs, buffer, idx = 0, output = '';
    // get next character
    buffer = str.charAt(idx++);
    // character found in table? initialize bit storage and add its ascii value;
    // @ts-ignore
    ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
      // and if not first of each 4 characters,
      // convert the first 8 bits to one ascii character
      // tslint:disable-next-line
    bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
  ) {
    // try to find character in table (0-63, not found => -1)
    buffer = chars.indexOf(buffer);
  }
  // @ts-ignore
  return output;
}

window.atob = typeof window !== 'undefined' && window.atob && window.atob.bind(window) || polyfill;

/**
 * The code was extracted from:
 * https://github.com/auth0/jwt-decode/blob/master/lib/base64_url_decode.js
 * (MIT License)
 */
function b64DecodeUnicode(str: string): string {
  return decodeURIComponent(atob(str).replace(/(.)/g, (m, p) => {
    let code = p.charCodeAt(0).toString(16).toUpperCase();
    if (code.length < 2) code = `0${code}`;
    return `%${code}`;
  }));
}

function b64UrlDecode(str: string): string {
  let output = str.replace(/-/g, '+').replace(/_/g, '/');
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += '==';
      break;
    case 3:
      output += '=';
      break;
    default:
      throw new InvalidCharacterError('Illegal base64url string!');
  }
  try {
    return b64DecodeUnicode(output);
  } catch (err) {
    return atob(output);
  }
}

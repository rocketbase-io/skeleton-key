/**
 * Parsed representation of a jwt, consisting of a header and a payload.
 */
export interface JsonWebToken {
  header: JsonWebTokenHeader;
  payload: JsonWebTokenPayload;
}

/**
 * The header of the jwt, containing metadata for the jwt payload.
 */
export interface JsonWebTokenHeader {
  /**
   * The signing algorithm used to create this token, can be any hashing algorithm.
   * examples: HMAC SHA256 or RSA
   */
  alg: string;
  /**
   * The IANA mediatype of this token. Defaults to JWT for application/jwt.
   */
  typ?: string;
  /**
   * The content type of the jwt, this describes the payload of the jwt. If the jwt payload is another jwt, it should be set to JWT.
   */
  cty?: "JWT" | string;
}

/**
 * The JWT payload. This is where custom data can be embedded.
 */
export interface JsonWebTokenPayload {
  /**
   * The issuer of the token
   */
  iss?: string;
  /**
   * The subject of the token, it describes for what subjects this token is valid.
   */
  sub?: string;
  /**
   * Audience, the target domain of the token.
   */
  aud?: string;
  /**
   * Expiry, the expiry of the token as a unix timestamp in seconds.
   */
  exp?: number;
  /**
   * Not Before, the time from which on the token is valid as a unix timestamp in seconds.
   */
  nbf?: number;
  /**
   * Issued At, the time at which the token was issued as a unix timestamp in seconds
   */
  iat?: number;
  /**
   * JWT ID, the unique if of this token.
   */
  jti?: string;
}

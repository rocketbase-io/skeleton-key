

export interface JsonWebToken {
  header: JsonWebTokenHeader;
  payload: JsonWebTokenPayload;
}

export interface JsonWebTokenHeader {
  alg: string;
  typ?: string;
  cty?: "JWT" | string;
}

export interface JsonWebTokenPayload {
  iss?: string;
  sub?: string;
  aud?: string;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
}

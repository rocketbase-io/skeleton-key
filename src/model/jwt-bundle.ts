export interface JwtBundle {
  refreshToken?: string;
  token: string;
}

export interface JwtResponseBundle {
  token_type: "Bearer";
  scope?: string;
  expires_in: number;
  access_token: string;
  refresh_expires_in: number;
  refresh_token: string;
}

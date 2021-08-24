export interface SkeletonConfig<
  User = unknown,
  Data extends Record<string, unknown> = Record<string, unknown>,
  Tokens extends Record<string, string | undefined> = Record<string, string | undefined>
> {
  callbackUrl?: string;
  tokens?: Partial<Record<keyof Tokens, SkeletonTokenConfig>>;
}

export interface SkeletonTokenConfig {
  // where to store and/or load a token
  keepIn?: "session" | "cookie" | "storage";
  // maximum time to keep a token for (lower token expiry overrides)
  // examples "2m 1s" or "2d1m", supported values: smhd
  keepFor?: string;
}

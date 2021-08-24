import { SkeletonKey } from "@/types/skeleton-key";
import { SkeletonConfig } from "@/types/config";

export interface SkeletonContext<
  User = unknown,
  Data extends Record<string, unknown> = Record<string, unknown>,
  Tokens extends Record<string, string | undefined> = Record<string, string | undefined>
> {
  auth: SkeletonKey;
  config: SkeletonConfig<User, Data, Tokens>;
  user?: User;
  data?: Data;
  tokens?: Tokens;
}

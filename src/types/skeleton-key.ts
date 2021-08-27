import { SkeletonKeyBase } from "@/base";
import { SkeletonConfig } from "@/types/config";
import { SkeletonContext } from "@/types/context";

export interface SkeletonKey extends SkeletonKeyBase {
  init(config?: SkeletonConfig): Promise<void>;
  initialized(): boolean;
  initialize(): Promise<this>;

  read?<T>(key: string): T | undefined;
  persist?(key: string, value: unknown): void;
  store?(key: keyof SkeletonContext): void;
}

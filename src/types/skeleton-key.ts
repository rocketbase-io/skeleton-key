import { SkeletonKeyBase } from "@/base";
import { SkeletonConfig } from "@/types/config";

export interface SkeletonKey extends SkeletonKeyBase {
  init(config: SkeletonConfig): Promise<void>;
}

import { SkeletonConfig } from "@/types";

export function mergeConfig(...configs: SkeletonConfig[]): SkeletonConfig {
  return configs.reduce((config, current) => ({ ...config, ...current }));
}

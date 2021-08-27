import { SkeletonAdapter, SkeletonKey } from "@/types";
import { bindMethods } from "@/util";
import { createSkeletonKeyBase } from "@/base";

export * from "@/adapter";

export function skeletonKey(adapters: SkeletonAdapter[]): SkeletonKey {
  const combined = adapters.reduce(
    (prev, current) => ({ ...prev, ...((current?.expose as Partial<SkeletonKey>) ?? {}) }),
    createSkeletonKeyBase(adapters)
  ) as never;
  return bindMethods(combined);
}

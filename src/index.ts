import { storageAdapter } from "@/adapter/storage";
import { SkeletonAdapter, SkeletonKey } from "@/types";
import { bindMethods } from "@/util";
import { createSkeletonKeyBase } from "@/base";

export function skeletonKey(adapters: SkeletonAdapter[]): SkeletonKey {
  const combined = adapters.reduce(
    (prev, current) => ({ ...prev, ...(current?.expose ?? {}) }),
    createSkeletonKeyBase()
  ) as never;
  return bindMethods(combined);
}

const auth = skeletonKey([storageAdapter({ key: "skeleton-key" })]);

auth.init({
  tokens: {
    refreshToken: {
      keepFor: "30d",
      keepIn: "storage",
    },
  },
});

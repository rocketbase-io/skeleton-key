import { SkeletonAdapter, SkeletonContext, SkeletonConfig } from "@/types";
import { dateSerializer, json, StringSerializer } from "@/util";

export function storageAdapter({
  storage = localStorage,
  key,
  storedFields = ["user", "tokens", "data"],
  ignoredSources = ["revive", "init"],
  serializer = json([dateSerializer]),
}: {
  storage?: Storage;
  key: string;
  storedFields?: (keyof SkeletonContext)[];
  ignoredSources?: string[];
  serializer?: StringSerializer;
}): SkeletonAdapter {
  const revive: SkeletonAdapter["revive"] = (context) => {
    if (context.user && context.data) return;
    try {
      const item = storage.getItem(key);
      if (!item) return;
      const data = serializer.parse(item ?? "null");
      if (!data) return;
      const patches: Partial<SkeletonContext> = {};
      for (const [name, value] of storedFields) {
        if (name in context || !(name in data)) continue;
        patches[name as keyof SkeletonContext] = value as never;
      }
      context.auth.internal.setContext(patches, "revive");
    } catch (ignored) {
      return;
    }
  };

  const change: SkeletonAdapter["change"] = (newContext, oldContext, source) => {
    if (ignoredSources.includes(source)) return;
    storage.setItem(
      key,
      serializer.stringify(Object.fromEntries(storedFields.map((field) => [field, newContext[field]])))
    );
  };

  return {
    revive,
    change,
  };
}

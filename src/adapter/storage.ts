import { SkeletonAdapter, SkeletonContext, SkeletonConfig, PromiseOr, SkeletonKey } from "@/types";
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
  let revived = false;

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
      revived = true;
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

  function store(
    this: SkeletonKey,
    field: keyof SkeletonContext,
    source: string,
    preferRuntime?: boolean
  ): PromiseOr<void> {
    if (ignoredSources.includes(source)) return;
    if (storedFields.includes(field)) return;
    storedFields = storedFields.concat(field);
    if (!revived) return;
    const value = serializer.parse(storage.getItem(key) ?? "{}");
    if (field in value && !preferRuntime ? this.internal.getContext()[field] !== "undefined" : true)
      this.internal.setContext({ [field]: value[field] }, "revive");
    storage.setItem(
      key,
      serializer.stringify(Object.fromEntries(storedFields.map((field) => [field, this.internal.getContext()[field]])))
    );
  }

  function persist(key: string, value: unknown): void {
    storage.setItem(key, serializer.stringify(value));
  }

  function read<T>(key: string): T {
    return serializer.parse(storage.getItem(key) ?? "null");
  }

  return {
    revive,
    change,
    expose: { store, persist, read },
  };
}

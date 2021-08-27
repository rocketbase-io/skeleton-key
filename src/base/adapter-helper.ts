import { PromiseOr, SkeletonAdapter, SkeletonContext, TeardownOr } from "@/types";

export type MatchValues<T, Match> = {
  [Key in keyof T]: T extends Match ? T : never;
};

export type SkeletonHooks = keyof MatchValues<SkeletonAdapter, (context: SkeletonContext, ...args: any[]) => any>;
export type SkeletonArgs<Key extends SkeletonHooks> = SkeletonAdapter[Key] extends (
  context: SkeletonContext,
  ...args: infer Args
) => any
  ? Args
  : never;

export interface SkeletonAdapterHelper {
  hook<Key extends SkeletonHooks>(key: Key): Exclude<SkeletonAdapter[Key], undefined>[];
  teardown<Key extends SkeletonHooks>(key: Key, ...args: SkeletonArgs<Key>): Promise<() => Promise<void>>;
}

export function skeletonAdapters(
  adapters: SkeletonAdapter[],
  getContext: () => SkeletonContext
): SkeletonAdapterHelper {
  const hook: SkeletonAdapterHelper["hook"] = (key) => {
    return adapters
      .map((adapter) => {
        const hook = adapter[key];
        if (typeof hook === "function") return hook.bind(adapter);
        else return hook;
      })
      .filter((hook) => hook) as never;
  };

  const teardown: SkeletonAdapterHelper["teardown"] = async <Key extends SkeletonHooks>(
    key: Key,
    ...args: SkeletonArgs<Key>
  ) => {
    const teardowns = await hook(key).reduce(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      async (promise, handler) => (await promise).concat(await handler(getContext(), ...args)),
      Promise.resolve([] as TeardownOr<PromiseOr<void>>[])
    );

    return () =>
      Promise.all(
        teardowns.filter((it) => typeof it === "function").map((teardown) => (teardown as () => PromiseOr<void>)())
      ).then();
  };

  return { hook, teardown };
}

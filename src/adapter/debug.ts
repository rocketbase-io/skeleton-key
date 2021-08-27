import { SkeletonAdapter } from "@/types";

type OnlyFn<T> = T extends (...args: any[]) => any ? T : never;

export function debug(
  debug: boolean = typeof process !== "undefined" && process.env.NODE_END === "development",
  logArgs = false
): SkeletonAdapter {
  const start = new Date();
  let longest = 0;
  const log = <Key extends keyof SkeletonAdapter>(
    hook: Key,
    retval:
      | ReturnType<OnlyFn<SkeletonAdapter[Key]>>
      | ((...args: Parameters<OnlyFn<SkeletonAdapter[Key]>>) => ReturnType<OnlyFn<SkeletonAdapter[Key]>>)
  ): SkeletonAdapter[Key] => {
    if (hook.length > longest) longest = hook.length;
    return ((...args: Parameters<OnlyFn<SkeletonAdapter[Key]>>) => {
      const title = hook.padStart(longest - Math.ceil((longest - hook.length) / 2)).padEnd(longest);
      const now = new Date();
      // eslint-disable-next-line no-console
      console.log(`[${title}] ${now.toISOString()} (${now.getTime() - start.getTime()}ms)`);
      // eslint-disable-next-line no-console
      if (logArgs) console.log("args:", ...args);
      return typeof retval === "function"
        ? (retval as (...args: Parameters<OnlyFn<SkeletonAdapter[Key]>>) => never)(...args)
        : retval;
    }) as never;
  };
  if (!debug) return {};

  return {
    init: log("init", undefined),
    postInit: log("postInit", undefined),
    change: log("change", undefined),
    revive: log("revive", undefined),
    config: log("config", {} as never),
    enrich: log("enrich", (context) => context),
  };
}

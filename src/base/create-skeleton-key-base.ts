import { skeletonAdapters } from "@/base/adapter-helper";
import { mergeConfig } from "@/base/merge-config";
import { PromiseOr, SkeletonAdapter, SkeletonConfig, SkeletonContext, SkeletonKey, TeardownOr } from "@/types";

export interface SkeletonReceiveConfig {
  close?: boolean;
  redirect?: string;
}

export interface SkeletonKeyBase {
  internal: {
    init(self: SkeletonKeyBase, config: SkeletonConfig): Promise<void>;
    setContext: (context: Partial<SkeletonContext>, source: string) => void;
    getContext: () => SkeletonContext;

    storeUrl: (key: string, url: string, expiry?: string) => void;
    getStoredUrl: (key: string) => string | undefined;
    receiveToken: (name: string, token: string) => Promise<SkeletonReceiveConfig>;
  };
}

export function createSkeletonKeyBase(adapters: SkeletonAdapter[]): SkeletonKeyBase {
  let context: SkeletonContext = { config: {} } as never;
  const getContext = () => context;
  function setContext(newContext: Partial<SkeletonContext>, source = "internal"): Promise<void> {
    const before = context;
    context = { ...context, ...newContext };
    return Promise.all(helper.hook("change").map((handler) => handler(context, before, source))).then();
  }

  const helper = skeletonAdapters(adapters, getContext);

  async function configHook(config: SkeletonConfig = {}): Promise<void> {
    config = mergeConfig(
      await helper.hook("config").reduce(async (configPromise, handler) => {
        const config = await configPromise;
        return mergeConfig(config, await handler({ ...context, config }));
      }, Promise.resolve(context.config)),
      config
    );
    await setContext({ config });
  }

  async function reviveHook(): Promise<() => Promise<void>> {
    return await helper.teardown("revive");
  }

  async function initHook(): Promise<() => Promise<void>> {
    return await helper.teardown("init");
  }

  async function postInitHook(): Promise<() => Promise<void>> {
    return await helper.teardown("postInit");
  }

  async function init(this: SkeletonKey, config: SkeletonConfig = {}): Promise<void> {
    await setContext({ auth: this });
    await configHook(config);
    await reviveHook();
    await initHook();
    await postInitHook();
  }

  const internal = { init, setContext, getContext };
  return { internal, init } as never;
}

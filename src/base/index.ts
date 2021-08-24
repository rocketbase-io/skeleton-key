import { SkeletonConfig, SkeletonContext, SkeletonKey } from "@/types";

export interface SkeletonReceiveConfig {
  close?: true;
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

export function createSkeletonKeyBase(): SkeletonKeyBase {
  let context: SkeletonContext = { config: {} } as never;

  const getContext = () => context;
  function setContext(newContext: Partial<SkeletonContext>): void {
    context = { ...context, ...newContext };
  }

  async function init(auth: SkeletonKey, config: SkeletonConfig): Promise<void> {
    setContext({ auth, config });
  }

  const internal = { init, setContext, getContext };
  return { internal } as never;
}

import { SkeletonConfig } from "@/types/config";
import { SkeletonContext } from "@/types/context";
import { SkeletonKey } from "@/types/skeleton-key";
import { PromiseOr, TeardownOr } from "@/types/util";
import { AxiosRequestConfig } from "axios";

export type RequestConfig = AxiosRequestConfig;

export interface SkeletonAdapter {
  config?(context: SkeletonContext): PromiseOr<Partial<SkeletonConfig>>;
  revive?(context: SkeletonContext): TeardownOr<PromiseOr<void>>;
  init?(context: SkeletonContext): TeardownOr<PromiseOr<void>>;
  postInit?(context: SkeletonContext): TeardownOr<PromiseOr<void>>;

  /**
   * hook for when the context has been modified
   * @param newContext the new context after modification
   * @param oldContext the old context pre modification
   * @param source the source of the event, e.g. "revive" or "login"
   */
  change?(newContext: SkeletonContext, oldContext: SkeletonContext, source: string): void;

  /**
   * use this hook to change any intercepted requests
   * useful for adding headers or parameters or stalling
   * @param request the original request options
   * @param context the current skeleton-key context
   * @return changedConfig the new request config
   */
  enrich?(request: RequestConfig, context: SkeletonContext): PromiseOr<RequestConfig>;

  /**
   * Expose global properties on the skeleton-key object
   */
  expose?: Partial<SkeletonKey> | unknown;
}
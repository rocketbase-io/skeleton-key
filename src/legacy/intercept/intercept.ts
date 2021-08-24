import { MethodOnly } from "@/types";
import {
  xmlHttpRequestOpenMiddleware,
  xmlHttpRequestSendMiddleware,
  xmlHttpRequestSetRequestHeaderMiddleware,
  fetchMiddleware,
} from "./middleware";

export function interceptFunction<T, K extends keyof T, M extends MethodOnly<T[K]>>(
  target: T,
  key: K,
  middleware: (...args: Parameters<M>) => Parameters<M> | Promise<Parameters<M>>,
  async?: boolean
): T[K] {
  const orig = target[key];
  if ((orig as any).__intercepted) return orig;
  let intercepted: any;

  if (async)
    intercepted = (target as any)[key] = async function (...params: Parameters<M>) {
      let args: Parameters<M>;
      try {
        args = await middleware.call(this, ...params);
      } catch (ex) {
        // Don't call on error.
        // eslint-disable-next-line
        console.error(ex);
        return;
      }
      return (orig as any).call(this, ...(args ?? (params as unknown[])));
    };
  else
    intercepted = (target as any)[key] = function (...params: Parameters<M>) {
      let args: Parameters<M>;
      try {
        args = middleware.call(this, ...params) as Parameters<M>;
      } catch (ex) {
        // Don't call on error.
        // eslint-disable-next-line
        console.error(ex);
        return;
      }
      return (orig as any).call(this, ...(args ?? (params as unknown[])));
    };
  (intercepted as any).__intercepted = true;
  return intercepted;
}

export function installInterceptors(): void {
  interceptFunction(XMLHttpRequest.prototype, "open", xmlHttpRequestOpenMiddleware as any);
  interceptFunction(XMLHttpRequest.prototype, "send", xmlHttpRequestSendMiddleware as any, true);
  interceptFunction(XMLHttpRequest.prototype, "setRequestHeader", xmlHttpRequestSetRequestHeaderMiddleware as any);
  interceptFunction(Function("return this")() as any, "fetch", fetchMiddleware as any);
}

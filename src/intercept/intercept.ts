import {
  xmlHttpRequestOpenMiddleware,
  xmlHttpRequestSendMiddleware,
  xmlHttpRequestSetRequestHeaderMiddleware,
  fetchMiddleware
} from "./middleware";

export function interceptFunction<T, K extends keyof T, M extends T[K] extends (...args: any) => any ? T[K] : never>(
  target: T,
  key: K,
  middleware: (...args: Parameters<M>) => Parameters<M> | Promise<Parameters<M>>,
  async?: boolean
) {
  const orig = target[key];
  if ((orig as any).__intercepted) return;
  let intercepted: any;

  if (async)
    // @ts-ignore
    intercepted = target[key] = async function(...params: Parameters<M>) {
      let args: Parameters<M>;
      try {
        args = await middleware.call(this, ...params);
      } catch (ex) {
        // Don't call on error.
        // eslint-disable-next-line
        console.error(ex);
        return;
      }
      // @ts-ignore
      return orig.call(this, ...(args ?? params));
    };
  /* eslint-disable-next-line */
  else
    // @ts-ignore
    intercepted = target[key] = function(...params: Parameters<M>) {
      let args: Parameters<M>;
      try {
        args = middleware.call(this, ...params) as Parameters<M>;
      } catch (ex) {
        // Don't call on error.
        // eslint-disable-next-line
        console.error(ex);
        return;
      }
      // @ts-ignore
      return orig.call(this, ...(args ?? params));
    };
  (intercepted as any).__intercepted = true;
  return intercepted;
}

export function installInterceptors() {
  interceptFunction(XMLHttpRequest.prototype, "open", xmlHttpRequestOpenMiddleware);
  interceptFunction(XMLHttpRequest.prototype, "send", xmlHttpRequestSendMiddleware, true);
  interceptFunction(XMLHttpRequest.prototype, "setRequestHeader", xmlHttpRequestSetRequestHeaderMiddleware);
  interceptFunction(window, "fetch", fetchMiddleware);
}

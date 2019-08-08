import {
  xmlHttpRequestOpenMiddleware,
  xmlHttpRequestSendMiddleware,
  xmlHttpRequestSetRequestHeaderMiddleware,
  fetchMiddleware
} from "./middleware";


export function interceptFunction<T, K extends keyof T, M extends (T[K] extends (...args: any) => any ? T[K] : never)>(
  target: T, key: K, middleware: (...args: Parameters<M>) => Parameters<M>
) {
  const orig = target[key];
  if ((orig as any).__intercepted) return;
  // @ts-ignore
  const intercepted = target[key] = function() {
    let args: Parameters<M>;
    try {
      args = middleware.call(this, ...arguments as any as Parameters<M>);
    } catch (ex) {
      // Don't call on error.
      return;
    }
    // @ts-ignore
    return orig.apply(this, args === null ? arguments : args);
  };
  (intercepted as any).__intercepted = true;
  return intercepted;
}

export function installInterceptors() {
  interceptFunction(XMLHttpRequest.prototype, "open", xmlHttpRequestOpenMiddleware);
  interceptFunction(XMLHttpRequest.prototype, "send", xmlHttpRequestSendMiddleware);
  interceptFunction(XMLHttpRequest.prototype, "setRequestHeader", xmlHttpRequestSetRequestHeaderMiddleware);
  interceptFunction(window, "fetch", fetchMiddleware);
}




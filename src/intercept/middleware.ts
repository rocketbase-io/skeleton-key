/* eslint-disable prefer-rest-params,@typescript-eslint/no-unused-vars */
import { interceptors } from "./interceptor";
import { isInDomain } from "@/domain";

export function xmlHttpRequestOpenMiddleware(
  this: XMLHttpRequest,
  method: string,
  url: string,
  async?: boolean,
  username?: string | null,
  password?: string | null
) {
  this.__openArgs = arguments;
  return executeRelevantInterceptors(url, "onXhrOpen", this, arguments);
}

export function xmlHttpRequestSendMiddleware(this: XMLHttpRequest, body: any) {
  const [, url] = this.__openArgs;
  return executeRelevantInterceptors(url, "onXhrSend", this, arguments, true);
}

export function fetchMiddleware(this: any, info: RequestInfo, init?: RequestInit) {
  return executeRelevantInterceptors(typeof info === "string" ? info : info.url, "onFetch", this, arguments);
}

export function xmlHttpRequestSetRequestHeaderMiddleware(this: XMLHttpRequest, key: string, value: string) {
  if (!this.__headers) this.__headers = {};
  this.__headers[key] = value;
  return arguments as any;
}

export interface XMLHttpRequest {
  __headers: { [key: string]: string };
  __openArgs: IArguments;
}

export function executeRelevantInterceptors(url: string, handler: string, context: any, args: any, async?: boolean) {
  const relevant = interceptors.filter(itor => isInDomain(itor.domains, url));
  if (!relevant.length) return args;
  const methods = relevant.map(interceptor => (interceptor as any)[handler]).filter(handler => handler);
  if (async)
    return methods.reduce(
      async (args, handler) => skipFirst((await handler.apply(context, [context, ...(await args)])) || (await args)),
      args as any
    );
  else
    return methods.reduce(
      (args, handler) => skipFirst(handler.apply(context, [context, ...args])) || args,
      args as any
    );
}

export function skipFirst(array: any[]) {
  if (!array) return;
  return array.slice ? array.slice(1) : [...array].slice(1);
}

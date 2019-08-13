import {interceptors} from "./interceptor";
import {isInDomain} from "../domain";


export function xmlHttpRequestOpenMiddleware(
  this: XMLHttpRequest, method: string, url: string, async?: boolean, username?: string | null, password?: string | null
) {
  // @ts-ignore
  this.__openArgs = arguments;
  return executeRelevantInterceptors(url, "onXhrOpen", this, arguments);
}

export function xmlHttpRequestSendMiddleware(this: XMLHttpRequest, body: any) {
  // @ts-ignore
  const [, url] = this.__openArgs;
  return executeRelevantInterceptors(url, "onXhrSend", this, arguments);
}


export function fetchMiddleware(this: any, info: RequestInfo, init?: RequestInit) {
  return executeRelevantInterceptors(typeof info === "string" ? info : info.url, "onFetch", this, arguments);
}


export function xmlHttpRequestSetRequestHeaderMiddleware(this: XMLHttpRequest, key: string, value: string) {
  const anyThis = this as any;
  if (!anyThis.__headers) anyThis.__headers = {};
  anyThis.__headers[key] = value;
  return arguments as any;
}


function executeRelevantInterceptors(url: string, handler: string, context: any, args: any) {
  const relevant = interceptors.filter(itor => isInDomain(itor.domains, url));
  if (!relevant.length) return args;
  return relevant.reduce((args, itor) => (itor as any)[handler].apply(context, args) || args, args as any);
}
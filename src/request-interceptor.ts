import { isInDomain } from "./domain";


const interceptors: RequestInterceptor[] = [];

export interface RequestInterceptor {
  domains: string[];
  onXHROpen(xhr: XMLHttpRequest, method: string, url: string, async?: boolean, user?:string, password?:string): false | any[];
  onXHRSend(xhr: XMLHttpRequest, body: any): false | any;
}

export function interceptXHR(interceptor: RequestInterceptor) {
  interceptors.push(interceptor);
  interceptXHROpen();
  interceptXHRSend();
}

export function interceptXHROpen() {
  const orig = XMLHttpRequest.prototype.open;
  // @ts-ignore
  if (orig.__intercepted) return;

  // tslint:disable-next-line:only-arrow-functions
  const open = XMLHttpRequest.prototype.open = function() {
    // @ts-ignore
    const args = requestOpenMiddleware(...arguments);
    // @ts-ignore
    if (args != null) return orig(...args);
  };
  // @ts-ignore
  open.__intercepted = true;
}

export function interceptXHRSend() {
  const orig = XMLHttpRequest.prototype.send;
  // @ts-ignore
  if (orig.__intercepted) return;

  // tslint:disable-next-line:only-arrow-functions
  const send = XMLHttpRequest.prototype.send = function() {
    // @ts-ignore
    const args = requestSendMiddleware(...arguments);
    // @ts-ignore
    if (args != null) return orig(...args);
  };
  // @ts-ignore
  send.__intercepted = true;
}

export function requestOpenMiddleware(this: XMLHttpRequest, method: string, url: string, async?: boolean, user?:string, password?:string) {
  const blocked = interceptors.find(interceptor => {
    if (!isInDomain(url, interceptor.domains)) return false;
    const newParams = interceptor.onXHROpen(this, method, url, async, user, password);
    if (!newParams) return true;
    method = newParams[0];
    url = newParams[1];
    async = newParams[2];
    user = newParams[3];
    password = newParams[4];
  });
  if (blocked) return;
  return [method, url, ...[async], ...[user], ...[password]];
}

export function requestSendMiddleware(this: XMLHttpRequest, body: any) {
  const blocked = interceptors.find(interceptor => {
    if (!isInDomain(this.responseURL, interceptor.domains)) return false;
    const newParams = interceptor.onXHRSend(this, body);
    if (!newParams) return true;
    body = newParams;
  });
  if (blocked) return;
  return body;
}


export interface Interceptor {
  domains: string[];
  onXhrOpen?(xhr: XMLHttpRequest, method: string, url: string, async?: boolean, user?: string, password?: string): any;
  onXhrSend?(xhr: XMLHttpRequest, body: any): any;
  onFetch?(ctx: any, input: RequestInfo, init?: RequestInit): any;
}

export const interceptors: Interceptor[] = [];

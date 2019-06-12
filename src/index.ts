import {interceptXHR, interceptXHRSend, interceptXHROpen} from "./request-interceptor";
export * from "./domain";


export interface SkeletonKeyOpts {
  interceptXHR?: boolean;
  domains?: string[];
  log?: boolean;
}

export const SkeletonKeyDefaults: SkeletonKeyOpts = {
  interceptXHR: true,
  domains: ["*"],
  log: false
};

export default class SkeletonKey {

  public domains: string[] = [];
  public log: boolean = false;

  constructor(opts?: SkeletonKeyOpts) {
    const options = Object.assign({}, SkeletonKeyDefaults, opts);

    this.domains = options.domains || ["*"];
    this.log = !!options.log;
    if (options.interceptXHR) SkeletonKey.interceptXHR(this);
  }

  onXHROpen(xhr: XMLHttpRequest, method: string, url: string, async?: boolean, user?:string, password?:string) {
    if (this.log) console.log(`XHR OPEN: [${method}] "${url}" (${async ? "async, " : ""}${user}:${password})`, xhr);
    return [method, url, async, user, password];
  }

  onXHRSend(xhr: XMLHttpRequest, body: any) {
    if (this.log) console.log(`XHR SEND: ${body}`, xhr);
    return body;
  }

  public static interceptXHR = interceptXHR;
  public static interceptXHRSend = interceptXHRSend;
  public static interceptXHROpen = interceptXHROpen;
}

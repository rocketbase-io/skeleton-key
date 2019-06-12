// tslint:disable:no-console

import {interceptXHR} from './request-interceptor';
import {SkeletonUser} from './user';
import {ensureCookie} from './cookie';

export * from './domain';
export * from './user';
export * from './request-interceptor';

export type AuthMethod = 'basic' | 'token' | 'cookie' | 'custom';

export interface SkeletonKeyOpts {
  interceptXHR?: boolean;
  domains?: string[];
  log?: boolean;
  authMethod?: AuthMethod;
}

export const SkeletonKeyDefaults: SkeletonKeyOpts = {
  interceptXHR: true,
  domains: ['*'],
  log: false,
  authMethod: 'basic'
};

export default class SkeletonKey {

  public static interceptXHR = interceptXHR;

  public domains: string[] = [];
  public log: boolean = false;
  public user?: SkeletonUser;

  constructor(opts?: SkeletonKeyOpts) {
    const options = {...SkeletonKeyDefaults, ...opts};

    this.domains = options.domains || ['*'];
    this.log = !!options.log;
    if (options.interceptXHR) SkeletonKey.interceptXHR(this);
  }

  public isLoggedIn(): boolean {
    return this.user != null;
  }

  public async login(user: string, password: string): Promise<false | SkeletonUser> {
    // TODO: Login
    return false;
  }

  public onXHROpen(xhr: XMLHttpRequest, method: string, url: string, async?: boolean, user?: string, password?: string) {
    if (this.log) console.log(`XHR OPEN: [${method}] "${url}" (${async ? 'async, ' : ''}${user}:${password})`, xhr);

    if (this.user) {
      const {headers, cookies, token, tokenCookie, tokenHeader} = this.user.getRequestOptions();
      Object.keys(headers).forEach(key => {
        xhr.setRequestHeader(key, headers[key]);
      });
      Object.keys(cookies).forEach(cookie => ensureCookie(cookie, cookies[cookie]));
      if (tokenCookie && token) ensureCookie(tokenCookie, token);
      if (tokenHeader && token) xhr.setRequestHeader(tokenHeader, token);
    }

    return [method, url, async, user, password];
  }

  public onXHRSend(xhr: XMLHttpRequest, body: any) {
    if (this.log) console.log(`XHR SEND: [${xhr.responseURL}] ${body}`, xhr);
    return body;
  }
}

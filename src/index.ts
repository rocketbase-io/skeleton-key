// tslint:disable:no-console

import {interceptXHR, RequestInterceptor} from './request-interceptor';
import {SkeletonUser} from './user';
import {ensureCookie} from './cookie';
import {Eventing} from './events';
import {BasicAuthLoginStrategy, LoginStrategy} from './login';

export * from './domain';
export * from './user';
export * from './request-interceptor';
export * from './events';
export * from './login';
export * from './types';

export interface SkeletonKeyOpts {
  interceptXHR?: boolean;
  domains?: string[];
  log?: boolean;

  loginStategy?(key: SkeletonKey): LoginStrategy;
}

export const SkeletonKeyDefaults: SkeletonKeyOpts = {
  interceptXHR: true,
  domains: ['*'],
  log: false,
};

export default interface SkeletonKey {
  on(event: 'login', callback: (user: SkeletonUser) => void): this;

  on(event: 'logout', callback: (user: SkeletonUser, reason: 'timeout' | 'logout') => void): this;

  on(event: 'action', callback:
    (user: SkeletonUser, req: XMLHttpRequest | [RequestInfo, RequestInit], method: string, url: string) => void): this;
}

export default class SkeletonKey extends Eventing(Object) implements RequestInterceptor {

  public static interceptXHR = interceptXHR;

  public domains: string[] = [];
  public log: boolean = false;
  public loginStrategy?: LoginStrategy;
  public user?: SkeletonUser;

  constructor(opts?: SkeletonKeyOpts) {
    super();
    const options = {...SkeletonKeyDefaults, ...opts};
    this.domains = options.domains || ['*'];
    this.log = !!options.log;
    this.loginStrategy = options.loginStategy ? options.loginStategy(this) : undefined;
    if (options.interceptXHR) SkeletonKey.interceptXHR(this);
  }

  public isLoggedIn(): boolean {
    return this.user != null;
  }

  public async login(user: string, password: string): Promise<false | SkeletonUser> {
    if (!this.loginStrategy) return false;
    const result = await this.loginStrategy.login(user, password);
    if (result) this.emit('login', this.user = result);
    return result;
  }

  public async logout(): Promise<boolean> {
    if (!this.loginStrategy) return false;
    const result = await this.loginStrategy.logout();
    if (result) {
      this.emit('logout', this.user, 'logout');
      delete this.user;
    }
    return result;
  }

  public async waitForLogin(): Promise<SkeletonUser> {
    return new Promise(resolve => this.once('login', resolve));
  }

  public onXHROpen(xhr: XMLHttpRequest, method: string, url: string, async?: boolean, user?: string, password?: string) {
    if (this.log) {
      console.log(`XHR OPEN: [${method}] "${url}" (${async ? 'async, ' : ''}${user || 'anonymous'}:${password || 'none'})`, xhr);
    }

    if (this.user && !this.user.isValid()) this.logout();

    this.emit('action', xhr, method, url);

    return [method, url, async, user, password];
  }

  public onXHRSend(xhr: XMLHttpRequest, body: any) {
    if (this.log) console.log(`XHR SEND: [${xhr.responseURL}] ${body}`, xhr);
    if (this.user && !this.user.isValid()) this.logout();
    if (this.user) {
      const {headers, cookies, token, tokenCookie, tokenHeader} = this.user.getRequestOptions();
      Object.keys(headers).forEach(key => {
        xhr.setRequestHeader(key, headers[key]);
      });
      Object.keys(cookies).forEach(cookie => ensureCookie(cookie, cookies[cookie]));
      if (tokenCookie && token) ensureCookie(tokenCookie, token);
      if (tokenHeader && token) xhr.setRequestHeader(tokenHeader, token);
      // this.user.getSessionOptions().lastAction = new Date();
    }
    return body;
  }

  public onFetch(input: any, init?: any): false | [RequestInfo, (RequestInit | undefined)] {
    const str = typeof input === 'string';
    // @ts-ignore
    const url = str ? input : input.url;
    // @ts-ignore
    const method = str ? init ? init.method || 'GET' : 'GET' : input.method || 'GET';

    if (this.user && !this.user.isValid()) this.logout();

    if (this.user) {
      const {headers, cookies, token, tokenCookie, tokenHeader} = this.user.getRequestOptions();
      Object.keys(headers).forEach(key => {
        if (init) {
          if (!init.headers) init.headers = {};
          init.headers[key] = headers[key];
        } else if (typeof input !== 'string') {
          if (!input.headers) input.headers = {};
          input.headers[key] = headers[key];
        } else {
          input = {url: input, headers: {[key]: headers[key]}};
        }
      });
      // TODO Cookies, Tokens, etc.
    }

    this.emit('action', [input, init], method, url);

    if (this.log) console.log(`FETCH: [${method}] "${url}"`, input, init);
    return [input, init];
  }
}

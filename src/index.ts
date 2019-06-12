// tslint:disable:no-console

import {interceptXHR} from './request-interceptor';
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
  on(event: 'action', callback: (user: SkeletonUser, req: XMLHttpRequest, method: string, url: string) => void): this;
}

export default class SkeletonKey extends Eventing(Object) {

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
    if (this.log) console.log(`XHR OPEN: [${method}] "${url}" (${async ? 'async, ' : ''}${user}:${password})`, xhr);

    if (this.user && !this.user.isValid()) delete this.user;

    if (this.user) {
      const {headers, cookies, token, tokenCookie, tokenHeader} = this.user.getRequestOptions();
      Object.keys(headers).forEach(key => {
        xhr.setRequestHeader(key, headers[key]);
      });
      Object.keys(cookies).forEach(cookie => ensureCookie(cookie, cookies[cookie]));
      if (tokenCookie && token) ensureCookie(tokenCookie, token);
      if (tokenHeader && token) xhr.setRequestHeader(tokenHeader, token);
      this.user.getSessionOptions().lastAction = new Date();
    }

    return [method, url, async, user, password];
  }

  public onXHRSend(xhr: XMLHttpRequest, body: any) {
    if (this.log) console.log(`XHR SEND: [${xhr.responseURL}] ${body}`, xhr);
    if (this.user && !this.user.isValid()) delete this.user;
    return body;
  }
}

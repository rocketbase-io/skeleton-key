import {SkeletonUser, SkeletonUserInfo} from './user';
import SkeletonKey from './index';

export interface LoginStrategy {
  login(user: string, password: string): Promise<false | SkeletonUser>;
  login(token: string): Promise<false | SkeletonUser>;

  logout(): Promise<boolean>;

  onXHROpen?(xhr: XMLHttpRequest, method: string, url: string, async?: boolean, user?: string, password?: string): void;
  onXHRSend?(xhr: XMLHttpRequest, body: any): void;
}

export class BasicAuthLoginStrategy implements LoginStrategy {
  constructor(private url: string, private key: SkeletonKey) {}

  public async login(user: string, password: string): Promise<false | SkeletonUser>;
  public async login(token: string): Promise<false | SkeletonUser>;
  public async login(user: string, password?: string): Promise<false | SkeletonUser> {
    if (!password) throw new Error('Username and Password required for basic auth');
    return new Promise((resolve, reject) => {
      const authHeader = `Basic ${btoa(`${user}:${password}`)}`;
      const req = new XMLHttpRequest();
      req.overrideMimeType('application/json');
      req.setRequestHeader('Authorization', authHeader);
      req.onload = () => {
        const resp: Partial<SkeletonUserInfo> = JSON.parse(req.responseText);
        resp.requestOptions = {
          headers: {
            Authorization: authHeader
          },
          cookies: {},
          token: ''
        };
        resolve(new SkeletonUser(resp as SkeletonUserInfo));
      };
      req.onerror = () => {
        reject(false);
      };
      req.open('GET', `${this.url}`);
    });
  }

  public async logout(): Promise<boolean> {
    return true;
  }
}

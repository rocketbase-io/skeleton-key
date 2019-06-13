import {SkeletonUser, SkeletonUserInfo} from './user';
import SkeletonKey from './index';
import {decode} from "./jwt";

export interface LoginStrategy {
  login(user: string, password: string): Promise<false | SkeletonUser>;
  login(token: string): Promise<false | SkeletonUser>;

  logout(): Promise<boolean>;

  onXHROpen?(xhr: XMLHttpRequest, method: string, url: string, async?: boolean, user?: string, password?: string): void;
  onXHRSend?(xhr: XMLHttpRequest, body: any): void;
}

export interface RocketCommonsAuthLoginResponse {
  jwtTokenBundle: {
    token: string;
    refreshToken: string;
  };
  user: {
    id: string;
    username: string;
    email: string;
    avatar: string;
    roles: string[];
    enabled: boolean;
    created: string;
    lastLogin: string;
  };
}

export class RocketCommonsAuth implements LoginStrategy {
  constructor(private url: string, private key: SkeletonKey) {}

  public async login(user: string, password: string): Promise<false | SkeletonUser>;
  public async login(token: string): Promise<false | SkeletonUser>;
  public async login(username: string, password?: string): Promise<false | SkeletonUser> {
    if (!password) throw new Error('Username and Password required for basic auth');
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();
      req.overrideMimeType('application/json');
      req.onload = () => {
        const res: RocketCommonsAuthLoginResponse = JSON.parse(req.responseText);
        const jwt = decode(res.jwtTokenBundle.token);
        const expiry = jwt.payload.exp ? +new Date() - +new Date(jwt.payload.exp) : undefined;
        resolve(new SkeletonUser({
          name: res.user.username,
          props: {
            id: res.user.id,
            email: res.user.email,
            username: res.user.username,
            avatar: res.user.avatar,
            created: res.user.created,
            lastLogin: res.user.lastLogin,
            enabled: res.user.enabled,
            jwtData: jwt.payload
          },
          flags: {
            enabled: res.user.enabled
          },
          roles: res.user.roles,
          groups: [],
          admin: res.user.roles.indexOf('ADMIN') !== -1,
          sessionOptions: {
            lastAction: new Date(),
            firstAction: new Date(),
            maxInactiveMs: expiry
          },
          requestOptions: {
            token: res.jwtTokenBundle.token,
            headers: {},
            cookies: {}
          }
        }));
      };
      req.onerror = () => {
        resolve(false);
      };

      req.open('POST', `${this.url}/auth/login`);
      req.send(JSON.stringify({
        username,
        password
      }));
    });
  }

  public async logout(): Promise<boolean> {
    // TODO
    return true;
  }
}

export class DigestAuthLoginStragegy implements LoginStrategy {
  constructor(private url: string, private key: SkeletonKey) {}

  public async login(user: string, password: string): Promise<false | SkeletonUser>;
  public async login(token: string): Promise<false | SkeletonUser>;
  public async login(user: string, password?: string): Promise<false | SkeletonUser> {
    if (!password) throw new Error('Username and Password required for basic auth');
    // TODO
    return false;
  }

  public async logout(): Promise<boolean> {
    // TODO
    return true;
  }

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

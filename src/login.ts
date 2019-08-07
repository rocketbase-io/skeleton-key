import {SkeletonUser, SkeletonUserInfo} from './user';
import SkeletonKey, {IRegisterInfo} from './index';
import {decode} from './jwt';

export interface LoginStrategy {
  login(user: string, password: string): Promise<false | SkeletonUser>;

  login(token: string): Promise<false | SkeletonUser>;

  logout(): Promise<boolean>;

  // register(): Promise<false | SkeletonUserInfo>;

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

export interface RocketCommonsAuthOptions {
  url: string;
  authHeader?: string;
  authPrefix?: string;
  autoRefresh?: boolean;
  timedRefresh?: boolean;
}

export class RocketCommonsAuth implements LoginStrategy {

  public url: string;
  public authHeader: string = 'Authorization';
  public authPrefix: string = 'Bearer ';
  public autoRefresh: boolean = false;
  public timedRefresh: boolean = false;

  private intervalId?: number;

  constructor(opts: RocketCommonsAuthOptions, public key: SkeletonKey) {
    this.url = opts.url;
    if (opts.authHeader) this.authHeader = opts.authHeader;
    if (opts.authPrefix) this.authPrefix = opts.authPrefix;
    if (opts.autoRefresh) this.autoRefresh = true;
    if (opts.timedRefresh) this.timedRefresh = true;
    key.on('action', this.onAction.bind(this));
  }

  public async onAction(user: SkeletonUser) {
    if (this.autoRefresh && this.needsRefresh(user.info)) await this.refreshToken(user.info);
  }

  public scheduleTimedRefresh(info: SkeletonUserInfo): void {
    if (this.intervalId != null) this.intervalId = clearInterval(this.intervalId) as undefined;
    if (!info.sessionOptions.maxInactiveMs) return;
    setInterval(() => {
      this.refreshToken(info);
    }, info.sessionOptions.maxInactiveMs / 2);
  }

  public needsRefresh(info: SkeletonUserInfo): boolean {
    if (!info.sessionOptions.maxInactiveMs) return false;
    return new Date() > new Date(info.sessionOptions.maxInactiveMs);
  }

  public async refreshToken(info: SkeletonUserInfo): Promise<boolean> {
    if (!new SkeletonUser(info).isValid()) return false;
    return new Promise(resolve => {
      const req = new XMLHttpRequest();
      req.overrideMimeType('text/plain');
      req.onload = () => {
        const token = req.responseText;
        const parsed = decode(token);
        const expiry = parsed.payload.exp ? +new Date() - +new Date(parsed.payload.exp) : undefined;
        info.requestOptions.headers[this.authHeader] = `${this.authPrefix}${token}`;
        info.requestOptions.token = token;
        info.props.jwtToken = token;
        info.props.jwtData = parsed.payload;
        info.sessionOptions.maxInactiveMs = expiry;
        info.sessionOptions.lastAction = new Date();
        resolve(true);
      };
      req.onerror = () => resolve(false);
      req.open('GET', `${this.url}/auth/refresh`);
      req.send();
    });
  }

  public async register(info: IRegisterInfo<any>): Promise<false | SkeletonUserInfo> {
    if (!info) throw new Error('Registration info required');
    return new Promise(((resolve, reject) => {
      const req = new XMLHttpRequest();
      req.overrideMimeType('application/json');
      req.onload = () => {
        const res: RocketCommonsAuthLoginResponse = JSON.parse(req.responseText);
        const newInfo: any = {
          name: res.user.username,
          props: {
            ...res.user
          },
          flags: {
            enabled: res.user.enabled,
          }
        };
      };
    }));
  }

  public async login(user: string, password: string): Promise<false | SkeletonUser>;
  public async login(token: string): Promise<false | SkeletonUser>;
  public async login(username: string, password?: string): Promise<false | SkeletonUser> {
    if (!password) throw new Error('Username and Password required');
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();
      req.overrideMimeType('application/json');
      req.onload = () => {
        const res: RocketCommonsAuthLoginResponse = JSON.parse(req.responseText);
        const jwt = decode(res.jwtTokenBundle.token);
        const jwtRefresh = decode(res.jwtTokenBundle.refreshToken);
        const expiry = jwt.payload.exp ? +new Date() - +new Date(jwt.payload.exp) : undefined;
        const totalExpiry = jwtRefresh.payload.exp ? +new Date() - +new Date(jwt.payload.exp) : undefined;
        const info: SkeletonUserInfo = {
          name: res.user.username,
          props: {
            id: res.user.id,
            email: res.user.email,
            username: res.user.username,
            avatar: res.user.avatar,
            created: res.user.created,
            lastLogin: res.user.lastLogin,
            enabled: res.user.enabled,
            jwtToken: res.jwtTokenBundle.refreshToken,
            jwtData: jwt.payload,
            jwtRefreshToken: res.jwtTokenBundle.refreshToken,
            jwtRefreshData: jwtRefresh.payload,
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
            maxInactiveMs: expiry,
            maxSessionMs: totalExpiry
          },
          requestOptions: {
            token: res.jwtTokenBundle.token,
            headers: {
              [this.authHeader]: `${this.authPrefix} ${res.jwtTokenBundle.token}`
            },
            cookies: {}
          }
        };
        if (this.timedRefresh) this.scheduleTimedRefresh(info);
        resolve(new SkeletonUser(info));
      };
      req.onerror = () => {
        resolve(false);
      };

      req.open('POST', `${this.url}/auth/login`);
      req.setRequestHeader('Content-Type', 'application/json');
      req.send(JSON.stringify({
        username,
        password
      }).replace(/\s*/g, ''));
    });
  }

  public async logout(): Promise<boolean> {
    // TODO
    return true;
  }
}

export class DigestAuthLoginStragegy implements LoginStrategy {
  constructor(private url: string, private key: SkeletonKey) {
  }

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
  constructor(private url: string, private key: SkeletonKey) {
  }

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

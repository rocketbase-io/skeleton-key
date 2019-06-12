

export interface SkeletonRequestOptions {
  token: string;
  tokenHeader?: string;
  tokenCookie?: string;
  headers: {[key: string]: string};
  cookies: {[key: string]: string};
}

export interface SkeletonSessionOptions {
  firstAction: Date;
  lastAction: Date;
  maxInactiveMs?: number;
  maxSessionMs?: number;
}

export interface SkeletonUserInfo {
  name: string;
  props: {[key: string]: string};
  flags: {[key: string]: boolean};
  roles: string[];
  groups: string[];
  admin: boolean;
  requestOptions: SkeletonRequestOptions;
  sessionOptions: SkeletonSessionOptions;
}

export class SkeletonUser {

  constructor(
    private info: SkeletonUserInfo
  ) {}

  public isValid() {
    const now = new Date();
    return this.info.sessionOptions.maxSessionMs
      ? (+this.info.sessionOptions.firstAction + this.info.sessionOptions.maxSessionMs < +now)
      : this.info.sessionOptions.maxInactiveMs
      ? (+this.info.sessionOptions.maxInactiveMs + this.info.sessionOptions.maxInactiveMs < +now)
      : true;
  }

  public hasRole(role: string): boolean {
    return this.info.roles.indexOf(role) !== -1;
  }

  public hasGroup(group: string): boolean {
    return this.info.groups.indexOf(group) !== -1;
  }

  public isAdmin(): boolean {
    return this.info.admin;
  }

  public getFlag(flag: string): boolean {
    return this.info.flags[flag];
  }

  public getProperty(property: string): string {
    return this.info.props[property];
  }

  public getName(): string {
    return this.info.name;
  }

  public getRequestOptions(): SkeletonRequestOptions {
    return this.info.requestOptions;
  }

  public getSessionOptions(): SkeletonSessionOptions {
    return this.info.sessionOptions;
  }

  public getProperties<T extends string>(...keys: T[]): {[key in T]: string} {
    const props = Array.prototype.slice.apply(keys);
    return Object
      .keys(this.info.props)
      .filter(key => props.indexOf(key) !== -1)
      .reduce((allProps, key) => {
        allProps[key as T] = this.info.props[key];
        return allProps;
      }, {} as {[key in T]: string});
  }

  public getFlags<T extends string>(...keys: T[]): {[key in T]: boolean} {
    const props = Array.prototype.slice.apply(keys);
    return Object
      .keys(this.info.flags)
      .filter(key => props.indexOf(key) !== -1)
      .reduce((allProps, key) => {
        allProps[key as T] = this.info.flags[key];
        return allProps;
      }, {} as {[key in T]: boolean});
  }
}

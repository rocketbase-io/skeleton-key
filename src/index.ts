import {AuthClient} from "./client";
import {installInterceptors, Interceptor, interceptors} from "./intercept";
import {Eventing} from "./events";
import {AppUserRead, JwtBundle} from "./model";
import {decode, JsonWebToken, JsonWebTokenPayload} from "./jwt";
import {only} from "./util";

export * from "./model";
export * from "./client";
export * from "./jwt";
export * from "./intercept";
export * from "./domain";
export * from "./events";
export * from "./types";
export * from "./util";

export const JWT_DATE_TO_JS_DATE_RATIO = 1000;

export interface SkeletonKeyOptions {
  url?: string;
  client?: AuthClient;
  domains?: string[];
  intercept?: boolean;
  renewType?: "action" | "never";
  authHeader?: string;
  authPrefix?: string;
  authSuffix?: string;
  storageKey?: string;
}

export const SkeletonKeyDefaults: Readonly<SkeletonKeyOptions> = {
  url: window.location.origin,
  domains: [window.location.host],
  intercept: true,
  renewType: "action",
  authHeader: "Authorization",
  authPrefix: "Bearer ",
  authSuffix: "",
  storageKey: "io.rocketbase.commons.auth"
};

export class SkeletonKey<USER_DATA = object, TOKEN_DATA = object> extends Eventing<"login" | "logout" | "action" | "refresh">()
  implements Interceptor, Required<SkeletonKeyOptions> {

  public url!: string;
  public client!: AuthClient;
  public domains!: string[];
  public intercept!: boolean;
  public renewType!: "action" | "never";
  public authHeader!: string;
  public authPrefix!: string;
  public authSuffix!: string;
  public storageKey!: string;

  public user?: AppUserRead & USER_DATA;
  public jwtBundle?: JwtBundle;

  constructor(opts: SkeletonKeyOptions = {}) {
    super();
    Object.assign(this, {...SkeletonKeyDefaults, ...opts});
    if (!this!.client) this.client = new AuthClient(this!.url!);
    this.load();
    this.bindMethods();
    this.installListeners();
  }

  public bindMethods() {
    this.onAction = this.onAction.bind(this);
    this.onFetch = this.onFetch.bind(this);
    this.onXhrOpen = this.onXhrOpen.bind(this);
    this.onXhrSend = this.onXhrSend.bind(this);
  }

  public installListeners() {
    this.on("action", this.onAction);
    if (this.intercept) {
      interceptors.push(this);
      installInterceptors();
    }
  }

  public isLoggedIn() {
    return !!this.user && !!this.jwtBundle && (!this.needsRefresh() || this.canRefresh());
  }

  public async login(username: string, password: string) {
    if (this.isLoggedIn()) await this.logout();
    const {jwtTokenBundle, user} = await this.client.login({username, password});
    this.jwtBundle = jwtTokenBundle as JwtBundle & TOKEN_DATA;
    this.user = user as AppUserRead & USER_DATA;
    this.emit("login", user);
    this.persist();
    return user;
  }

  public async logout() {
    this.user = undefined;
    this.jwtBundle = undefined;
    this.emit("logout");
    this.persist();
    return true;
  }

  public async waitForLogin() {
    if (this.isLoggedIn()) return this.user!;
    return new Promise(resolve => this.once("login", resolve));
  }

  public async refreshToken() {
    if (!this.jwtBundle) return false;
    this.jwtBundle!.token = await this.client.refresh(this.jwtBundle!.refreshToken);
    this.emit("refresh", "token", this.jwtBundle);
    this.persist();
    return this.jwtBundle;
  }

  public async refreshInfo() {
    if (!this.isLoggedIn()) return false;
    this.user = await this.client.me(this.jwtBundle!.token) as AppUserRead & USER_DATA;
    this.emit("refresh", "user", this.user);
    this.persist();
    return this.user;
  }

  public needsRefresh() {
    if (!this.jwtBundle) return true;
    return new Date(this.tokenData.payload.exp! * JWT_DATE_TO_JS_DATE_RATIO) < new Date();
  }

  public canRefresh() {
    if (!this.jwtBundle) return false;
    return new Date(this.refreshTokenData.payload.exp! * JWT_DATE_TO_JS_DATE_RATIO) > new Date();
  }

  public get userData() {
    return this.user;
  }

  public get tokenData() {
    return decode(this.jwtBundle!.token) as JsonWebToken & { payload: TOKEN_DATA };
  }

  public get refreshTokenData() {
    return decode(this.jwtBundle!.refreshToken);
  }


  public persist() {
    if (this.isLoggedIn())
      localStorage.setItem(this.storageKey, JSON.stringify(only(this, "jwtBundle", "user")));
    else
      localStorage.removeItem(this.storageKey);
  }

  public load() {
    if (!this.isLoggedIn()) {
      const item = localStorage.getItem(this.storageKey);
      if (!item) return;
      try {
        Object.assign(this, only(JSON.parse(item), "jwtBundle", "user") as any);
      } catch (ex) {
        // Make sure invalid data isn't kept
        this.persist();
      }
    }
  }

  private get renewUrl() {
    return `${this.url}/auth/renew`;
  }

  public async onAction(type: string, url: string) {
    if (!url) return;
    // Prevent infinite renew loop
    if (url.indexOf(this.renewUrl) !== -1) return;
    if (this.renewType === "action" && this.needsRefresh() && this.canRefresh())
      await this.refreshToken();
  }

  private get authHeaderValue() {
    return `${this.authPrefix}${this.jwtBundle!.token!}${this.authSuffix}`;
  }


  public onFetch(ctx: any, input: Request | string, init?: RequestInit): any {
    this.emitSync("action", "fetch", typeof input === "string" ? input : input.url, input, init);
    if (!this.jwtBundle) return arguments;
    if (!init) init = {};
    if (!init.headers) init.headers = {};
    if (init.headers instanceof Headers && !init.headers.get(this.authHeader))
      init.headers.set(this.authHeader, this.authHeaderValue);
    else
      (init.headers as any)[this.authHeader] = this.authHeaderValue;
    return arguments;
  }

  public onXhrSend(xhr: XMLHttpRequest, body: any): any {
    this.emitSync("action", "send", (xhr as any).__openArgs[1], xhr, body);
    this.xhrSetAuthHeader(xhr);
    return arguments;
  }

  private xhrSetAuthHeader(xhr: XMLHttpRequest) {
    if (this.jwtBundle && (!(xhr as any).__headers || !(xhr as any).__headers[this.authHeader]))
      xhr.setRequestHeader(this.authHeader, this.authHeaderValue);
  }
}








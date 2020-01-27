import { AuthClient } from "./client";
import { installInterceptors, Interceptor, interceptors } from "./intercept";
import { Eventing } from "./events";
import { AppUserRead, JwtBundle } from "./model";
import { decode, JsonWebToken } from "./jwt";
import { only, urlMatches } from "./util";

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
  renewType?: "action" | "never" | "interval";
  authHeader?: string;
  authPrefix?: string;
  authSuffix?: string;
  storageKey?: string;
  initialLoginCheck?: boolean;
}

export const SkeletonKeyDefaults: Readonly<SkeletonKeyOptions> = {
  url: window.location.origin,
  domains: [window.location.host],
  intercept: true,
  initialLoginCheck: true,
  renewType: "action",
  authHeader: "Authorization",
  authPrefix: "Bearer ",
  authSuffix: "",
  storageKey: "io.rocketbase.commons.auth"
};

const INTERVAL_TOLERANCE = 10000; // 10s

export class SkeletonKey<USER_DATA = object, TOKEN_DATA = object>
  extends Eventing<"login" | "logout" | "action" | "refresh" | "initialized">()
  implements Interceptor, Required<SkeletonKeyOptions> {
  public url!: string;
  public client!: AuthClient;
  public domains!: string[];
  public intercept!: boolean;
  public renewType!: "action" | "never" | "interval";
  public authHeader!: string;
  public authPrefix!: string;
  public authSuffix!: string;
  public storageKey!: string;
  public initialLoginCheck!: boolean;

  public user?: AppUserRead & USER_DATA;
  public jwtBundle?: JwtBundle;
  public initialized = false;

  constructor(opts: SkeletonKeyOptions = {}) {
    super();
    Object.assign(this, { ...SkeletonKeyDefaults, ...opts });
    if (!this!.client) this.client = new AuthClient(this!.url!);
    // noinspection JSIgnoredPromiseFromCall
    this.init();
  }

  public async init() {
    this.load();
    this.bindMethods();
    this.installListeners();
    if (this.isLoggedIn() && this.initialLoginCheck) await this.refreshInfo();
    await this.installInterval();
    this.emit("initialized", this);
  }

  public bindMethods() {
    this.onAction = this.onAction.bind(this);
    this.onFetch = this.onFetch.bind(this);
    this.onXhrSend = this.onXhrSend.bind(this);
    this.onInitialize = this.onInitialize.bind(this);
    this.installInterval = this.installInterval.bind(this);
  }

  public installListeners() {
    this.on("action", this.onAction);
    this.on("login", this.installInterval);
    this.on("initialized", this.onInitialize);
    if (this.intercept) {
      interceptors.push(this);
      installInterceptors();
    }
  }

  public async installInterval() {
    if (this.renewType !== "interval") return;
    if (!this.isLoggedIn()) return;
    if (this.needsRefresh()) await this.refreshToken();
    const ms = +new Date(this.tokenData.payload.exp! * JWT_DATE_TO_JS_DATE_RATIO) - +new Date();
    if (ms < INTERVAL_TOLERANCE * 2) await this.refreshToken();
    setTimeout(this.installInterval, ms - INTERVAL_TOLERANCE);
  }

  public isLoggedIn() {
    return !!this.user && !!this.jwtBundle && (!this.needsRefresh() || this.canRefresh());
  }

  public async login(username: string, password: string) {
    if (this.isLoggedIn()) await this.logout();
    const { jwtTokenBundle, user } = await this.client.login({ username, password });
    this.jwtBundle = jwtTokenBundle as JwtBundle & TOKEN_DATA;
    this.user = user as AppUserRead & USER_DATA;
    this.emitSync("login", user);
    this.persist();
    return user;
  }

  public async logout() {
    this.user = undefined;
    this.jwtBundle = undefined;
    this.emitSync("logout");
    this.persist();
    return true;
  }

  public async waitForLogin() {
    if (this.isLoggedIn()) return this.user!;
    return this.waitForEvent("login");
  }

  public async ensureInitialized() {
    if (this.initialized) return this;
    return this.waitForEvent("initialized");
  }

  public async refreshToken() {
    return this.refreshSection("token");
  }

  public async refreshInfo() {
    return this.refreshSection("user");
  }

  public async refreshSection(section: "user" | "token") {
    if (section === "user" ? !this.isLoggedIn() : !this.jwtBundle) return false;
    try {
      if (section === "user") {
        this.emitSync(
          "refresh",
          section,
          (this.user = (await this.client.me(this.jwtBundle!.token)) as AppUserRead & USER_DATA)
        );
        this.persist();
      } else {
        this.jwtBundle!.token = await this.client.refresh(this.jwtBundle!.refreshToken);
        this.emitSync("refresh", section, this.jwtBundle);
        this.persist();
      }
    } catch ({ response: { status } }) {
      // Forbidden / Unauthorized / Bad Request
      if (status && [400, 401, 403].indexOf(status) !== -1) await this.logout();
    }
    return section === "user" ? this.user : this.jwtBundle;
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
    if (this.isLoggedIn()) localStorage.setItem(this.storageKey, JSON.stringify(only(this, "jwtBundle", "user")));
    else localStorage.removeItem(this.storageKey);
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
    return `${this.url}/auth/refresh`;
  }

  public async onAction(type: string, url: string) {
    // Prevent infinite renew loop
    if (!url || urlMatches(url, this.renewUrl)) return;
    if (this.renewType === "action" && this.needsRefresh() && this.canRefresh()) await this.refreshToken();
  }

  public async onInitialize() {
    this.initialized = true;
  }

  private get authHeaderValue() {
    return `${this.authPrefix}${this.jwtBundle!.token!}${this.authSuffix}`;
  }

  public onFetch(ctx: any, input: Request | string, init?: RequestInit): any {
    this.emitSync("action", "fetch", typeof input === "string" ? input : input.url, input, init);
    // eslint-disable-next-line prefer-rest-params
    if (!this.jwtBundle) return arguments;
    if (!init) init = {};
    if (!init.headers) init.headers = {};
    (init.headers as any)[this.authHeader] = this.authHeaderValue;
    return [ctx, input, init];
  }

  public onXhrSend(xhr: XMLHttpRequest, body: any): any {
    this.emitSync("action", "send", (xhr as any).__openArgs[1], xhr, body);
    this.xhrSetAuthHeader(xhr);
    // eslint-disable-next-line prefer-rest-params
    return arguments;
  }

  private xhrSetAuthHeader(xhr: XMLHttpRequest) {
    if (this.jwtBundle && (!(xhr as any).__headers || !(xhr as any).__headers[this.authHeader]))
      xhr.setRequestHeader(this.authHeader, this.authHeaderValue);
  }
}

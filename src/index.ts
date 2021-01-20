import { AuthDataBundle, AuthStore, StorageAuthStore } from "@/auth-store";
import { AuthClient } from "./client";
import { installInterceptors, Interceptor, interceptors } from "./intercept";
import { Eventing } from "./events";
import { AppUserRead, JwtBundle } from "./model";
import { decode, JsonWebToken } from "./jwt";
import { only, urlMatches } from "./util";
import { Deferred, deferred } from "@/deferred";

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
  url: string;
  client?: AuthClient;
  domains: string[];
  intercept?: boolean;
  renewType?: "action" | "never" | "interval";
  authHeader?: string;
  authPrefix?: string;
  authSuffix?: string;
  storageKey?: string;
  store?: AuthStore;
  initialLoginCheck?: boolean;
}

export const SkeletonKeyDefaults: Readonly<Omit<SkeletonKeyOptions, "url" | "domains">> = {
  intercept: true,
  initialLoginCheck: true,
  renewType: "action",
  authHeader: "Authorization",
  authPrefix: "Bearer ",
  authSuffix: "",
  storageKey: "io.rocketbase.commons.auth",
  store: new StorageAuthStore(localStorage),
};

const INTERVAL_TOLERANCE = 10000; // 10s

export class SkeletonKey<USER_DATA = unknown, TOKEN_DATA = unknown>
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
  public store!: AuthStore;
  public initialLoginCheck!: boolean;

  public user?: AppUserRead & USER_DATA;
  public jwtBundle?: JwtBundle;
  public initialized = false;
  public refreshing?: Deferred<any>;

  constructor(opts: SkeletonKeyOptions) {
    super();
    const allOpts = { ...SkeletonKeyDefaults, ...opts };
    for (const key in allOpts) (this as any)[key] = (allOpts as any)[key];
    if (!this.client) this.client = new AuthClient(this.url!);
    // noinspection JSIgnoredPromiseFromCall
    this.init();
  }

  public setUrl(url: string): void {
    this.url = url;
    this.client.baseUrl = url;
  }

  public async init(): Promise<void> {
    this.bindMethods();
    this.installListeners();
    await this.load();
    if (this.isLoggedIn() && this.initialLoginCheck) await this.refreshInfo();
    await this.installInterval();
    this.emit("initialized", this);
  }

  public bindMethods(): void {
    this.onAction = this.onAction.bind(this);
    this.onFetch = this.onFetch.bind(this);
    this.onXhrSend = this.onXhrSend.bind(this);
    this.onInitialize = this.onInitialize.bind(this);
    this.installInterval = this.installInterval.bind(this);
  }

  public installListeners(): void {
    this.on("action", this.onAction);
    this.on("login", this.installInterval);
    this.on("initialized", this.onInitialize);
    if (this.intercept) {
      interceptors.push(this);
      installInterceptors();
    }
  }

  public async installInterval(): Promise<void> {
    if (this.renewType !== "interval") return;
    if (!this.isLoggedIn()) return;
    if (this.needsRefresh()) await this.refreshToken();
    const ms = +new Date(this.tokenData.payload.exp! * JWT_DATE_TO_JS_DATE_RATIO) - +new Date();
    if (ms < INTERVAL_TOLERANCE * 2) await this.refreshToken();
    setTimeout(this.installInterval, ms - INTERVAL_TOLERANCE);
  }

  public isLoggedIn(): boolean {
    return !!this.user && !!this.jwtBundle && (!this.needsRefresh() || this.canRefresh());
  }

  public async loginWithToken(token: string, refreshToken?: string): Promise<AppUserRead & USER_DATA> {
    if (this.isLoggedIn()) await this.logout();
    try {
      this.jwtBundle = { token, refreshToken };
      const user = (this.user = (await this.client.me(token)) as AppUserRead & USER_DATA);
      await this.persist();
      this.emitSync("login", user);
    } catch (ex) {
      await this.logout();
    }
    return this.userData;
  }

  public async login(username: string, password: string): Promise<AppUserRead & USER_DATA> {
    if (this.isLoggedIn()) await this.logout();
    const { jwtTokenBundle, user } = await this.client.login({ username, password });
    this.jwtBundle = jwtTokenBundle as JwtBundle & TOKEN_DATA;
    this.user = user as AppUserRead & USER_DATA;
    this.emitSync("login", user);
    await this.persist();
    return user as AppUserRead & USER_DATA;
  }

  public async logout(): Promise<boolean> {
    this.user = undefined;
    this.jwtBundle = undefined;
    this.emitSync("logout");
    await this.persist();
    return true;
  }

  public async waitForLogin(): Promise<void> {
    if (this.isLoggedIn()) return;
    await this.waitForEvent("login");
  }

  public async ensureInitialized(): Promise<void> {
    if (this.initialized) return;
    await this.waitForEvent("initialized");
  }

  public async refreshToken(): Promise<JwtBundle | boolean> {
    if (!this.jwtBundle?.refreshToken) return false;
    if (this.refreshing) return this.refreshing;
    this.refreshing = deferred();
    try {
      this.jwtBundle!.token = await this.client.refresh(this.jwtBundle!.refreshToken!);
      this.emitSync("refresh", "token", this.jwtBundle);
      this.refreshing.resolve(this.jwtBundle);
    } catch ({ response: { status } }) {
      await this.handleStatus(status);
      this.refreshing.reject(status);
    }
    this.refreshing = undefined;
    return this.jwtBundle;
  }

  public async refreshInfo(): Promise<(AppUserRead & USER_DATA) | false> {
    if (!this.isLoggedIn()) return false;
    if (this.needsRefresh()) await this.refreshToken();
    try {
      this.user = (await this.client.me(this.jwtBundle!.token)) as AppUserRead & USER_DATA;
      this.emitSync("refresh", "user", this.user);
      await this.persist();
    } catch (ex) {
      const {
        response: { status },
      } = ex;
      await this.handleStatus(status);
    }
    return this.user!;
  }

  public async handleStatus(status: number, shouldLogout = true): Promise<void> {
    if (status && [400, 401, 403].indexOf(status) !== -1 && shouldLogout) await this.logout();
  }

  public needsRefresh(): boolean {
    if (!this.jwtBundle) return true;
    return new Date(this.tokenData.payload.exp! * JWT_DATE_TO_JS_DATE_RATIO) < new Date();
  }

  public canRefresh(): boolean {
    if (!this.jwtBundle?.refreshToken) return false;
    return new Date(this.refreshTokenData.payload.exp! * JWT_DATE_TO_JS_DATE_RATIO) > new Date();
  }

  public get userData(): AppUserRead & USER_DATA {
    return this.user!;
  }

  public get tokenData(): JsonWebToken & { payload: TOKEN_DATA } {
    return decode(this.jwtBundle!.token) as JsonWebToken & { payload: TOKEN_DATA };
  }

  public get refreshTokenData(): JsonWebToken {
    return decode(this.jwtBundle!.refreshToken!);
  }

  public async persist(): Promise<void> {
    if (this.isLoggedIn()) await this.store.setData(this.storageKey, only(this, "jwtBundle", "user") as AuthDataBundle);
    else await this.store.removeData(this.storageKey);
  }

  public async load(): Promise<void> {
    if (!this.isLoggedIn()) {
      const data = await this.store.getData(this.storageKey);
      if (!data) return await this.persist();
      Object.assign(this, only(data, "jwtBundle", "user"));
    }
  }

  private get renewUrl(): string {
    return `${this.url}/auth/refresh`;
  }

  public async onAction(type: string, url: string): Promise<void> {
    // Prevent infinite renew loop
    if (!url || urlMatches(url, this.renewUrl)) return;
    if (this.renewType === "action" && this.needsRefresh() && this.canRefresh()) await this.refreshToken();
  }

  public onInitialize(): void {
    this.initialized = true;
  }

  private get authHeaderValue(): string {
    return `${this.authPrefix}${this.jwtBundle!.token!}${this.authSuffix}`;
  }

  public onFetch(ctx: unknown, input: Request | string, init?: RequestInit): any {
    this.emitSync("action", "fetch", typeof input === "string" ? input : input.url, input, init);
    // eslint-disable-next-line prefer-rest-params
    if (!this.jwtBundle) return arguments;
    if (!init) init = {};
    if (!init.headers) init.headers = {};
    (init.headers as any)[this.authHeader] = this.authHeaderValue;
    return [ctx, input, init];
  }

  public async onXhrSend(xhr: XMLHttpRequest, body: unknown): Promise<any> {
    await this.emit("action", "send", (xhr as any).__openArgs[1], xhr, body);
    this.xhrSetAuthHeader(xhr);
    // eslint-disable-next-line prefer-rest-params
    return arguments;
  }

  private xhrSetAuthHeader(xhr: XMLHttpRequest) {
    if (this.jwtBundle && (!(xhr as any).__headers || !(xhr as any).__headers[this.authHeader]))
      xhr.setRequestHeader(this.authHeader, this.authHeaderValue);
  }
}

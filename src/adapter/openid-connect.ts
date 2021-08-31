import { SkeletonReceiveConfig } from "@/base";
import { PromiseOr, SkeletonAdapter, SkeletonContext, SkeletonKey } from "@/types";
import axios, { AxiosInstance } from "axios";
import qs from "querystring";

export interface OpenidConnectOptions {
  endpoint: string;
  client: string;
  secret?: string;
  axios?: AxiosInstance;
}

interface OpenidConfig {
  issuerUrl: string;
  loginUrl: string;
  jwksUrl: string;
  tokenUrl: string;
  introspectionUrl: string;
  revocationUrl: string;
  userUrl?: string;
  registrationUrl?: string;
}

function randomString(len: number): string {
  if (typeof crypto === "undefined") {
    return Array(len)
      .fill(undefined)
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join("");
  }
  const arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

interface OpenidCallMeta {
  state: string;
  currentUrl: string;
  target?: string;
  newTab: boolean;
  url: string;
  action: "login" | "logout" | "register" | "other";
}

export function openidConnect<Key extends string = "openidConnect">(
  options: OpenidConnectOptions,
  key?: Key
): SkeletonAdapter {
  const callbackKey = `openid-callback${key ? `-${key}` : ""}`;
  const configKey = `openid-config${key ? `-${key}` : ""}`;
  const refreshKey = `openid-refresh-token${key ? `-${key}` : ""}`;
  const accessKey = `openid-access-token${key ? `-${key}` : ""}`;
  const { endpoint = "/", client: client_id, secret, axios: rest = axios.create() } = options;

  async function fetchConfiguration(): Promise<OpenidConfig> {
    const response = await rest.get(`${endpoint}/.well-known/openid-configuration`);
    const {
      issuer: issuerUrl,
      authorization_endpoint: loginUrl,
      jwks_uri: jwksUrl,
      token_endpoint: tokenUrl,
      introspection_endpoint: introspectionUrl,
      revocation_endpoint: revocationUrl,
      userinfo_endpoint: userUrl,
      registration_endpoint: registrationUrl,
    } = response.data;
    return {
      issuerUrl,
      loginUrl,
      jwksUrl,
      tokenUrl,
      introspectionUrl,
      revocationUrl,
      userUrl,
      registrationUrl,
    };
  }

  function url(key: keyof OpenidConfig, context: SkeletonContext): string {
    return ((context as unknown as Record<string, unknown>)[configKey] as OpenidConfig)[key] as string;
  }

  function redirectUri(target: string, params: Record<string, unknown> = {}): string {
    const url = new URL(target);
    for (const [name, value] of Object.entries(params)) url.searchParams.set(name, String(value));
    return url.href;
  }

  // und noch wegen skeleton-key das weitere vorgehen, aber das können wir auch morgen noch besprechen

  async function login(this: SkeletonKey, currentUrl: string, target?: string, newTab = true) {
    const context = this.internal.getContext();
    const state = randomString(32);
    const callMeta: OpenidCallMeta = {
      state,
      currentUrl,
      target,
      url: redirectUri(url("loginUrl", context), { redirect_url: target ?? currentUrl, client_id }),
      newTab,
      action: "login",
    };
    this.persist?.(callbackKey, callMeta);
    openTab(callMeta.url, {
      location: false,
      menubar: false,
      status: false,
      toolbar: false,
    });
  }

  async function handleLogin(meta: OpenidCallMeta, current: URL, context: SkeletonContext) {
    const response = await rest.post(
      url("tokenUrl", context),
      qs.stringify({
        grant_type: "authorization_code",
        redirect_uri: meta.target ?? meta.currentUrl,
        code: current.searchParams.get("code"),
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    const { refresh_token, access_token } = response.data;
    const tokens = { [refreshKey]: refresh_token, [accessKey]: access_token };
    const userUrl = url("userUrl", context);
    const user = userUrl ? (await rest.get(userUrl)).data : undefined;
    context.auth.internal.setContext({ user, tokens }, "login");
  }

  // Call this on receiving endpoints
  async function receive(this: SkeletonKey, currentUrl: string): Promise<SkeletonReceiveConfig> {
    const context = this.internal.getContext();
    const current = new URL(currentUrl);
    const state = current.searchParams.get("state");
    const callMeta = this.read?.<OpenidCallMeta>(callbackKey);

    // todo: also check callback url
    if (!callMeta || callMeta.state !== state) {
      this.persist?.(callbackKey, null);
      throw new Error("State did not match! Was this call made by SkeletonKey?");
    }

    switch (callMeta.action) {
      case "login":
        await handleLogin(callMeta, current, context);
        break;
      case "logout":
        this.internal.setContext({ user: undefined, tokens: { [key ?? "openidConnect"]: undefined } }, "logout");
        break;
    }

    return { close: callMeta.newTab, redirect: currentUrl !== callMeta.target ? callMeta.target : undefined };
  }

  async function logout() {
    // todo: make actual logout call
    // should be accepted by a receive function
  }

  async function init(context: SkeletonContext) {
    await (context.auth as unknown as { store?(key: string, source: string): PromiseOr<void> }).store?.(
      callbackKey,
      key ?? "openidConnect"
    );

    const serviceConfig = await fetchConfiguration();
    context.auth.internal.setContext({ [configKey]: serviceConfig }, configKey);
  }

  async function config(context: SkeletonContext) {
    return { [key ?? "openidConnect"]: options };
  }

  function isLoggedIn(this: SkeletonKey): boolean {
    return !!this.internal.getContext().user;
  }

  return { expose: { login, logout, isLoggedIn, receive }, config, init };
}

interface OpenTabOptions {
  channelmode?: boolean;
  directories?: boolean;
  fullscreen?: boolean;
  height?: number;
  width?: number;
  top?: number;
  left?: number;
  location?: boolean;
  menubar?: boolean;
  resizable?: boolean;
  scrollbars?: boolean;
  status?: boolean;
  toolbar?: boolean;
  target?: "_blank" | "_top" | "_parent" | "_self" | string;
}

function openTab(url: string, options: OpenTabOptions = {}): WindowProxy {
  const { target = "_blank", ...opts } = options;
  if (typeof window === "undefined")
    throw new Error("can't open window in windowless environment, are you running skeleton-key serverside?");
  return window.open(
    url,
    target,
    Object.entries(opts)
      .map(([key, value]) => (key + "=" + typeof value === "boolean" ? (value ? "1" : "0") : value))
      .join(",")
  )!;
}

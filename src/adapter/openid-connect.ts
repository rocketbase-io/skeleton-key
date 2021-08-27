import { SkeletonReceiveConfig } from "@/base";
import { PromiseOr, SkeletonAdapter, SkeletonContext, SkeletonKey } from "@/types";
import axios, { AxiosInstance } from "axios";

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
  action: "login" | "logout" | "register" | "other";
}

export function openidConnect<Key extends string = "openidConnect">(
  options: OpenidConnectOptions,
  key?: Key
): SkeletonAdapter {
  const callbackKey = `openid-callback${key ? `-${key}` : ""}`;
  const configKey = `openid-config${key ? `-${key}` : ""}`;
  const { endpoint = "/", client, secret, axios: rest = axios.create() } = options;

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

  async function login(this: SkeletonKey, currentUrl: string, target?: string, newTab = true) {
    const state = randomString(32);
    const callMeta: OpenidCallMeta = { state, currentUrl, target, newTab, action: "login" };
    this.persist?.(callbackKey, callMeta);
    // todo: open popup
  }

  // Call this on receiving endpoints
  async function receive(this: SkeletonKey, currentUrl: string): Promise<SkeletonReceiveConfig> {
    const url = new URL(currentUrl);
    const state = url.searchParams.get("state");
    const callMeta = this.read?.<OpenidCallMeta>(callbackKey);

    // todo: also check callback url
    if (!callMeta || callMeta.state !== state) {
      this.persist?.(callbackKey, null);
      throw new Error("State does not match! Was this call made by SkeletonKey?");
    }

    switch (callMeta.action) {
      case "login":
        // todo: token resolve request, set context with this.internal.setContext({ user: ..., tokens: { [key ?? "openidConnect"]: ... } }, "login");
        break;
      case "logout":
        this.internal.setContext({ user: undefined, tokens: { [key ?? "openidConnect"]: undefined } }, "logout");
    }

    return { close: callMeta.newTab, redirect: currentUrl !== callMeta.target ? callMeta.target : undefined };
  }

  async function logout() {
    // do things;
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

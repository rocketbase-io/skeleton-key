export interface OpenIdConfig {
  target: string;
  response_type: "code";
  client_id: string;
  redirect_uri: string;
  state?: string;
  features?: string;
}

export const currentOrigin = (): string | undefined => (typeof location === "undefined" ? undefined : location.origin);
export const currentHref = (): string | undefined => (typeof location === "undefined" ? undefined : location.href);
export function relativeUrl(path: string, origin = currentOrigin()): URL {
  return new URL(path, origin);
}

export const popupFeatures = "height=500,width=420,location=0,menubar=0,status=0,toolbar=0";

export async function connect(config: OpenIdConfig): Promise<void> {
  const { target, features = popupFeatures, ...urlParams } = config;
  const url = relativeUrl(target);
  for (const [key, value] of Object.entries(urlParams)) url.searchParams.set(key, value);
  return new Promise((resolve, reject) => {
    const w = window.open(url.href, "_blank", features)!;
    if (!w) return reject(new Error(`Could not create window for url ${url}`));
    let timeout: number | undefined = undefined;
    const id = setInterval(() => {
      if (!w.closed) return;
      clearInterval(id);
      clearTimeout(timeout);
      resolve();
    }, 100);
    timeout = setTimeout(() => {
      clearInterval(id);
      if (!w.closed) w.close();
      reject(new Error("Timeout exceeded"));
    }, 120000) as any;
  });
}

export async function receive(config: OpenIdConfig, current = currentHref()): Promise<false | string> {
  if (!current)
    throw new Error("No url provided for OpenId Connect callback. Are you running in a server side environment?");
  const { state, redirect_uri } = config;
  const url = relativeUrl(current);
  const target = relativeUrl(redirect_uri);
  if (url.origin !== target.origin) return false;
  if (url.pathname !== target.pathname) return false;
  const params = url.searchParams;
  if (params.get("state") !== state) return false;
  const code = params.get("code");
  return code ? code : false;
}

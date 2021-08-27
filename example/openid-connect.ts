/* eslint-disable no-console */
import { debug, openidConnect, skeletonKey, storageAdapter } from "../src";
import { LocalStorage } from "node-localstorage";

const storage = new LocalStorage(".localStorage.tmp");

async function example() {
  const auth = skeletonKey([
    debug(true),
    storageAdapter({ storage, key: "openid-connect-example" }),
    openidConnect({
      endpoint: "https://api.dev.productspace.io/satellite",
      client: "observue",
    }),
  ]);
  await auth.init({});
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (!auth.isLoggedIn()) await auth.login();

  console.log(auth.internal.getContext());
}

example();

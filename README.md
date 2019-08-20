# skeleton-key

[![Maintainability](https://api.codeclimate.com/v1/badges/374376e1799c1f4cf8d6/maintainability)](https://codeclimate.com/github/rocketbase-io/skeleton-key/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/374376e1799c1f4cf8d6/test_coverage)](https://codeclimate.com/github/rocketbase-io/skeleton-key/test_coverage)
[![Build Status](https://travis-ci.com/rocketbase-io/skeleton-key.svg?branch=master)](https://travis-ci.com/rocketbase-io/skeleton-key)
[![npm (scoped)](https://img.shields.io/npm/v/@rocketbase/skeleton-key)](https://www.npmjs.com/package/@rocketbase/skeleton-key)
[![NPM](https://img.shields.io/npm/l/@rocketbase/skeleton-key)](LICENSE.md)


##### A Client-Side JS Authentication and Authorization Library for Commons Auth

## Install

```SH
npm i @rocketbase/skeleton-key
```

## Examples
```Typescript
// auth.ts
import {SkeletonKey} from "@rocketbase/skeleton-key";
export const auth = new SkeletonKey();

// api.ts
import {auth} from "./auth";
import axios from "axios";

export async function getData() {
  if (!auth.isLoggedIn())
    throw new Error("Need to be logged in!");
  // Auth headers are appended automatically.
  return axios.get('/the/data');
}

export async function getOtherData() {
  // Auth headers are not appended unless this app is hosted on example.com
  return axios.get('https://example.com/other/data');
}

export function getUserId() {
  // Data encoded in the jwt is accessible through tokenData and refreshTokenData getter.
  return auth.tokenData.payload.customerId;
}

export function getUserAttributes() {
  // Data returned as the user response is accessible through the userData getter.
  return auth.userData;
}
```

```Typescript
// auth.ts
import {SkeletonKey} from "@rocketbase/skeleton-key";

interface UserExtensions {
  customAttributes: string;
  goHere: boolean;
  forTypingAssist: any[]
}

interface JwtExtensions {
  tokenExtensions: string;
  goHere: number;
  forTypingAssist: any
}

export const auth = new SkeletonKey<UserExtensions, JwtExtensions>({
  domains: ['*'],                           // Will insert auth headers for every domain
  url: "https://the.auth.server/path",      // Path to the auth server to run requests against
  intercept: true,                          // Automatically intercept all requests and insert headers where necessary
  renewType: "action",                      // Automatically refresh token once it expires
  authHeader: "Authorization",              // The header to inject the token under
  authPrefix: "Bearer ",                    // Prefix of the header value
  authSuffix: "",                           // Suffix of the header value
  storageKey: "io.rocketbase.commons.auth"  // The key in localStorage the token and user data is persisted under
});

// decorators.ts
import {auth} from "./auth";
import {LoginDialog} from "./some/LoginDialog";

/**
 * Checks if a user is logged in.
 * If not, delays execution until successful login and trigger a login dialog
 */
export function NeedsLogin(target: any, propertyKey: string | symbol, desc: PropertyDescriptor) {
  const {value} = desc;
  desc.value = async function(this: any, ...args: any[]) {
    if (!auth.isLoggedIn()) {
      LoginDialog.open();
      await auth.waitForLogin();
    }
    return value.apply(this, args);
  };
  return desc;
}

/**
 * Checks if a user has a given role.
 * If not, prevents execution and throws an error.
 */
export function NeedsRole(role: string) {
  return function(target: any, propertyKey: string | symbol, desc: PropertyDescriptor) {
    const {value} = desc;
    desc.value = function(this: any, ...args: any[]) {
      if (!auth.isLoggedIn() || !auth.userData.roles.contains(role))
        throw new Error(`User needs to be member of role ${role}!`);
      return value.apply(this, args);
    }
    return desc;
  }
}

// api.ts
import {NeedsLogin, NeedsRole} from "./decorators";
import axios from "axios";

export class Api {
  
  @NeedsLogin
  async getSomeData(id: string) {
    return axios.get(`/path/to/service/data/${id}`);
  }
  
  @NeedsRole("ADMIN")
  async getUserData(id: string) {
    return axios.get(`/path/to/service/users/${id}`);
  }
  
  // Can also be combined
  @NeedsLogin
  @NeedsRole("ADMIN")
  async setUserPassword(id: string, password: string) {
    return axios.put(`/path/to/service/users/${id}`, JSON.stringify({password}), {headers:{'Content-Type': 'application/json'}});
  }
  
}

```



import "./mock/xhr-mock";
import mock from "xhr-mock";
import { mock as fetchMock, reset as fetchReset } from "fetch-mock";
import { interceptors } from "../src/intercept";
import { SkeletonKey, SkeletonKeyDefaults, urlAbsolute } from "../src";
import {
  JWT_VALID_REFRESH,
  JWT_VALID_TOKEN,
  STORAGE_EXPIRED_REFRESH,
  STORAGE_EXPIRED_TOKEN,
  STORAGE_VALID_TOKEN,
  USER_DATA
} from "./mock/localStorage";

describe("index", () => {
  beforeEach(() => mock.setup());
  afterEach(() => mock.teardown());
  afterEach(() => fetchReset());

  describe("SkeletonKey", () => {
    const skey = SkeletonKeyDefaults.storageKey!;

    describe("new(), #installListeners()", () => {
      it("should register interceptors if enabled", () => {
        interceptors.splice(0, interceptors.length);
        const key = new SkeletonKey();
        expect(interceptors.length).toEqual(1);
        expect(interceptors[0]).toEqual(key);
      });
      it("should not register interceptors if disabled", () => {
        interceptors.splice(0, interceptors.length);
        new SkeletonKey({ intercept: false });
        expect(interceptors.length).toEqual(0);
      });
    });

    describe("new(), #load()", () => {
      it("should load data from localStorage if it exists", () => {
        localStorage.setItem(skey, STORAGE_VALID_TOKEN);
        interceptors.splice(0, interceptors.length);
        const auth = new SkeletonKey({ intercept: false, initialLoginCheck: false });
        expect(auth.jwtBundle!.token).toEqual(JWT_VALID_TOKEN);
        expect(auth.jwtBundle!.refreshToken).toEqual(JWT_VALID_REFRESH);
        expect(auth.userData).toEqual(JSON.parse(USER_DATA));
        expect(auth.isLoggedIn()).toBeTruthy();
      });

      it("should remove invalid data from localStorage", () => {
        localStorage.setItem(skey, STORAGE_VALID_TOKEN.substr(1));
        interceptors.splice(0, interceptors.length);
        const auth = new SkeletonKey({ intercept: false });
        expect(auth.isLoggedIn()).toBeFalsy();
        expect(localStorage.getItem(skey)).toBeFalsy();
      });

      it("should automatically delete token data if initialLoginCheck is true", async () => {
        localStorage.setItem(skey, STORAGE_VALID_TOKEN);
        interceptors.splice(0, interceptors.length);

        mock.get(urlAbsolute("/auth/me"), (req, res) => {
          res.status(401);
          res.header("Content-Type", "application/json");
          res.body("401 Unauthorized");
          return res;
        });

        const auth = new SkeletonKey({ intercept: false, renewType: "never" });
        await auth.waitForEvent("initialized");

        expect(auth.isLoggedIn()).toBeFalsy();
        expect(auth.jwtBundle).toBeFalsy();
        expect(auth.user).toBeFalsy();
        expect(localStorage.getItem(skey)).toBeFalsy();
      });
    });

    describe("#installInterval()", () => {
      it("should be called on login and creation", async () => {
        localStorage.setItem(skey, STORAGE_VALID_TOKEN);
        interceptors.splice(0, interceptors.length);
        const orig = SkeletonKey.prototype.installInterval;
        const spy = jest.fn();

        mock.get(urlAbsolute("/auth/me"), (req, res) => {
          expect(req.header("Authorization")).toEqual(`Bearer ${JWT_VALID_TOKEN}`);
          res.status(200);
          res.header("Content-Type", "application/json");
          res.body(USER_DATA);
          return res;
        });

        SkeletonKey.prototype.installInterval = spy;
        const auth = new SkeletonKey({ intercept: false, renewType: "interval" });
        await auth.waitForEvent("initialized");
        SkeletonKey.prototype.installInterval = orig;

        expect(spy).toHaveBeenCalledTimes(1);
        await auth.emit("login");
        expect(spy).toHaveBeenCalledTimes(2);
      });

      it("should not install a timer if the user isn't logged in", () => {
        localStorage.removeItem(skey);
        interceptors.splice(0, interceptors.length);

        const orig = window.setTimeout;
        const spy = (window.setTimeout = jest.fn() as any);

        new SkeletonKey({ intercept: false, renewType: "interval" });

        window.setTimeout = orig;
        expect(spy).not.toHaveBeenCalled();
      });

      it("should delete token data if the token is valid but incorrect", async () => {
        localStorage.setItem(skey, STORAGE_EXPIRED_TOKEN);
        interceptors.splice(0, interceptors.length);

        mock.get(urlAbsolute("/auth/refresh"), (req, res) => {
          res.status(401);
          res.header("Content-Type", "application/json");
          res.body("401 Unauthorized");
          return res;
        });

        const auth = new SkeletonKey({ intercept: false, renewType: "never", initialLoginCheck: false });

        await auth.refreshToken();

        expect(auth.isLoggedIn()).toBeFalsy();
        expect(auth.jwtBundle).toBeFalsy();
        expect(auth.user).toBeFalsy();
        expect(localStorage.getItem(skey)).toBeFalsy();
      });

      xit("should try to refresh the token if it needs to be refreshed", async () => {
        localStorage.setItem(skey, STORAGE_EXPIRED_TOKEN);
        interceptors.splice(0, interceptors.length);

        const _setTimeout = window.setTimeout;
        const spy1 = (window.setTimeout = jest.fn() as any);

        const auth = new SkeletonKey({ intercept: false, renewType: "never" });
        const spy2 = (auth.refreshToken = jest.fn());

        await auth.emit("login");
        global.setTimeout = _setTimeout;

        expect(spy1).toHaveBeenCalledTimes(1);
        expect(spy2).toHaveBeenCalledTimes(2);
      });
    });

    describe("#persist()", () => {
      it("should write data to localStorage, if logged in", () => {
        localStorage.removeItem(skey);
        interceptors.splice(0, interceptors.length);
        const auth = new SkeletonKey({ intercept: false });
        auth.user = JSON.parse(USER_DATA);
        auth.jwtBundle = JSON.parse(STORAGE_VALID_TOKEN).jwtBundle;
        expect(auth.isLoggedIn()).toBeTruthy();
        auth.persist();
        expect(JSON.parse(localStorage.getItem(skey)!)).toEqual(JSON.parse(STORAGE_VALID_TOKEN));
      });
    });

    describe("#isLoggedIn()", () => {
      it("should be false if no user or token are stored", () => {
        localStorage.removeItem(skey);
        interceptors.splice(0, interceptors.length);
        const auth = new SkeletonKey({ intercept: false });
        expect(auth.isLoggedIn()).toBeFalsy();
      });
      it("should be true for valid user and tokens", () => {
        localStorage.removeItem(skey);
        interceptors.splice(0, interceptors.length);
        const auth = new SkeletonKey({ intercept: false });
        auth.user = JSON.parse(USER_DATA);
        auth.jwtBundle = JSON.parse(STORAGE_VALID_TOKEN).jwtBundle;
        expect(auth.isLoggedIn()).toBeTruthy();
      });
      it("should be true for expired token if refresh token isn't expired", () => {
        localStorage.removeItem(skey);
        interceptors.splice(0, interceptors.length);
        const auth = new SkeletonKey({ intercept: false });
        auth.user = JSON.parse(USER_DATA);
        auth.jwtBundle = JSON.parse(STORAGE_EXPIRED_TOKEN).jwtBundle;
        expect(auth.isLoggedIn()).toBeTruthy();
      });
      it("should be false for expired token and refresh token", () => {
        localStorage.removeItem(skey);
        interceptors.splice(0, interceptors.length);
        const auth = new SkeletonKey({ intercept: false });
        auth.user = JSON.parse(USER_DATA);
        auth.jwtBundle = JSON.parse(STORAGE_EXPIRED_REFRESH).jwtBundle;
        expect(auth.isLoggedIn()).toBeFalsy();
      });
    });

    describe("#onAction()", () => {
      it("should not do anything if no url is passed", async () => {
        localStorage.removeItem(skey);
        interceptors.splice(0, interceptors.length);
        const auth = new SkeletonKey({ intercept: false });
        auth.user = JSON.parse(USER_DATA);
        auth.jwtBundle = JSON.parse(STORAGE_EXPIRED_TOKEN).jwtBundle;
        auth.refreshToken = jest.fn();
        await auth.onAction("send", (undefined as any) as string);
        expect(auth.refreshToken).not.toHaveBeenCalled();
      });
      it("should not do anything if the url matches the refresh url", async () => {
        localStorage.removeItem(skey);
        interceptors.splice(0, interceptors.length);
        const auth = new SkeletonKey({ intercept: false });
        auth.user = JSON.parse(USER_DATA);
        auth.jwtBundle = JSON.parse(STORAGE_EXPIRED_TOKEN).jwtBundle;
        auth.refreshToken = jest.fn();
        await auth.onAction("send", "./auth/refresh");
        expect(auth.refreshToken).not.toHaveBeenCalled();
      });
      it("should try to refresh the token if the token is expired and the refreshToken is valid", async () => {
        localStorage.removeItem(skey);
        interceptors.splice(0, interceptors.length);
        const auth = new SkeletonKey({ intercept: false });
        auth.user = JSON.parse(USER_DATA);
        auth.jwtBundle = JSON.parse(STORAGE_EXPIRED_TOKEN).jwtBundle;
        auth.refreshToken = jest.fn();
        await auth.onAction("send", "/some/path");
        expect(auth.refreshToken).toHaveBeenCalled();
      });
      it("should not try to refresh the token if the token is valid", async () => {
        localStorage.removeItem(skey);
        interceptors.splice(0, interceptors.length);
        const auth = new SkeletonKey({ intercept: false });
        auth.user = JSON.parse(USER_DATA);
        auth.jwtBundle = JSON.parse(STORAGE_VALID_TOKEN).jwtBundle;
        auth.refreshToken = jest.fn();
        await auth.onAction("send", "/some/path");
        expect(auth.refreshToken).not.toHaveBeenCalled();
      });
      it("should not try to refresh the token if the refresh token is expired", async () => {
        localStorage.removeItem(skey);
        interceptors.splice(0, interceptors.length);
        const auth = new SkeletonKey({ intercept: false });
        auth.user = JSON.parse(USER_DATA);
        auth.jwtBundle = JSON.parse(STORAGE_EXPIRED_REFRESH).jwtBundle;
        auth.refreshToken = jest.fn();
        await auth.onAction("send", "/some/path");
        expect(auth.refreshToken).not.toHaveBeenCalled();
      });
    });

    describe("#login()", () => {
      const body = JSON.parse(STORAGE_VALID_TOKEN);
      body.jwtTokenBundle = body.jwtBundle;
      delete body.jwtBundle;

      it("should send a login request to the auth service", async () => {
        localStorage.removeItem(skey);
        interceptors.splice(0, interceptors.length);

        const auth = new SkeletonKey({ intercept: false });

        expect(auth.isLoggedIn()).toBeFalsy();
        mock.post(urlAbsolute("/auth/login"), (req, res) => {
          expect(req.header("Content-Type")).toEqual("application/json");
          res.status(200);
          res.header("Content-Type", "application/json");
          res.body(JSON.stringify(body));
          return res;
        });

        await auth.login("test.user", "sup3rs3cr3t");

        expect(auth.isLoggedIn()).toBeTruthy();
        expect(auth.userData).toEqual(JSON.parse(USER_DATA));
        expect(auth.jwtBundle!.token).toEqual(JWT_VALID_TOKEN);
        expect(auth.jwtBundle!.refreshToken).toEqual(JWT_VALID_REFRESH);
      });

      it("should logout the user before trying to log in again", async () => {
        localStorage.removeItem(skey);
        interceptors.splice(0, interceptors.length);

        const auth = new SkeletonKey({ intercept: false });

        auth.user = JSON.parse(USER_DATA);
        auth.jwtBundle = JSON.parse(STORAGE_VALID_TOKEN).jwtBundle;
        expect(auth.isLoggedIn()).toBeTruthy();

        mock.post(urlAbsolute("/auth/login"), (req, res) => {
          expect(req.header("Content-Type")).toEqual("application/json");
          res.status(200);
          res.header("Content-Type", "application/json");
          res.body(JSON.stringify(body));
          return res;
        });

        const promise = auth.login("test.user", "sup3rs3cr3t");
        expect(auth.isLoggedIn()).toBeFalsy();
        await promise;
        expect(auth.isLoggedIn()).toBeTruthy();
      });

      it("should emit the login event after successful login", async () => {
        localStorage.removeItem(skey);
        interceptors.splice(0, interceptors.length);

        const auth = new SkeletonKey({ intercept: false });

        mock.post(urlAbsolute("/auth/login"), (req, res) => {
          expect(req.header("Content-Type")).toEqual("application/json");
          res.status(200);
          res.header("Content-Type", "application/json");
          res.body(JSON.stringify(body));
          return res;
        });

        const spy = jest.fn();
        auth.on("login", spy);

        await auth.login("test.user", "sup3rs3cr3t");
        expect(auth.isLoggedIn()).toBeTruthy();
        expect(spy).toHaveBeenCalled();
      });
    });

    describe("#logout()", () => {
      it("should log out the current user", async () => {
        localStorage.removeItem(skey);
        interceptors.splice(0, interceptors.length);

        const auth = new SkeletonKey({ intercept: false });
        auth.user = JSON.parse(USER_DATA);
        auth.jwtBundle = JSON.parse(STORAGE_VALID_TOKEN).jwtBundle;
        expect(auth.isLoggedIn()).toBeTruthy();
        expect(await auth.logout()).toBeTruthy();
        expect(auth.isLoggedIn()).toBeFalsy();
      });

      it("trigger the 'logout' event", async () => {
        localStorage.removeItem(skey);
        interceptors.splice(0, interceptors.length);

        const auth = new SkeletonKey({ intercept: false });
        auth.user = JSON.parse(USER_DATA);
        auth.jwtBundle = JSON.parse(STORAGE_VALID_TOKEN).jwtBundle;
        expect(auth.isLoggedIn()).toBeTruthy();

        const spy = jest.fn();
        auth.on("logout", spy);

        expect(await auth.logout()).toBeTruthy();
        expect(auth.isLoggedIn()).toBeFalsy();
        expect(spy).toHaveBeenCalled();
      });
    });

    describe("#waitForLogin()", () => {
      const body = JSON.parse(STORAGE_VALID_TOKEN);
      body.jwtTokenBundle = body.jwtBundle;
      delete body.jwtBundle;

      it("should return a promise that resolves upon successful login", async () => {
        localStorage.removeItem(skey);
        interceptors.splice(0, interceptors.length);

        const auth = new SkeletonKey({ intercept: false });
        const spy = jest.fn();
        auth.waitForLogin().then(spy);

        mock.post(urlAbsolute("/auth/login"), (req, res) => {
          expect(req.header("Content-Type")).toEqual("application/json");
          res.status(200);
          res.header("Content-Type", "application/json");
          res.body(JSON.stringify(body));
          return res;
        });

        expect(spy).not.toHaveBeenCalled();
        await auth.login("test.user", "sup3rs3cr3t");
        expect(spy).toHaveBeenCalled();
      });
    });

    describe("#refreshToken()", () => {
      it("should refresh a jwt using the refreshToken", async () => {
        localStorage.removeItem(skey);
        interceptors.splice(0, interceptors.length);

        const auth = new SkeletonKey({ intercept: false });
        auth.user = JSON.parse(USER_DATA);
        auth.jwtBundle = JSON.parse(STORAGE_EXPIRED_TOKEN).jwtBundle;
        expect(auth.isLoggedIn()).toBeTruthy();

        mock.get(urlAbsolute("/auth/refresh"), (req, res) => {
          expect(req.header("Authorization")).toEqual(`Bearer ${JWT_VALID_REFRESH}`);
          res.status(200);
          res.header("Content-Type", "text/plain");
          res.body(JWT_VALID_TOKEN);
          return res;
        });

        await auth.refreshToken();
        expect(auth.jwtBundle!.token).toEqual(JWT_VALID_TOKEN);
      });

      it("should fire a 'refresh' event", async () => {
        localStorage.removeItem(skey);
        interceptors.splice(0, interceptors.length);

        const auth = new SkeletonKey({ intercept: false });
        auth.user = JSON.parse(USER_DATA);
        auth.jwtBundle = JSON.parse(STORAGE_EXPIRED_TOKEN).jwtBundle;
        expect(auth.isLoggedIn()).toBeTruthy();

        mock.get(urlAbsolute("/auth/refresh"), (req, res) => {
          expect(req.header("Authorization")).toEqual(`Bearer ${JWT_VALID_REFRESH}`);
          res.status(200);
          res.header("Content-Type", "text/plain");
          res.body(JWT_VALID_TOKEN);
          return res;
        });

        const spy = jest.fn();
        auth.on("refresh", spy);

        await auth.refreshToken();
        expect(auth.jwtBundle!.token).toEqual(JWT_VALID_TOKEN);
        expect(spy).toHaveBeenCalled();
      });

      it("should return false if no tokens are defined", async () => {
        localStorage.removeItem(skey);
        interceptors.splice(0, interceptors.length);

        const auth = new SkeletonKey({ intercept: false });
        auth.user = JSON.parse(USER_DATA);

        expect(await auth.refreshToken()).toBeFalsy();
      });
    });

    describe("#refreshInfo()", () => {
      it("should refresh the user information", async () => {
        localStorage.removeItem(skey);
        interceptors.splice(0, interceptors.length);

        const auth = new SkeletonKey({ intercept: false });
        auth.user = JSON.parse(USER_DATA);
        auth.jwtBundle = JSON.parse(STORAGE_VALID_TOKEN).jwtBundle;
        auth.user!.email = "hans.franz@rocketbase.io";
        expect(auth.isLoggedIn()).toBeTruthy();
        expect(auth.userData!.email).toEqual("hans.franz@rocketbase.io");

        mock.get(urlAbsolute("/auth/me"), (req, res) => {
          expect(req.header("Authorization")).toEqual(`Bearer ${JWT_VALID_TOKEN}`);
          res.status(200);
          res.header("Content-Type", "application/json");
          res.body(USER_DATA);
          return res;
        });

        await auth.refreshInfo();
        expect(auth.userData!.email).toEqual("hans.peter@rocketbase.io");
      });

      it("should emit a 'refresh' event", async () => {
        localStorage.removeItem(skey);
        interceptors.splice(0, interceptors.length);

        const auth = new SkeletonKey({ intercept: false });
        auth.user = JSON.parse(USER_DATA);
        auth.jwtBundle = JSON.parse(STORAGE_VALID_TOKEN).jwtBundle;
        auth.user!.email = "hans.franz@rocketbase.io";
        expect(auth.isLoggedIn()).toBeTruthy();
        expect(auth.userData!.email).toEqual("hans.franz@rocketbase.io");

        mock.get(urlAbsolute("/auth/me"), (req, res) => {
          expect(req.header("Authorization")).toEqual(`Bearer ${JWT_VALID_TOKEN}`);
          res.status(200);
          res.header("Content-Type", "application/json");
          res.body(USER_DATA);
          return res;
        });

        const spy = jest.fn();
        auth.on("refresh", spy);

        await auth.refreshInfo();
        expect(auth.userData!.email).toEqual("hans.peter@rocketbase.io");
        expect(spy).toHaveBeenCalled();
      });

      it("should return false if the user isn't logged in", async () => {
        localStorage.removeItem(skey);
        interceptors.splice(0, interceptors.length);

        const auth = new SkeletonKey({ intercept: false });
        expect(await auth.refreshInfo()).toBeFalsy();
      });
    });

    describe("#onXhrSend()", () => {
      it("should set an auth header on an xhr object", async () => {
        localStorage.removeItem(skey);
        interceptors.splice(0, interceptors.length);

        const auth = new SkeletonKey();
        auth.user = JSON.parse(USER_DATA);
        auth.jwtBundle = JSON.parse(STORAGE_VALID_TOKEN).jwtBundle;

        const xhr = new XMLHttpRequest();
        xhr.open("GET", urlAbsolute("/LOS"));
        await xhr.send("SOMETHING");
        xhr.abort();

        expect((xhr as any).__headers["Authorization"]).toEqual(`Bearer ${JWT_VALID_TOKEN}`);
      });
      it("should fire an 'action' event on send", async () => {
        localStorage.removeItem(skey);
        interceptors.splice(0, interceptors.length);

        const auth = new SkeletonKey();
        auth.user = JSON.parse(USER_DATA);
        auth.jwtBundle = JSON.parse(STORAGE_VALID_TOKEN).jwtBundle;

        const spy = jest.fn();
        auth.on("action", spy);

        const xhr = new XMLHttpRequest();
        xhr.open("GET", urlAbsolute("/LOS"));
        await xhr.send("SOMETHING");
        xhr.abort();

        expect(spy).toHaveBeenCalled();
      });
    });

    describe("#onFetch()", () => {
      it("should add auth headers to request info", async () => {
        localStorage.removeItem(skey);
        interceptors.splice(0, interceptors.length);

        fetchMock(urlAbsolute("/some/thing"), (url, opts) => {
          expect((opts!.headers! as any)["Authorization"]).toEqual(`Bearer ${JWT_VALID_TOKEN}`);
          return 200;
        });

        const auth = new SkeletonKey();
        auth.user = JSON.parse(USER_DATA);
        auth.jwtBundle = JSON.parse(STORAGE_VALID_TOKEN).jwtBundle;

        await fetch(urlAbsolute("/some/thing"));
      });
    });
  });
});

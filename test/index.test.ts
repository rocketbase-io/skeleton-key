import "jasmine";
import mock from "xhr-mock";
import * as fetchMock from "fetch-mock";
import {installInterceptors, interceptors} from "../src/intercept";
import {SkeletonKey, SkeletonKeyDefaults, urlAbsolute} from "../src";
import {
  JWT_EXPIRED_TOKEN,
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
  afterEach(() => fetchMock.reset());

  describe("SkeletonKey", () => {

    const skey = SkeletonKeyDefaults.storageKey;

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
        const auth = new SkeletonKey({ intercept: false });
        expect(auth.jwtBundle.token).toEqual(JWT_VALID_TOKEN);
        expect(auth.jwtBundle.refreshToken).toEqual(JWT_VALID_REFRESH);
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
        expect(JSON.parse(localStorage.getItem(skey))).toEqual(JSON.parse(STORAGE_VALID_TOKEN));
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
        auth.refreshToken = jasmine.createSpy();
        await auth.onAction("send", undefined as any as string);
        expect(auth.refreshToken).not.toHaveBeenCalled();
      });
      it("should not do anything if the url matches the refresh url", async () => {
        localStorage.removeItem(skey);
        interceptors.splice(0, interceptors.length);
        const auth = new SkeletonKey({ intercept: false });
        auth.user = JSON.parse(USER_DATA);
        auth.jwtBundle = JSON.parse(STORAGE_EXPIRED_TOKEN).jwtBundle;
        auth.refreshToken = jasmine.createSpy();
        await auth.onAction("send", "./auth/refresh");
        expect(auth.refreshToken).not.toHaveBeenCalled();
      });
      it("should try to refresh the token if the token is expired and the refreshToken is valid", async () => {
        localStorage.removeItem(skey);
        interceptors.splice(0, interceptors.length);
        const auth = new SkeletonKey({ intercept: false });
        auth.user = JSON.parse(USER_DATA);
        auth.jwtBundle = JSON.parse(STORAGE_EXPIRED_TOKEN).jwtBundle;
        auth.refreshToken = jasmine.createSpy();
        await auth.onAction("send", "/some/path");
        expect(auth.refreshToken).toHaveBeenCalled();
      });
      it("should not try to refresh the token if the token is valid", async () => {
        localStorage.removeItem(skey);
        interceptors.splice(0, interceptors.length);
        const auth = new SkeletonKey({ intercept: false });
        auth.user = JSON.parse(USER_DATA);
        auth.jwtBundle = JSON.parse(STORAGE_VALID_TOKEN).jwtBundle;
        auth.refreshToken = jasmine.createSpy();
        await auth.onAction("send", "/some/path");
        expect(auth.refreshToken).not.toHaveBeenCalled();
      });
      it("should not try to refresh the token if the refresh token is expired", async () => {
        localStorage.removeItem(skey);
        interceptors.splice(0, interceptors.length);
        const auth = new SkeletonKey({ intercept: false });
        auth.user = JSON.parse(USER_DATA);
        auth.jwtBundle = JSON.parse(STORAGE_EXPIRED_REFRESH).jwtBundle;
        auth.refreshToken = jasmine.createSpy();
        await auth.onAction("send", "/some/path");
        expect(auth.refreshToken).not.toHaveBeenCalled();
      });
    });

    describe("#login()", () => {
      let body = JSON.parse(STORAGE_VALID_TOKEN);
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
        expect(auth.jwtBundle.token).toEqual(JWT_VALID_TOKEN);
        expect(auth.jwtBundle.refreshToken).toEqual(JWT_VALID_REFRESH);
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

        const spy = jasmine.createSpy();
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

        await auth.logout();
        expect(auth.isLoggedIn()).toBeFalsy();
      });

      it("trigger the 'logout' event", async () => {
        localStorage.removeItem(skey);
        interceptors.splice(0, interceptors.length);

        const auth = new SkeletonKey({ intercept: false });
        auth.user = JSON.parse(USER_DATA);
        auth.jwtBundle = JSON.parse(STORAGE_VALID_TOKEN).jwtBundle;
        expect(auth.isLoggedIn()).toBeTruthy();

        const spy = jasmine.createSpy();
        auth.on("logout", spy);

        await auth.logout();
        expect(auth.isLoggedIn()).toBeFalsy();
        expect(spy).toHaveBeenCalled();
      });

    });

    describe("#waitForLogin()", () => {
      let body = JSON.parse(STORAGE_VALID_TOKEN);
      body.jwtTokenBundle = body.jwtBundle;
      delete body.jwtBundle;

      it("should return a promise that resolves upon successful login", async () => {
        localStorage.removeItem(skey);
        interceptors.splice(0, interceptors.length);

        const auth = new SkeletonKey({ intercept: false });
        const spy = jasmine.createSpy();
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
          expect(req.header('Authorization')).toEqual(`Bearer ${JWT_VALID_REFRESH}`);
          res.status(200);
          res.header("Content-Type", "text/plain");
          res.body(JWT_VALID_TOKEN);
          return res;
        });

        await auth.refreshToken();
        expect(auth.jwtBundle.token).toEqual(JWT_VALID_TOKEN);
      });

      it("should fire a 'refresh' event", async () => {
        localStorage.removeItem(skey);
        interceptors.splice(0, interceptors.length);

        const auth = new SkeletonKey({ intercept: false });
        auth.user = JSON.parse(USER_DATA);
        auth.jwtBundle = JSON.parse(STORAGE_EXPIRED_TOKEN).jwtBundle;
        expect(auth.isLoggedIn()).toBeTruthy();

        mock.get(urlAbsolute("/auth/refresh"), (req, res) => {
          expect(req.header('Authorization')).toEqual(`Bearer ${JWT_VALID_REFRESH}`);
          res.status(200);
          res.header("Content-Type", "text/plain");
          res.body(JWT_VALID_TOKEN);
          return res;
        });

        const spy = jasmine.createSpy();
        auth.on("refresh", spy);

        await auth.refreshToken();
        expect(auth.jwtBundle.token).toEqual(JWT_VALID_TOKEN);
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
        auth.user.email = "hans.franz@rocketbase.io";
        expect(auth.isLoggedIn()).toBeTruthy();
        expect(auth.userData.email).toEqual("hans.franz@rocketbase.io");

        mock.get(urlAbsolute("/auth/me"), (req, res) => {
          expect(req.header('Authorization')).toEqual(`Bearer ${JWT_VALID_TOKEN}`);
          res.status(200);
          res.header("Content-Type", "application/json");
          res.body(USER_DATA);
          return res;
        });

        await auth.refreshInfo();
        expect(auth.userData.email).toEqual("hans.peter@rocketbase.io");
      });

      it("should emit a 'refresh' event", async () => {
        localStorage.removeItem(skey);
        interceptors.splice(0, interceptors.length);

        const auth = new SkeletonKey({ intercept: false });
        auth.user = JSON.parse(USER_DATA);
        auth.jwtBundle = JSON.parse(STORAGE_VALID_TOKEN).jwtBundle;
        auth.user.email = "hans.franz@rocketbase.io";
        expect(auth.isLoggedIn()).toBeTruthy();
        expect(auth.userData.email).toEqual("hans.franz@rocketbase.io");

        mock.get(urlAbsolute("/auth/me"), (req, res) => {
          expect(req.header('Authorization')).toEqual(`Bearer ${JWT_VALID_TOKEN}`);
          res.status(200);
          res.header("Content-Type", "application/json");
          res.body(USER_DATA);
          return res;
        });

        const spy = jasmine.createSpy();
        auth.on("refresh", spy);

        await auth.refreshInfo();
        expect(auth.userData.email).toEqual("hans.peter@rocketbase.io");
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
      it("should set an auth header on an xhr object", () => {
        localStorage.removeItem(skey);
        interceptors.splice(0, interceptors.length);

        const auth = new SkeletonKey();
        auth.user = JSON.parse(USER_DATA);
        auth.jwtBundle = JSON.parse(STORAGE_VALID_TOKEN).jwtBundle;

        const xhr = new XMLHttpRequest();
        xhr.open("GET", urlAbsolute("/LOS"));
        xhr.send("SOMETHING");
        xhr.abort();

        expect((xhr as any).__headers["Authorization"]).toEqual(`Bearer ${JWT_VALID_TOKEN}`);
      });
      it("should fire an 'action' event on send", () => {
        localStorage.removeItem(skey);
        interceptors.splice(0, interceptors.length);

        const auth = new SkeletonKey();
        auth.user = JSON.parse(USER_DATA);
        auth.jwtBundle = JSON.parse(STORAGE_VALID_TOKEN).jwtBundle;

        const spy = jasmine.createSpy();
        auth.on("action", spy);

        const xhr = new XMLHttpRequest();
        xhr.open("GET", urlAbsolute("/LOS"));
        xhr.send("SOMETHING");
        xhr.abort();

        expect(spy).toHaveBeenCalled();
      });
    });

    describe("#onFetch()", () => {
      it("should add auth headers to request info", async () => {
        localStorage.removeItem(skey);
        interceptors.splice(0, interceptors.length);

        fetchMock.get(urlAbsolute("/some/thing"), (url, opts) => {
          expect(opts.headers["Authorization"]).toEqual(`Bearer ${JWT_VALID_TOKEN}`);
          return 200;
        });

        const auth = new SkeletonKey();
        auth.user = JSON.parse(USER_DATA);
        auth.jwtBundle = JSON.parse(STORAGE_VALID_TOKEN).jwtBundle;

        await window.fetch(urlAbsolute("/some/thing"));
      });
    });
  });
});

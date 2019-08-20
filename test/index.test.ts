import "jasmine";
import {interceptors} from "../src/intercept";
import {SkeletonKey, SkeletonKeyDefaults} from "../src";
import {
  JWT_VALID_REFRESH,
  JWT_VALID_TOKEN,
  STORAGE_EXPIRED_REFRESH,
  STORAGE_EXPIRED_TOKEN,
  STORAGE_VALID_TOKEN,
  USER_DATA
} from "./mock/localStorage";

describe("index", () => {

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


  })


});

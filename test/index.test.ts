import "jasmine";
import {interceptors} from "../src/intercept";
import {SkeletonKey, SkeletonKeyDefaults} from "../src";
import {JWT_VALID_REFRESH, JWT_VALID_TOKEN, STORAGE_VALID_TOKEN, USER_DATA} from "./mock/localStorage";

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


  })


});

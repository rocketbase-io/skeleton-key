import "jasmine";
import {interceptors} from "../src/intercept";
import {SkeletonKey, SkeletonKeyDefaults} from "../src";

describe("index", () => {

  describe("SkeletonKey", () => {

    const skey = SkeletonKeyDefaults.storageKey;

    describe("new()", () => {
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

  })


});

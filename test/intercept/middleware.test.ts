import "jasmine";
import {executeRelevantInterceptors, interceptors, skipFirst} from "../../src/intercept";

describe("intercept", () => {

  describe("middleware", () => {

    describe("#executeRelevantInterceptors", () => {

      it("should return its args parameter if no handler is registered", () => {
        const args = ["foo", 5, {foo: "bar"}];

        interceptors.splice(0, interceptors.length);

        const result = executeRelevantInterceptors("https://foo.bar/", "onFetch", window, args);

        expect(result).toEqual(args);

      });

      it("should return its args parameter if handlers return undefined", () => {

        const args = ["foo", 5, {foo: "bar"}];
        const spy = jasmine.createSpy();

        interceptors.splice(0, interceptors.length);
        interceptors.push({
          domains: ['*'],
          onFetch: spy,
          onXhrOpen: spy,
          onXhrSend: spy
        } as any);

        const result = executeRelevantInterceptors("https://foo.bar/", "onFetch", window, args);

        expect(result).toEqual(args);

      });

    });

    it("should return the modified args if handlers return an array", () => {

      const args = ["foo", 5, {foo: "bar"}];
      const spy = jasmine.createSpy('spy', function(...args) {
        args.push("baz");
        return args;
      }).and.callThrough();

      interceptors.splice(0, interceptors.length);
      interceptors.push({
        domains: ['*'],
        onFetch: spy,
        onXhrOpen: spy,
        onXhrSend: spy
      } as any);

      const result = executeRelevantInterceptors("https://foo.bar/", "onFetch", window, args);

      expect(spy).toHaveBeenCalledWith(window, ...args);
      expect(result).toEqual([...args, "baz"]);

    });

    it("should prevent calls if handlers throw exceptions", () => {

      const args = ["foo", 5, {foo: "bar"}];
      const spy = jasmine.createSpy('spy', function(...args) {
        throw new Error("something went wrong");
      }).and.callThrough();

      interceptors.splice(0, interceptors.length);
      interceptors.push({
        domains: ['*'],
        onFetch: spy,
        onXhrOpen: spy,
        onXhrSend: spy
      } as any);

      expect(() => executeRelevantInterceptors("https://foo.bar/", "onFetch", window, args)).toThrow();

    });

    describe("#skipFirst()", () => {

      it("should return undefined if no array is given", () => {
        expect(skipFirst(undefined as any)).toBeUndefined();
      });

      it("should return a copy of the given array without its first member", () => {
        const orig = [1,2,3,4,5];
        const expected = [2,3,4,5];

        expect(skipFirst(orig)).toEqual(expected);
        expect(orig).toEqual([1,2,3,4,5]);
      });

      it("should be okay with array likes", () => {

        // @ts-ignore
        const args = (function(){return arguments})(1,2,3,4,5);

        expect(skipFirst(args as any)).toEqual([2,3,4,5]);

      });


    });


  });

});

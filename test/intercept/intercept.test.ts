import "../mock/xhr-mock";
import { installInterceptors, interceptFunction } from "../../src/intercept";

describe("intercept", () => {
  describe("intercept", () => {
    describe("#interceptFunction()", () => {
      it("should replace a function with an intercepted copy", () => {
        const obj = {
          toBeIntercepted(...args: any[]) {
            return args;
          }
        };
        const spy = jest.fn();

        interceptFunction(obj, "toBeIntercepted", spy);

        expect((obj.toBeIntercepted as any).__intercepted).toBeTruthy();
      });

      it("should forward this context and arguments to the interceptor", () => {
        const obj = {
          toBeIntercepted(...args: any[]) {
            return args;
          }
        };
        const spy = jest.fn(function(this: any) {
          expect(this).toBe(obj);
        });

        interceptFunction(obj, "toBeIntercepted", spy as any);

        obj.toBeIntercepted("do", "the", "thing");

        expect(spy).toHaveBeenCalledWith("do", "the", "thing");
      });

      it("should cancel execution if the interceptor throws an exception", () => {
        const obj = {
          toBeIntercepted(...args: any[]) {
            return args;
          }
        };
        const spy = jest.fn(function() {
          throw new Error("The Error");
        });

        interceptFunction(obj, "toBeIntercepted", spy);

        try {
          const result = obj.toBeIntercepted("do", "the", "thing");
        } catch (ex) {
          expect(ex).toMatch("The Error");
        }

        expect(spy).toHaveBeenCalledWith("do", "the", "thing");
      });

      it("should pass the returned arguments of the middleware to the original function", () => {
        const obj = {
          toBeIntercepted(...args: any[]) {
            return args;
          }
        };
        const spy = jest.fn(function(this: any) {
          expect(this).toBe(obj);
          return ["baby", "don't", "hurt", "me"];
        });

        interceptFunction(obj, "toBeIntercepted", spy);

        const result = obj.toBeIntercepted("what", "is", "love");

        expect(spy).toHaveBeenCalledWith("what", "is", "love");
        expect(result).toEqual(["baby", "don't", "hurt", "me"]);
      });
    });

    describe("#installInterceptors()", () => {
      it("intercepts xhr and fetch methods", () => {
        installInterceptors();
        const xhr = XMLHttpRequest.prototype as any;
        expect(xhr.open.__intercepted).toBeTruthy();
        expect(xhr.send.__intercepted).toBeTruthy();
        expect(xhr.setRequestHeader.__intercepted).toBeTruthy();
        expect((fetch as any).__intercepted).toBeTruthy();
      });
    });
  });
});

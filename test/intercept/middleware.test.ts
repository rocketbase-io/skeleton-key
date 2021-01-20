import "../mock/xhr-mock";
import { mock } from "fetch-mock";
import { executeRelevantInterceptors, installInterceptors, interceptors, skipFirst } from "../../src/intercept";

describe("intercept", () => {
  describe("middleware", () => {
    describe("#fetchMiddleware()", () => {
      it("should call relevant interceptors", async () => {
        mock("http://example.existiert-nicht", 200);
        installInterceptors();
        const spy = jest.fn();
        interceptors.splice(0, interceptors.length);
        interceptors.push({
          domains: ["*"],
          onFetch: spy,
        } as any);

        const promise = fetch("http://example.existiert-nicht", { headers: { "Content-Type": "application/json" } });

        expect(spy).toHaveBeenCalledWith(undefined, "http://example.existiert-nicht", {
          headers: { "Content-Type": "application/json" },
        });

        try {
          await promise;
        } catch (ex) {
          /* skip exception */
        }
      });
    });

    describe("#xmlHttpRequestSetRequestHeaderMiddleware()", () => {
      it("saves request headers to the request object", () => {
        installInterceptors();
        interceptors.splice(0, interceptors.length);
        const request = new XMLHttpRequest();
        request.open("GET", "http://example.com");
        request.setRequestHeader("Content-Type", "application/json");
        request.setRequestHeader("X-CustomHeader", "custom value");
        expect((request as any).__headers).toEqual({
          "Content-Type": "application/json",
          "X-CustomHeader": "custom value",
        });
        request.abort();
      });
    });

    describe("#xmlHttpRequestSendMiddleware()", () => {
      it("should call relevant interceptors", async () => {
        installInterceptors();
        const spy = jest.fn();
        interceptors.splice(0, interceptors.length);
        interceptors.push({
          domains: ["*"],
          onXhrSend: spy,
        } as any);
        const request = new XMLHttpRequest();
        request.open("GET", "http://example.com");
        await request.send("test");
        expect(spy).toHaveBeenCalledWith(request, "test");
        request.abort();
      });
    });

    describe("#xmlHttpRequestOpenMiddleware()", () => {
      it("should save the open arguments of XMLHttpRequest", () => {
        installInterceptors();
        const request = new XMLHttpRequest();
        interceptors.splice(0, interceptors.length);
        request.open("GET", "http://example.com");
        expect([...(request as any).__openArgs]).toEqual(["GET", "http://example.com"]);
        request.abort();
      });

      it("should call relevant interceptors", () => {
        installInterceptors();
        const spy = jest.fn();
        interceptors.splice(0, interceptors.length);
        interceptors.push({
          domains: ["*"],
          onXhrOpen: spy,
        } as any);
        const request = new XMLHttpRequest();
        request.open("GET", "http://example.com");
        expect(spy).toHaveBeenCalledWith(request, "GET", "http://example.com");
        request.abort();
      });
    });

    describe("#executeRelevantInterceptors", () => {
      it("should return its args parameter if no handler is registered", () => {
        const args = ["foo", 5, { foo: "bar" }];

        interceptors.splice(0, interceptors.length);

        const result = executeRelevantInterceptors("https://foo.bar/", "onFetch", window, args);

        expect(result).toEqual(args);
      });

      it("should return its args parameter if handlers return undefined", () => {
        const args = ["foo", 5, { foo: "bar" }];
        const spy = jest.fn();

        interceptors.splice(0, interceptors.length);
        interceptors.push({
          domains: ["*"],
          onFetch: spy,
          onXhrOpen: spy,
          onXhrSend: spy,
        } as any);

        const result = executeRelevantInterceptors("https://foo.bar/", "onFetch", window, args);

        expect(result).toEqual(args);
      });

      it("should return the modified args if handlers return an array", () => {
        const args = ["foo", 5, { foo: "bar" }];
        const spy = jest.fn(function (...args) {
          args.push("baz");
          return args;
        });

        interceptors.splice(0, interceptors.length);
        interceptors.push({
          domains: ["*"],
          onFetch: spy,
          onXhrOpen: spy,
          onXhrSend: spy,
        } as any);

        const result = executeRelevantInterceptors("https://foo.bar/", "onFetch", window, args);

        expect(spy).toHaveBeenCalledWith(window, ...args);
        expect(result).toEqual([...args, "baz"]);
      });

      it("should prevent calls if handlers throw exceptions", () => {
        const args = ["foo", 5, { foo: "bar" }];
        const spy = jest.fn(function () {
          throw new Error("something went wrong");
        });

        interceptors.splice(0, interceptors.length);
        interceptors.push({
          domains: ["*"],
          onFetch: spy,
          onXhrOpen: spy,
          onXhrSend: spy,
        } as any);

        expect(() => executeRelevantInterceptors("https://foo.bar/", "onFetch", window, args)).toThrow();
      });
    });

    describe("#skipFirst()", () => {
      it("should return undefined if no array is given", () => {
        expect(skipFirst(undefined as any)).toBeUndefined();
      });

      it("should return a copy of the given array without its first member", () => {
        const orig = [1, 2, 3, 4, 5];
        const expected = [2, 3, 4, 5];

        expect(skipFirst(orig)).toEqual(expected);
        expect(orig).toEqual([1, 2, 3, 4, 5]);
      });

      it("should be okay with array likes", () => {
        // @ts-ignore
        const args = (function (...params: number[]) {
          return params;
        })(1, 2, 3, 4, 5);

        expect(skipFirst(args as any)).toEqual([2, 3, 4, 5]);
      });
    });
  });
});

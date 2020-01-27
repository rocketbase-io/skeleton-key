import { only, urlAbsolute, urlMatches } from "../src";

describe("util", () => {
  const base = window.location.href;

  describe("#urlAbsolute()", () => {
    it("should convert a relative url into an absolute url", () => {
      expect(urlAbsolute("./some/path")).toEqual(base + "some/path");
      expect(urlAbsolute("./something/../some/path")).toEqual(base + "some/path");
    });
  });

  describe("#urlMatches()", () => {
    it("should return true for two equal urls", () => {
      expect(urlMatches("https://example.com/some/path", "https://example.com/some/path")).toBeTruthy();
    });
    it("should return true for a partially matched needle", () => {
      expect(urlMatches("https://example.com/some/path", "https://example.com/some")).toBeTruthy();
    });
    it("should return false for an unmatched needle", () => {
      expect(urlMatches("https://example.com/some", "https://example.com/some/path")).toBeFalsy();
    });
    it("should resolve relative paths", () => {
      expect(urlMatches(base + "some/path", "./some/path")).toBeTruthy();
      expect(urlMatches(base + "some/path", "./something/../some/path")).toBeTruthy();
      expect(urlMatches(base + "./some/../some/path", "./something/../some/path")).toBeTruthy();
    });
  });

  describe("#only()", () => {
    it("should return matching members of the target object", () => {
      const source = {
        fname: "Hans",
        lname: "Peter",
        age: 17,
        occupation: "Software Engineer"
      };
      const keys: any[] = ["fname", "lname"];
      const expected = {
        fname: "Hans",
        lname: "Peter"
      };

      expect(only(source, ...keys)).toEqual(expected);
    });
    it("should ignore members that don't exist", () => {
      const source = {
        fname: "Hans",
        lname: "Peter",
        age: 17,
        occupation: "Software Engineer"
      };
      const keys: any[] = ["phone"];
      const expected = {};

      expect(only(source, ...keys)).toEqual(expected);
    });
  });
});

import { isInDomain } from "../src";

describe("domain", () => {
  describe("#isInDomain()", () => {
    it("should match true for '*' domain on any domain", () => {
      expect(isInDomain(["*"], "https://foo.bar/bla")).toBeTruthy();
    });

    it("should match partial urls", () => {
      expect(isInDomain(["foo.bar"], "https://foo.bar/bla")).toBeTruthy();
    });

    it("should match true if any domain matches", () => {
      expect(isInDomain(["foo.baz", "foo.bar"], "https://foo.bar/bla")).toBeTruthy();
    });

    it("should match false if no domain matches", () => {
      expect(isInDomain(["foo.bar", "foo.baz/something"], "https://foo.baz/nope")).toBeFalsy();
    });
  });
});

import "jasmine";
import {only} from "../src";


describe("util", () => {
  describe("#only()", () => {
    it("should return matching members of the target object", () => {
      const source = {
        fname: "Hans",
        lname: "Peter",
        age: 17,
        occupation: "Software Engineer"
      };
      const keys: any[] = ['fname', 'lname'];
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
      const keys: any[] = ['phone'];
      const expected = {};

      expect(only(source, ...keys)).toEqual(expected);
    });
  });
});

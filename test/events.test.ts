import { Eventing } from "../src";

describe("events", () => {
  describe("#Eventing()", () => {
    it("can be mixed into classes", () => {
      class Base {}
      class Cls extends Eventing<string>(Base) {}

      expect(Object.getPrototypeOf(Object.getPrototypeOf(Cls))).toBe(Base);
    });

    it("defined all mixin methods", () => {
      class Base {}
      class Cls extends Eventing<string>(Base) {}
      const cls = new Cls();

      expect(cls.on).toBeDefined();
      expect(cls.once).toBeDefined();
      expect(cls.off).toBeDefined();
      expect(cls.emit).toBeDefined();
      expect(cls.emitSync).toBeDefined();
    });

    it("should call attached event handlers", () => {
      class Base {}
      class Cls extends Eventing<string>(Base) {}
      const cls = new Cls();

      const spy = jasmine.createSpy();

      cls.on("event", spy);
      cls.emitSync("event", { foo: "bar" });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ foo: "bar" });

      cls.emitSync("event", { foo: "bar" });

      expect(spy).toHaveBeenCalledTimes(2);
    });

    it("should call 'once' attached event handlers once", () => {
      class Base {}
      class Cls extends Eventing<string>(Base) {}
      const cls = new Cls();

      const spy = jasmine.createSpy();

      cls.once("event", spy);
      cls.emitSync("event", { foo: "bar" });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ foo: "bar" });

      cls.emitSync("event", { foo: "bar" });

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it("should not call removed event handlers", () => {
      class Base {}
      class Cls extends Eventing<string>(Base) {}
      const cls = new Cls();

      const spy = jasmine.createSpy();

      cls.on("event", spy);
      cls.emitSync("event", { foo: "bar" });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ foo: "bar" });

      cls.off("event", spy);
      cls.emitSync("event", { foo: "bar" });

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it("should remove all event handlers for a given event if no handler is given", () => {
      class Base {}
      class Cls extends Eventing<string>(Base) {}
      const cls = new Cls();

      const spy = jasmine.createSpy();

      cls.on("event", spy);
      cls.emitSync("event", { foo: "bar" });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ foo: "bar" });

      cls.off("event");
      cls.emitSync("event", { foo: "bar" });

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it("should return handler return values on emitSync", () => {
      class Base {}
      class Cls extends Eventing<string>(Base) {}
      const cls = new Cls();

      const h1 = () => 5;
      const h2 = () => "foobar";
      cls.on("event", h1);
      cls.on("event", h2);

      expect(cls.emitSync("event", { foo: "bar" })).toEqual([5, "foobar"]);
    });

    it("should return handler return values as a promise on emit", async () => {
      class Base {}
      class Cls extends Eventing<string>(Base) {}
      const cls = new Cls();

      const h1 = async () => 5;
      const h2 = async () => "foobar";

      expect(await cls.emit("event", { foo: "bar" })).toEqual([]);

      cls.on("event", h1);
      cls.on("event", h2);

      expect(await cls.emit("event", { foo: "bar" })).toEqual([5, "foobar"]);
    });
  });
});

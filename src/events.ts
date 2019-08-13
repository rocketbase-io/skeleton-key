import {Constructor} from "./types";

export interface IEventing<K> {
  on(event: K, callback: (ev: any) => void): this;
  once(event: K, callback: (ev: any) => void): this;
  off(event: K, callback?: (ev: any) => void): this;
  emit(event: K, ...data: any[]): Promise<any[]>;
  emitSync(event: K, ...data: any[]): void;
}

const EVENTS = Symbol("Events");

export function Eventing<K extends string = string, T extends {} = {}>(
  Base: Constructor<T> = Object as any
): Constructor<T> & Constructor<IEventing<T>> {

  // @ts-ignore
  return class extends (Base as any) implements IEventing<K> {

    public on(event: K, callback: (ev: any) => void): this {
      // @ts-ignore
      if (!this[EVENTS]) this[EVENTS] = {};
      // @ts-ignore
      if (!this[EVENTS][event]) this[EVENTS][event] = [];
      // @ts-ignore
      this[EVENTS][event].push(callback);
      return this;
    }

    public once(event: K, callback: (ev: any) => void): this {
      const onceHandler = (...args: any[]) => {
        // @ts-ignore
        const result = callback.apply(this, args);
        this.off(event, onceHandler);
        return result;
      };
      return this.on(event, onceHandler);
    }

    public off(event: K, callback?: (ev: any) => void): this {
      // @ts-ignore
      if (!callback) delete this[EVENTS][event];
      // @ts-ignore
      else this[EVENTS][event] = this[EVENTS][event].filter(cb => cb !== callback);
      return this;
    }

    public emit(event: K, ...data: any[]): Promise<any[]> {
      // @ts-ignore
      if (this[EVENTS] && this[EVENTS][event]) return Promise.all(this[EVENTS][event].map(cb => cb(...data)));
      return Promise.resolve([] as any);
    }

    public emitSync(event: K, ...data: any[]): void {
      // @ts-ignore
      if (this[EVENTS] && this[EVENTS][event]) return this[EVENTS][event].forEach(cb => cb(...data));
    }

  };
}

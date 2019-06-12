import {Constructor} from "./types";


export interface IEventing {
  on(event: string, callback: (ev: any) => void): this;
  once(event: string, callback: (ev: any) => void): this;
  off(event: string, callback?: (ev: any) => void): this;
  emit(event: string, ...data: any[]): this;
}

const EVENTS = Symbol('Events');

export function Eventing<T extends Object>(base: Constructor<T>): Constructor<T> & Constructor<IEventing> {
  const mixed =
    // @ts-ignore
    class extends base implements IEventing {

    public on(event: string, callback: (ev: any) => void): this {
      // @ts-ignore
      if (!this[EVENTS]) this[EVENTS] = {};
      // @ts-ignore
      if (!this[EVENTS][event]) this[EVENTS][event] = [];
      // @ts-ignore
      this[EVENTS][event].push(callback);
      return this;
    }

    public once(event: string, callback: (ev: any) => void): this {
      const onceHandler = (...args:any[]) => {
        // @ts-ignore
        callback.apply(this, args);
        this.off(event, onceHandler);
      };
      return this.on(event, onceHandler);
    }

    public off(event: string, callback?: (ev: any) => void): this {
      // @ts-ignore
      if (!callback) delete this[EVENTS][event];
      // @ts-ignore
      else this[EVENTS][event] = this[EVENTS][event].filter(cb => cl !== callback);
      return this;
    }

    public emit(event: string, ...data: any[]): this {
      // @ts-ignore
      if (this[EVENTS] && this[EVENTS][event]) this[EVENTS][event].forEach(cb => cb(...data));
      return this;
    }

  };
  return mixed as unknown as Constructor<T> & Constructor<IEventing>;
}

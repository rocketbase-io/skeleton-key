import {Constructor} from "./types";

export interface IEventing<K> {
  on(event: K, callback: (ev: any) => void): this;
  once(event: K, callback: (ev: any) => void): this;
  off(event: K, callback?: (ev: any) => void): this;
  emit(event: K, ...data: any[]): Promise<any[]>;
  emitSync(event: K, ...data: any[]): any[];
}

const EVENTS = Symbol("Events");

export function Eventing<K extends string = string, T extends {} = {}>(
  Base: Constructor<T> = Object as any
): Constructor<T> & Constructor<IEventing<K>> {

  // @ts-ignore
  const cls = class extends (Base as any) implements IEventing<K> {};

  cls.prototype.on = on;
  cls.prototype.once = once;
  cls.prototype.off = off;
  cls.prototype.emit = emit;
  cls.prototype.emitSync = emitSync;

  return cls as Constructor<T> & Constructor<IEventing<K>>;
}

export function on<K, R extends IEventing<K>>(this: R, event: K, callback: (ev: any) => void): IEventing<K> {
  // @ts-ignore
  if (!this[EVENTS]) this[EVENTS] = {};
  // @ts-ignore
  if (!this[EVENTS][event]) this[EVENTS][event] = [];
  // @ts-ignore
  this[EVENTS][event].push(callback);
  return this;
}

export function once<K, R extends IEventing<K>>(this: R, event: K, callback: (ev: any) => void): IEventing<K> {
  const onceHandler = (...args: any[]) => {
    // @ts-ignore
    const result = callback.apply(this, args);
    this.off(event, onceHandler);
    return result;
  };
  return this.on(event, onceHandler);
}

export function off<K, R extends IEventing<K>>(this: R, event: K, callback?: (ev: any) => void): this {
  // @ts-ignore
  if (!callback) delete this[EVENTS][event];
  // @ts-ignore
  else this[EVENTS][event] = this[EVENTS][event].filter(cb => cb !== callback);
  return this;
}

export function emit<K, R extends IEventing<K>>(this: R, event: K, ...data: any[]): Promise<any[]> {
  // @ts-ignore
  if (this[EVENTS] && this[EVENTS][event]) return Promise.all(this[EVENTS][event].map(cb => cb(...data)));
  return Promise.resolve([] as any);
}

export function emitSync<K, R extends IEventing<K>>(this: R, event: K, ...data: any[]): any[] {
  // @ts-ignore
  if (this[EVENTS] && this[EVENTS][event]) return this[EVENTS][event].map(cb => cb(...data));
  return [];
}

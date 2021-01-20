import { Constructor } from "./types";

const EVENTS = Symbol("Events");

export interface IEventing<K extends string> {
  [EVENTS]: Record<K, ((...args: any[]) => void)[]>
  on(event: K, callback: (...args: any[]) => void): this;
  once(event: K, callback: (...args: any[]) => void): this;
  off(event: K, callback?: (...args: any[]) => void): this;
  emit(event: K, ...data: any[]): Promise<any[]>;
  emitSync(event: K, ...data: any[]): any[];
  waitForEvent(event: K): Promise<any[]>;
}

export function Eventing<K extends string = string, T extends {} = {}>(
  Base: Constructor<T> = Object as any
): Constructor<T> & Constructor<IEventing<K>> {
  // @ts-ignore
  const Cls = class extends (Base as any) implements IEventing<K> {};

  Cls.prototype.on = on;
  Cls.prototype.once = once;
  Cls.prototype.off = off;
  Cls.prototype.emit = emit;
  Cls.prototype.emitSync = emitSync;
  Cls.prototype.waitForEvent = waitForEvent;

  return Cls as Constructor<T> & Constructor<IEventing<K>>;
}

export function on<K extends string, R extends IEventing<K>>(this: R, event: K, callback: (...args: any[]) => void): R {
  ((this[EVENTS] ??= {} as any)[event] ??= []).push(callback);
  return this;
}

export function once<K extends string, R extends IEventing<K>>(this: R, event: K, callback: (...args: any[]) => void): R {
  const onceHandler = (...args: any[]) => {
    const result = callback.apply(this, args);
    this.off(event, onceHandler);
    return result;
  };
  return this.on(event, onceHandler);
}

export function off<K extends string, R extends IEventing<K>>(this: R, event: K, callback?: (...args: any[]) => void): R {
  if (!callback) delete this[EVENTS][event];
  else this[EVENTS][event] = this[EVENTS][event].filter(cb => cb !== callback);
  return this;
}

export function emit<K extends string, R extends IEventing<K>>(this: R, event: K, ...data: any[]): Promise<any[]> {
  if (this[EVENTS] && this[EVENTS][event]) return Promise.all(this[EVENTS][event].map(cb => cb(...data)));
  return Promise.resolve([] as any);
}

export function emitSync<K extends string, R extends IEventing<K>>(this: R, event: K, ...data: any[]): any[] {
  return this[EVENTS]?.[event]?.map(cb => cb(...data)) ?? [];
}

export function waitForEvent<K extends string, R extends IEventing<K>>(this: R, event: K): Promise<any[]> {
  return new Promise(resolve => this.once(event, resolve));
}

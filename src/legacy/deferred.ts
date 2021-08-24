export interface Deferred<T> extends Promise<T> {
  resolve: (it: T) => void;
  reject: (ex: any) => void;
}

export function deferred<T>(): Deferred<T> {
  let resolveOuter: (it: T) => void = undefined as any;
  let rejectOuter: (ex: any) => void = undefined as any;
  const promise: Deferred<T> = new Promise((resolveInner, rejectInner) => {
    resolveOuter = resolveInner;
    rejectOuter = rejectInner;
  }) as any;
  promise.resolve = resolveOuter;
  promise.reject = rejectOuter;
  return promise;
}

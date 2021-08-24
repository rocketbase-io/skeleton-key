export type PromiseOr<T> = T extends Promise<infer Inner> ? Inner | T : T | Promise<T>;
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

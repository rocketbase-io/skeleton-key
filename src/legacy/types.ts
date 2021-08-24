export interface Constructor<T> {
  name: string;
  new (...args: any[]): T;
}

export type MethodOnly<T> = T extends (...args: any[]) => unknown ? T : never;
export type MethodsOnly<T> = { [Key in keyof T]: MethodOnly<T[Key]> };

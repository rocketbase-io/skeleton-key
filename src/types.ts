export interface Constructor<T> {
  name: string;
  new(...args: any[]): T;
}

export interface IBasicRegisterInfo {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}

export type IRegisterInfo<T = object> = { [P in keyof T]: T[P]; } & Partial<IBasicRegisterInfo>;

declare module "node-localstorage" {
  export const LocalStorage: new (path: string) => typeof localStorage;
}

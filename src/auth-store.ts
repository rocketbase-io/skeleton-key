import { AppUserRead, JwtBundle } from "@/model";
import { only } from "@/util";

export interface AuthStore {
  getData(storageKey: string): Promise<{ jwtBundle: JwtBundle, user: AppUserRead } | void>;
  setData(storageKey: string, {}: { jwtBundle: JwtBundle; user: AppUserRead }): Promise<void>;
  removeData(storageKey: string): Promise<void>;
}

export class StorageAuthStore implements AuthStore {
  public constructor(protected storage: Storage) {}

  public async getData(storageKey: string) {
    const serialized = this.storage.getItem(storageKey);
    try {
      return only(JSON.parse(serialized!), "jwtBundle", "user")
    } catch (ex) {
      return;
    }
  }

  public async setData(storageKey: string, { jwtBundle, user }: { jwtBundle: JwtBundle; user: AppUserRead }) {
    const serialized = JSON.stringify({ jwtBundle, user });
    this.storage.setItem(storageKey, serialized);
  }

  public async removeData(storageKey: string) {
    this.storage.removeItem(storageKey);
  }
}

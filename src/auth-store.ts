import { AppUserRead, JwtBundle } from "@/model";
import { only } from "@/util";

export interface AuthDataBundle {
  jwtBundle: JwtBundle;
  user: AppUserRead;
}

export interface AuthStore {
  getData(storageKey: string): Promise<AuthDataBundle | void>;
  setData(storageKey: string, { jwtBundle, user }: AuthDataBundle): Promise<void>;
  removeData(storageKey: string): Promise<void>;
}

export class StorageAuthStore implements AuthStore {
  public constructor(protected storage: Storage) {}

  public async getData(storageKey: string): Promise<AuthDataBundle | void> {
    const serialized = this.storage.getItem(storageKey);
    try {
      return only(JSON.parse(serialized!), "jwtBundle", "user");
    } catch (ex) {
      return;
    }
  }

  public async setData(storageKey: string, { jwtBundle, user }: AuthDataBundle): Promise<void> {
    const serialized = JSON.stringify({ jwtBundle, user });
    this.storage.setItem(storageKey, serialized);
  }

  public async removeData(storageKey: string): Promise<void> {
    this.storage.removeItem(storageKey);
  }
}

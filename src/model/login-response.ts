import {AppUserRead} from "./app-user-read";
import {JwtBundle} from "./jwt-bundle";

export interface LoginResponse {
  jwtTokenBundle: JwtBundle;
  user: AppUserRead;
}

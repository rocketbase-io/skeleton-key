import {AppUserRead} from "./app-user-read";
import {JwtTokenBundle} from "./jwt-token-bundle";

export interface LoginResponse {
  jwtTokenBundle: JwtTokenBundle;
  user: AppUserRead;
}

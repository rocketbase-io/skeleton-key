import axios, {AxiosInstance} from "axios";
import {
  AppUserRead,
  ForgotPasswordRequest, JwtBundle,
  LoginRequest,
  LoginResponse,
  PasswordChangeRequest,
  PasswordResetRequest,
  RegistrationRequest, UpdateProfileRequest, ValidationResponse
} from "./model";

export class AuthClient {

  private api: AxiosInstance;

  public constructor(url: string);
  public constructor(client: AxiosInstance);
  public constructor(url: string | AxiosInstance) {
    if (typeof url === "string")
      this.api = axios.create({ baseURL: url });
    else
      this.api = url;
  }

  public async login(body: LoginRequest) {
    const {data} = await this.api.post<LoginResponse>("/auth/login", JSON.stringify(body));
    return data;
  }

  public async me(token: string) {
    const {data} = await this.api.get<AppUserRead>("/auth/me", this.authHeader(token));
    return data;
  }

  public async refresh(refreshToken: string) {
    const {data} = await this.api.get<string>("/auth/refresh", this.authHeader(refreshToken));
    return data;
  }

  public async changePassword(body: PasswordChangeRequest, token: string) {
    return this.api.put<void>("/auth/refresh", JSON.stringify(body), this.authHeader(token));
  }

  public async updateProfile(body: UpdateProfileRequest, token: string) {
    return this.api.put<void>("/auth/update-profile", JSON.stringify(body), this.authHeader(token));
  }

  public async forgotPassword(body: ForgotPasswordRequest) {
    return this.api.put<void>("/auth/forgot-password", JSON.stringify(body));
  }

  public async resetPassword(body: PasswordResetRequest) {
    return this.api.put<void>("/auth/reset-password", JSON.stringify(body));
  }

  public async register(body: RegistrationRequest) {
    return this.api.post<void>("/auth/register", JSON.stringify(body));
  }

  public async verify(verification: string) {
    return this.api.get<JwtBundle>(`/auth/verify?verification=${verification}`);
  }

  public async validateEmail(email: string) {
    return this.api.post<ValidateEmailResponse>("/auth/validate/email", JSON.stringify({ email }));
  }

  public async validatePassword(password: string) {
    return this.api.post<ValidatePasswordResponse>("/auth/validate/password", JSON.stringify({ password }));
  }

  public async validateToken(token: string) {
    return this.api.post<ValidateTokenResponse>("/auth/validate/token", JSON.stringify({ token }));
  }

  public async validateUsername(username: string) {
    return this.api.post<ValidateUsernameResponse>("/auth/validate/username", JSON.stringify({ username }));
  }


  public authHeader(token: string) {
    return {headers: {Authorization: token}};
  }
}


export interface ValidateEmailResponse extends ValidationResponse {}
export interface ValidatePasswordResponse extends ValidationResponse {}
export interface ValidateTokenResponse extends ValidationResponse {}
export interface ValidateUsernameResponse extends ValidationResponse {}

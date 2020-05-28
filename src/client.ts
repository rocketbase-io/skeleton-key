/* istanbul ignore file */
import axios, { AxiosInstance } from "axios";
import {
  AppInviteRead,
  AppUserRead,
  ConfirmInviteRequest,
  ForgotPasswordRequest,
  JwtBundle,
  LoginRequest,
  LoginResponse,
  PasswordChangeRequest,
  PasswordResetRequest,
  RegistrationRequest,
  UpdateProfileRequest,
  ValidationResponse
} from "./model";

export class AuthClient {
  private api: AxiosInstance;
  public baseUrl?: string;

  public constructor(url: string);
  public constructor(client: AxiosInstance);
  public constructor(url: string | AxiosInstance) {
    if (typeof url === "string") {
      this.baseUrl = url;
      this.api = axios.create({ headers: { "Content-Type": "application/json" } });
    } else this.api = url;
  }

  public async login(body: LoginRequest) {
    const { data } = await this.api.post<LoginResponse>("/auth/login", JSON.stringify(body), { baseURL: this.baseUrl });
    return data;
  }

  public async me(token: string) {
    const { data } = await this.api.get<AppUserRead>("/auth/me", this.authHeader(token));
    return data;
  }

  public async refresh(refreshToken: string) {
    const { data } = await this.api.get<string>("/auth/refresh", this.authHeader(refreshToken));
    return data;
  }

  public async changePassword(body: PasswordChangeRequest, token: string) {
    return this.api
      .put<void>("/auth/change-password", JSON.stringify(body), this.authHeader(token))
      .then(r => r.status);
  }

  public async updateProfile(body: UpdateProfileRequest, token: string) {
    return this.api.put<void>("/auth/update-profile", JSON.stringify(body), this.authHeader(token)).then(r => r.status);
  }

  public async forgotPassword(body: ForgotPasswordRequest) {
    return this.api.put<void>("/auth/forgot-password", JSON.stringify(body), { baseURL: this.baseUrl }).then(r => r.status);
  }

  public async resetPassword(body: PasswordResetRequest) {
    return this.api.put<void>("/auth/reset-password", JSON.stringify(body), { baseURL: this.baseUrl }).then(r => r.status);
  }

  public async register(body: RegistrationRequest) {
    return this.api.post<AppUserRead>("/auth/register", JSON.stringify(body), { baseURL: this.baseUrl }).then(r => r.data);
  }

  public async verify(verification: string) {
    return this.api.get<JwtBundle>(`/auth/verify?verification=${verification}`, { baseURL: this.baseUrl }).then(r => r.data);
  }

  public async validateEmail(email: string) {
    return this.api.post<ValidateEmailResponse>("/auth/validate/email", email, { baseURL: this.baseUrl }).then(r => r.data);
  }

  public async validatePassword(password: string) {
    return this.api.post<ValidatePasswordResponse>("/auth/validate/password", password, { baseURL: this.baseUrl }).then(r => r.data);
  }

  public async validateToken(token: string) {
    return this.api.post<ValidateTokenResponse>("/auth/validate/token", token, { baseURL: this.baseUrl }).then(r => r.data);
  }

  public async validateUsername(username: string) {
    return this.api.post<ValidateUsernameResponse>("/auth/validate/username", username, { baseURL: this.baseUrl }).then(r => r.data);
  }

  public async verifyInvite(inviteId: string) {
    return this.api.get<AppInviteRead>(`/auth/invite?inviteId=${inviteId}`, { baseURL: this.baseUrl }).then(r => r.data);
  }

  public async transformInviteToUser(body: ConfirmInviteRequest) {
    return this.api.post<AppUserRead>("/auth/invite", JSON.stringify(body), { baseURL: this.baseUrl }).then(r => r.data);
  }

  public authHeader(token: string) {
    return { headers: { Authorization: `Bearer ${token}` }, baseUrl: this.baseUrl };
  }
}

export type ValidateEmailResponse = ValidationResponse;
export type ValidatePasswordResponse = ValidationResponse;
export type ValidateTokenResponse = ValidationResponse;
export type ValidateUsernameResponse = ValidationResponse;

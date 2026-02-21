import { getOAuthCallbackURL } from "@/utils/getOAuthCallbackURL";
import { Service } from "./service";

export class AuthService extends Service {
  static async exchangeCodeForToken(
    code: string,
  ): Promise<AuthService.ExchangeCodeForTokenResponse> {
    const response =
      await AuthService.client.post<AuthService.ExchangeCodeForTokenResponse>(
        "/auth/exchange-code",
        null,
        {
          params: {
            code,
            redirectUri: getOAuthCallbackURL(),
          },
        },
      );

    return response.data;
  }

  static async refreshToken(): Promise<void> {
    await AuthService.client.post<AuthService.RefreshTokenResponse>(
      "/auth/refresh-token",
    );
  }

  static async signOut() {
    await AuthService.client.post("/auth/sign-out");
  }
}

export namespace AuthService {
  export type ExchangeCodeForTokenResponse = {
    accessToken: string;
    refreshToken: string;
  };

  export type RefreshTokenInput = {
    refreshToken: string;
  };

  export type RefreshTokenResponse = {
    accessToken: string;
    refreshToken: string;
  };
}

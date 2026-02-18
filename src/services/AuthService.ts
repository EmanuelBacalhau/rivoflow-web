import { getOAuthCallbackURL } from "@/utils/getOAuthCallbackURL";
import { Service } from "./Service";

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
}

export namespace AuthService {
  export type ExchangeCodeForTokenResponse = {
    accessToken: string;
    refreshToken: string;
  };
}

import { destroyCookie, parseCookies, setCookie } from "nookies";

const BASE_OPTIONS = { path: "/", sameSite: "strict" } as const;

const ACCESS_TOKEN_OPTIONS = {
  ...BASE_OPTIONS,
  maxAge: 60 * 15,
} as const;

const REFRESH_TOKEN_OPTIONS = {
  ...BASE_OPTIONS,
  maxAge: 60 * 60 * 24 * 30,
} as const;

export class AuthTokensManager {
  static readonly ACCESS_TOKEN_KEY = "rivoflow-access-token";
  static readonly REFRESH_TOKEN_KEY = "rivoflow-refresh-token";

  static save(tokens: AuthTokensManager.Tokens) {
    setCookie(
      null,
      AuthTokensManager.ACCESS_TOKEN_KEY,
      tokens.accessToken,
      ACCESS_TOKEN_OPTIONS,
    );
    setCookie(
      null,
      AuthTokensManager.REFRESH_TOKEN_KEY,
      tokens.refreshToken,
      REFRESH_TOKEN_OPTIONS,
    );
  }

  static async load(): Promise<AuthTokensManager.Tokens | null> {
    const cookies = parseCookies(null);

    const accessToken = cookies[AuthTokensManager.ACCESS_TOKEN_KEY];
    const refreshToken = cookies[AuthTokensManager.REFRESH_TOKEN_KEY];

    if (accessToken && refreshToken) {
      return { accessToken, refreshToken };
    }

    return null;
  }

  static clear() {
    destroyCookie(null, AuthTokensManager.ACCESS_TOKEN_KEY, { path: "/" });
    destroyCookie(null, AuthTokensManager.REFRESH_TOKEN_KEY, { path: "/" });
  }
}

export namespace AuthTokensManager {
  export type Tokens = {
    accessToken: string;
    refreshToken: string;
  };
}

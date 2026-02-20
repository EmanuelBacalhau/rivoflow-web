import { useQueryClient } from "@tanstack/react-query";
import {
  type PropsWithChildren,
  useCallback,
  useLayoutEffect,
  useState,
} from "react";
import { useForceRender } from "@/hooks/app/useForceRender";
import { useAccount } from "@/hooks/queries/useAccount";
import { AuthTokensManager } from "@/lib/AuthTokenManager";
import { AuthService } from "@/services/AuthService";
import { Service } from "@/services/Service";
import { AuthContext } from "./AuthProvider";

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const forceRender = useForceRender();
  const { account, loadAccount } = useAccount({ enabled: false });
  const [isReady, setIsReady] = useState(false);

  const signOut = useCallback(() => {
    Service.removeAccessToken();
    Service.removeRefreshTokenHandler();

    AuthTokensManager.clear();
    queryClient.clear();

    forceRender();
  }, [queryClient, forceRender]);

  const applyTokens = useCallback(
    async (tokens: AuthTokensManager.Tokens) => {
      Service.setAccessToken(tokens.accessToken);
      Service.setRefreshTokenHandler(async () => {
        const storedTokens = await AuthTokensManager.load();

        if (storedTokens) {
          Service.setAccessToken(storedTokens.accessToken);
        } else {
          signOut();
        }
      });

      await loadAccount();
    },
    [loadAccount, signOut],
  );

  useLayoutEffect(() => {
    async function load() {
      const tokens = await AuthTokensManager.load();

      if (tokens) {
        await applyTokens(tokens);
      }

      setIsReady(true);
    }

    load();
  }, [applyTokens]);

  const signInWithCode = useCallback(
    async (code: string) => {
      const tokens = await AuthService.exchangeCodeForToken(code);
      AuthTokensManager.save(tokens);
      await applyTokens(tokens);
    },
    [applyTokens],
  );

  if (!isReady) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{ signedIn: !!account, signInWithCode, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

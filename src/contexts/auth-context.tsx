"use client";

import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import { FlowLoading } from "@/components/flow-loading";
import { useAccount } from "@/hooks/queries/useAccount";
import { AuthService } from "@/services/auth-service";
import { Service } from "@/services/service";

interface AuthContextType {
  signedIn: boolean;
  signOut: (skipApiCall?: boolean) => void;
}

export const AuthContext = createContext({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const { me, loadAccount } = useAccount({ enabled: false });
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isAuthRoute = pathname.startsWith("/auth");
  const isAuthCallbackRoute = pathname.startsWith("/auth/callback");

  const signOut = useCallback(
    async (skipApiCall = false) => {
      queryClient.clear();
      Service.removeRefreshTokenHandler();
      if (skipApiCall) await AuthService.signOut();
      router.push("/");
    },
    [queryClient, router],
  );

  const setupAuth = useCallback(async () => {
    Service.setRefreshTokenHandler(async () => {
      await AuthService.refreshToken();
    });

    if (!isAuthCallbackRoute) {
      await loadAccount();
    }

    setIsReady(true);
  }, [loadAccount, isAuthCallbackRoute]);

  useLayoutEffect(() => {
    setupAuth();
  }, [setupAuth]);

  useLayoutEffect(() => {
    if (!isReady) return;

    if (!me && !isAuthRoute) router.replace("/auth/google");
    else if (me && isAuthRoute) router.replace("/dashboard");
  }, [isReady, me, router, isAuthRoute]);

  if (!isReady || (isAuthRoute && me) || (!isAuthRoute && !me)) {
    return <FlowLoading />;
  }

  return (
    <AuthContext.Provider value={{ signedIn: !!me, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

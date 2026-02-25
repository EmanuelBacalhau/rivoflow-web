"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
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

    await loadAccount();

    setIsReady(true);
  }, [loadAccount]);

  useLayoutEffect(() => {
    setupAuth();
  }, [setupAuth]);

  useLayoutEffect(() => {
    if (!isReady) return;

    if (!me) {
      router.replace("/auth/google");
      return;
    }
  }, [isReady, me, router]);

  if (!isReady || !me) {
    return <FlowLoading />;
  }

  return (
    <AuthContext.Provider value={{ signedIn: !!me, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

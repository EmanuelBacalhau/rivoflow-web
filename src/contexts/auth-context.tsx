"use client";

import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
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
  const isInitialCallbackRoute = useRef(pathname?.startsWith("/auth/callback"));

  const signOut = useCallback(
    async (skipApiCall = false) => {
      queryClient.clear();
      Service.removeRefreshTokenHandler();
      if (!skipApiCall) {
        try {
          await AuthService.signOut();
        } catch {}
      }
      router.push("/");
    },
    [queryClient, router],
  );

  const setupAuth = useCallback(async () => {
    Service.setRefreshTokenHandler(async () => {
      try {
        await AuthService.refreshToken();
      } catch {
        await signOut(true);
      }
    });

    if (!isInitialCallbackRoute.current) {
      await loadAccount();
    }

    setIsReady(true);
  }, [loadAccount, signOut]);

  useLayoutEffect(() => {
    setupAuth();
  }, [setupAuth]);

  const isPublicRoute =
    pathname === "/" ||
    pathname?.startsWith("/auth") ||
    pathname === "/terms" ||
    pathname === "/privacy";

  useLayoutEffect(() => {
    if (!isReady) return;

    if (!me && !isPublicRoute) {
      router.replace("/");
    } else if (me && isPublicRoute) {
      router.replace("/dashboard");
    }
  }, [isReady, me, isPublicRoute, router]);

  if (!isReady || (!me && !isPublicRoute) || (me && isPublicRoute)) {
    return <FlowLoading />;
  }

  return (
    <AuthContext.Provider value={{ signedIn: !!me, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

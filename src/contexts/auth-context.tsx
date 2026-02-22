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
  signOut: () => void;
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

  const signOut = useCallback(async () => {
    queryClient.clear();
    Service.removeRefreshTokenHandler();
    await AuthService.signOut();
    router.push("/");
  }, [queryClient, router]);

  const setupAuth = useCallback(async () => {
    Service.setRefreshTokenHandler(async () => {
      try {
        await AuthService.refreshToken();
      } catch {
        await signOut();
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

  useLayoutEffect(() => {
    if (!isReady) return;

    const isPublicRoute =
      pathname === "/" ||
      pathname.startsWith("/auth") ||
      pathname === "/terms" ||
      pathname === "/privacy";

    if (!me && !isPublicRoute) {
      router.replace("/");
    } else if (me && isPublicRoute) {
      router.replace("/dashboard");
    }
  }, [isReady, me, pathname, router]);

  if (!isReady) {
    return <FlowLoading />;
  }

  return (
    <AuthContext.Provider value={{ signedIn: !!me, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

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
import { useAccount } from "@/hooks/queries/useAccount";
import { AuthService } from "@/services/auth-service";
import { Service } from "@/services/service";

interface AuthContextType {
  signedIn: boolean;
  signInWithCode: (code: string) => Promise<void>;
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

  const signOut = useCallback(async () => {
    queryClient.clear();
    Service.removeRefreshTokenHandler();
    await AuthService.signOut();
    router.push("/");
  }, [queryClient, router]);

  console.log(isReady);

  const setupAuth = useCallback(async () => {
    Service.setRefreshTokenHandler(async () => {
      try {
        await AuthService.refreshToken();
        await loadAccount();
        setIsReady(true);
      } catch {
        await signOut();
      }
    });
  }, [loadAccount, signOut]);

  useLayoutEffect(() => {
    setupAuth();
    setIsReady(true);
  }, [setupAuth]);

  const signInWithCode = async (code: string) => {
    await AuthService.exchangeCodeForToken(code);
    await setupAuth();
    router.push("/");
  };

  if (!isReady) {
    return <h1>djadkljasl</h1>;
  }

  return (
    <AuthContext.Provider value={{ signedIn: !!me, signInWithCode, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

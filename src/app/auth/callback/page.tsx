"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { Background } from "@/components/background";
import { useAccount } from "@/hooks/queries/useAccount";
import { AuthService } from "@/services/auth-service";

export default function AuthCallbackPage() {
  const router = useRouter();
  const queryParams = useSearchParams();
  const code = queryParams.get("code");
  const { loadAccount } = useAccount({ enabled: false });

  const { mutate } = useMutation({
    mutationFn: async (authCode: string) => {
      await AuthService.exchangeCodeForToken(authCode);
      await loadAccount();
    },
    onSuccess: () => {
      router.replace("/dashboard");
    },
    onError: () => {
      router.replace("/auth/google");
    },
  });

  const calledRef = useRef(false);
  useEffect(() => {
    if (code && !calledRef.current) {
      calledRef.current = true;
      mutate(code);
    }
  }, [code, mutate]);

  // TODO: melhorar loading state, talvez com um spinner ou algo do tipo
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
      <Background />
      <div className="w-10 h-10 rounded-full border-4 border-border border-t-indigo-500 animate-spin" />
      <p className="text-sm text-muted-foreground">Autenticando...</p>
    </div>
  );
}

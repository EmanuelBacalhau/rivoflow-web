"use client";

import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { Background } from "@/components/background";
import { AuthService } from "@/services/auth-service";

export function AuthCallbackContent() {
  const router = useRouter();
  const queryParams = useSearchParams();
  const code = queryParams.get("code");

  const { mutate } = useMutation({
    mutationFn: async (authCode: string) => {
      await AuthService.exchangeCodeForToken(authCode);
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      <Background />

      <div className="relative z-10 flex flex-col items-center gap-8 animate-fade-in">
        {/* Logo with glow */}
        <div className="relative">
          <div className="absolute -inset-6 bg-purple-500/15 blur-3xl rounded-full animate-glow-pulse" />
          <div className="relative w-20 h-20 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center shadow-2xl shadow-purple-500/10">
            <Image
              src="/logo.png"
              alt="RivoFlow"
              width={36}
              height={36}
              priority
              className="rounded-lg w-auto h-auto"
            />
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-xl font-semibold font-display text-white">
            Entrando no RivoFlow
          </h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            Verificando suas credenciais e preparando seu workspace...
          </p>
        </div>

        {/* Loading bar */}
        <div className="w-48 h-1 rounded-full bg-white/5 overflow-hidden">
          <div className="h-full w-2/3 rounded-full bg-linear-to-r from-purple-500/0 via-purple-500 to-purple-500/0 animate-loading-slide" />
        </div>
      </div>
    </div>
  );
}

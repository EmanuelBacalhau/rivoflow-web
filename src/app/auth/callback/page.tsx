"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { AuthService } from "@/services/AuthService";

export default function AuthCallbackPage() {
  const router = useRouter();
  const queryParams = useSearchParams();
  const code = queryParams.get("code");

  const { mutate } = useMutation({
    mutationFn: async () => {
      await AuthService.exchangeCodeForToken(code!);
    },
    onSuccess: () => {
      router.replace("/dashboard");
    },
    onError: () => {
      router.replace("/auth/google");
    },
  });

  useEffect(() => {
    if (code) mutate();
  }, [code, mutate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
      {/* Spinner */}
      <div className="w-10 h-10 rounded-full border-4 border-border border-t-indigo-500 animate-spin" />
      <p className="text-sm text-muted-foreground">Autenticando...</p>
    </div>
  );
}

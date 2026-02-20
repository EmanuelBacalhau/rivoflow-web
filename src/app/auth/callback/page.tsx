"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "@/contexts/AuthContext/AuthProvider";

export default function AuthCallbackPage() {
  const router = useRouter();
  const queryParams = useSearchParams();
  const code = queryParams.get("code");
  const { signInWithCode } = useContext(AuthContext);

  const { mutate } = useMutation({
    mutationFn: async (authCode: string) => {
      await signInWithCode(authCode);
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
      {/* Spinner */}
      <div className="w-10 h-10 rounded-full border-4 border-border border-t-indigo-500 animate-spin" />
      <p className="text-sm text-muted-foreground">Autenticando...</p>
    </div>
  );
}

import Image from "next/image";
import { Suspense } from "react";
import { Background } from "@/components/background";
import { AuthCallbackContent } from "./auth-callback-content";

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<AuthCallbackFallback />}>
      <AuthCallbackContent />
    </Suspense>
  );
}

function AuthCallbackFallback() {
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
            Autenticando
          </h2>
          <p className="text-sm text-muted-foreground">
            Conectando sua conta Google ao RivoFlow...
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

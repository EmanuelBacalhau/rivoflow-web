"use client";

import { ArrowRightIcon, ShieldCheckIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Background } from "@/components/background";
import { env } from "@/env";
import { getOAuthCallbackURL } from "@/utils/getOAuthCallbackURL";

function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function GoogleLoginPage() {
  function handleGoogleSignIn() {
    const authorizationUrl = env.NEXT_PUBLIC_OAUTH_AUTHORIZATION_URL;
    const clientId = env.NEXT_PUBLIC_CLIENT_ID;

    const params = new URLSearchParams({
      client_id: clientId,
      response_type: "code",
      redirect_uri: getOAuthCallbackURL(),
      identity_provider: "Google",
      scope: "email openid profile",
      prompt: "select_account",
    });

    window.location.href = `${authorizationUrl}?${params}`;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4">
      <Background />

      {/* ─── LOGIN CARD ─── */}
      <div className="relative z-10 w-full max-w-sm animate-scale-in">
        <div className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-xl p-8 shadow-2xl shadow-purple-500/5">
          <div className="flex flex-col items-center gap-7">
            {/* Logo with glow */}
            <div className="relative">
              <div className="absolute -inset-5 bg-purple-500/15 blur-2xl rounded-full animate-glow-pulse" />
              <Link
                href="/"
                className="relative flex flex-col items-center gap-2.5"
              >
                <Image
                  src="/logo.png"
                  alt="RIVOFLOW"
                  width={48}
                  height={48}
                  className="rounded-xl"
                />
                <span className="text-lg font-semibold font-display tracking-tight text-white">
                  RivoFlow
                </span>
              </Link>
            </div>

            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold font-display text-white">
                Bem-vindo(a)
              </h2>
              <p className="text-sm text-muted-foreground">
                Entre com sua conta Google para começar a criar
              </p>
            </div>

            {/* Google button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 rounded-xl bg-white text-neutral-800 px-5 py-3 text-sm font-semibold hover:bg-neutral-50 active:bg-neutral-100 transition-all duration-200 cursor-pointer shadow-lg shadow-white/5 group"
            >
              <GoogleIcon />
              Continuar com o Google
              <ArrowRightIcon className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Divider */}
            <div className="w-full flex items-center gap-4">
              <div className="flex-1 h-px bg-white/8" />
              <span className="text-[10px] text-muted-foreground/40 uppercase tracking-widest">
                Seguro
              </span>
              <div className="flex-1 h-px bg-white/8" />
            </div>

            {/* Trust signals */}
            <div className="flex items-center gap-4 text-[11px] text-muted-foreground/50">
              <div className="flex items-center gap-1.5">
                <ShieldCheckIcon className="w-3 h-3" />
                <span>Dados protegidos</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-white/10" />
              <span>Sem cartão</span>
            </div>
          </div>
        </div>

        {/* Footer links */}
        <p className="text-center text-[11px] text-muted-foreground/40 mt-6 leading-relaxed">
          Ao continuar, você concorda com nossos{" "}
          <Link
            href="/terms"
            className="underline underline-offset-2 hover:text-foreground/60 transition-colors"
          >
            Termos
          </Link>{" "}
          e{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-2 hover:text-foreground/60 transition-colors"
          >
            Privacidade
          </Link>
        </p>
      </div>
    </div>
  );
}

"use client";

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
      width="18"
      height="18"
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <Background />

      <div className="w-full max-w-sm flex-1 flex items-center justify-center relative z-10">
        <div className="rounded-xl border border-border bg-card p-8 shadow-lg w-full animate-scale-in">
          <div className="flex flex-col items-center gap-6">
            <Link href="/" className="flex flex-col items-center gap-2">
              <Image
                src="/logo.png"
                alt="RIVOFLOW"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="text-base font-semibold tracking-tight">
                RIVOFLOW
              </span>
            </Link>

            <div className="w-full h-px bg-border" />

            <div className="text-center space-y-1">
              <h1 className="text-lg font-semibold">Bem-vindo(a)</h1>
              <p className="text-[13px] text-muted-foreground">
                Entre com sua conta Google para continuar
              </p>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-2.5 rounded-lg border border-border bg-white text-neutral-800 px-4 py-2.5 text-sm font-medium hover:bg-neutral-50 active:bg-neutral-100 transition-colors cursor-pointer"
            >
              <GoogleIcon />
              Continuar com o Google
            </button>

            <p className="text-center text-[11px] text-muted-foreground leading-relaxed">
              Ao continuar, você concorda com nossos{" "}
              <Link
                href="/terms"
                className="underline underline-offset-2 hover:text-foreground transition-colors"
              >
                Termos
              </Link>{" "}
              e{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-2 hover:text-foreground transition-colors"
              >
                Privacidade
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

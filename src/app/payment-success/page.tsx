"use client";

import { CheckCircle2Icon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Background } from "@/components/background";
import { useAccount } from "@/hooks/queries/useAccount";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [prePaymentCredits, setPrePaymentCredits] = useState<number | null>(
    null,
  );
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("prePaymentCredits");
    setPrePaymentCredits(saved ? parseInt(saved, 10) : null);
    setIsInitializing(false);
  }, []);

  const { me } = useAccount({
    enabled: !isInitializing,
    refetchInterval: (query) => {
      if (isInitializing || prePaymentCredits === null) return false;

      const currentCredits = query.state.data?.balance?.credits ?? 0;
      if (currentCredits > prePaymentCredits) return false;

      return 2500;
    },
  });

  useEffect(() => {
    if (isInitializing) return;

    let timeout: NodeJS.Timeout;

    if (prePaymentCredits === null) {
      timeout = setTimeout(() => {
        setIsRedirecting(true);
        router.push("/dashboard");
      }, 4000);
      return;
    }

    const currentCredits = me?.balance?.credits ?? 0;
    if (currentCredits > prePaymentCredits) {
      localStorage.removeItem("prePaymentCredits");
      timeout = setTimeout(() => {
        setIsRedirecting(true);
        router.push("/dashboard");
      }, 4000);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isInitializing, me?.balance?.credits, prePaymentCredits, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
      <Background />
      <div className="mb-6 relative">
        <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full animate-pulse" />
        <CheckCircle2Icon className="size-24 text-green-500 relative z-10 animate-[bounce_1s_ease-in-out_infinite]" />
      </div>

      <h1 className="text-3xl font-bold bg-linear-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent mb-4">
        Pagamento Aprovado!
      </h1>

      <p className="text-muted-foreground max-w-md mb-8">
        Seus créditos foram adicionados com sucesso à sua conta. Estamos
        sincronizando suas informações...
      </p>

      {isRedirecting ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
          <Loader2Icon className="size-4 animate-spin" />
          <span>Redirecionando para o Dashboard...</span>
        </div>
      ) : (
        <div className="h-6" />
      )}
    </div>
  );
}

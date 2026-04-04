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

  const currentCredits = me?.balance?.credits ?? 0;
  const creditsUpdated =
    prePaymentCredits !== null && currentCredits > prePaymentCredits;

  return (
    <main
      className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center relative"
      aria-busy={!isRedirecting && !creditsUpdated}
    >
      <Background />

      <div className="relative z-10 animate-scale-in">
        <div className="mb-6" aria-hidden="true">
          <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
            <CheckCircle2Icon className="size-10 text-green-400" />
          </div>
        </div>

        <h1 className="text-2xl font-bold font-display mb-2">
          Pagamento aprovado
        </h1>

        <p className="text-sm text-muted-foreground max-w-sm mb-8">
          {creditsUpdated
            ? "Seus créditos foram adicionados com sucesso!"
            : "Sincronizando seus créditos..."}
        </p>

        {isRedirecting ? (
          <output className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2Icon className="size-3.5 animate-spin" aria-hidden="true" />
            <span>Redirecionando...</span>
          </output>
        ) : (
          <output
            className="flex justify-center"
            aria-label="Sincronizando créditos"
          >
            <Loader2Icon
              className="size-4 animate-spin text-muted-foreground"
              aria-hidden="true"
            />
          </output>
        )}
      </div>
    </main>
  );
}

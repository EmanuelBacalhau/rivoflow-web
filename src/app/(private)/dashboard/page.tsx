"use client";

import {
  CircleDollarSignIcon,
  LayersIcon,
  PlusIcon,
  SearchIcon,
  SparklesIcon,
  ZapIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import { CreateFlowDialog } from "@/components/create-flow-dialog";
import { ListFlows } from "@/components/list-flows";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateLinkCharge } from "@/hooks/mutations/useCreateLinkCharge";
import { useAccount } from "@/hooks/queries/useAccount";
import { useFlows } from "@/hooks/queries/useFlows";
import { useSimulateCredits } from "@/hooks/queries/useSimulateCredits";

const MIN_CREDITS_IN_REALS = 20;

export default function DashboardPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { flows, isLoading } = useFlows();
  const [search, setSearch] = useState("");
  const { me } = useAccount();
  const [credits, setCredits] = useState<number>(MIN_CREDITS_IN_REALS);
  const [debouncedCredits, setDebouncedCredits] =
    useState<number>(MIN_CREDITS_IN_REALS);
  const { createLinkCharge, isCreatingLinkCharge } = useCreateLinkCharge();

  const { simulatedCredits, isSimulating } = useSimulateCredits(
    debouncedCredits,
    debouncedCredits >= MIN_CREDITS_IN_REALS,
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCredits(credits);
    }, 500);
    return () => clearTimeout(timer);
  }, [credits]);

  const filteredFlows = useMemo(() => {
    return flows.filter((flow) =>
      flow.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [flows, search]);

  const fastCredits = [30, 50, 100, 200];

  const handleCreateLinkCharge = async () => {
    try {
      if (me?.balance.credits !== undefined) {
        localStorage.setItem(
          "prePaymentCredits",
          me.balance.credits.toString(),
        );
      }
      const result = await createLinkCharge({ amount: credits });
      window.location.href = result.link;
    } catch {
      toast.error("Erro ao criar link de pagamento. Tente novamente.");
    }
  };

  const firstName = me?.account.firstName || "";

  return (
    <div className="flex flex-col flex-1 min-h-0 px-8 py-8">
      {/* Actions bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-bold font-display mb-1">
            {firstName ? `Olá, ${firstName}` : "Bem-vindo"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerencie seus fluxos e crie novos criativos com IA.
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-3 shrink-0">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <CircleDollarSignIcon className="size-4 mr-1.5" />
                Créditos
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Comprar créditos</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                Saldo atual:{" "}
                <span className="font-semibold text-foreground">
                  {me?.balance.credits ?? 0} créditos
                </span>
              </DialogDescription>

              <div className="grid grid-cols-4 gap-2">
                {fastCredits.map((c) => (
                  <Button
                    key={c}
                    variant={credits === c ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setCredits(c);
                      setDebouncedCredits(c);
                    }}
                    className={credits !== c ? "border-white/8 bg-white/3" : ""}
                  >
                    {c.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </Button>
                ))}
              </div>

              <div>
                <NumericFormat
                  value={credits}
                  displayType={"input"}
                  thousandSeparator={true}
                  prefix={"R$ "}
                  decimalScale={2}
                  min={MIN_CREDITS_IN_REALS}
                  fixedDecimalScale={true}
                  onValueChange={(values) => setCredits(values.floatValue || 0)}
                  placeholder="R$ 0,00"
                  className="placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                />

                {credits < MIN_CREDITS_IN_REALS ? (
                  <p className="text-xs text-destructive text-right mt-1.5">
                    Valor mínimo:{" "}
                    {MIN_CREDITS_IN_REALS.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                ) : (
                  <div className="flex justify-end mt-1.5 min-h-5">
                    {isSimulating ? (
                      <p className="text-xs text-muted-foreground animate-pulse">
                        Calculando...
                      </p>
                    ) : simulatedCredits !== undefined ? (
                      <p className="text-xs text-muted-foreground">
                        Você receberá{" "}
                        <span className="font-medium text-foreground">
                          {simulatedCredits} créditos
                        </span>
                      </p>
                    ) : null}
                  </div>
                )}
              </div>

              <Button
                disabled={
                  credits < MIN_CREDITS_IN_REALS ||
                  isCreatingLinkCharge ||
                  isSimulating
                }
                onClick={handleCreateLinkCharge}
                className="shadow-lg shadow-primary/20"
              >
                {isCreatingLinkCharge
                  ? "Redirecionando..."
                  : "Comprar créditos"}
              </Button>
            </DialogContent>
          </Dialog>

          <Button size="sm" onClick={() => setIsCreateOpen(true)}>
            <PlusIcon className="size-4 mr-1.5" />
            Novo flow
          </Button>
        </div>
      </div>

      {/* Stats */}
      <section
        aria-label="Estatísticas"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
      >
        <div className="p-5 rounded-xl border border-white/8 bg-white/3 backdrop-blur-sm">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <LayersIcon className="w-4 h-4 text-purple-400" />
            </div>
            <span className="text-sm text-muted-foreground font-medium">
              Flows
            </span>
          </div>
          <p className="text-3xl font-bold font-display tabular-nums">
            {flows.length}
          </p>
        </div>

        <div className="p-5 rounded-xl border border-white/8 bg-white/3 backdrop-blur-sm">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <ZapIcon className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-sm text-muted-foreground font-medium">
              Créditos
            </span>
          </div>
          <p className="text-3xl font-bold font-display tabular-nums">
            {me?.balance.credits ?? 0}
          </p>
        </div>

        <div className="p-5 rounded-xl border border-white/8 bg-white/3 backdrop-blur-sm">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <SparklesIcon className="w-4 h-4 text-green-400" />
            </div>
            <span className="text-sm text-muted-foreground font-medium">
              Gerados
            </span>
          </div>
          <p className="text-3xl font-bold font-display tabular-nums">
            {me?.balance.lifetimeSpent ?? 0}
          </p>
        </div>
      </section>

      {/* Flows */}
      <section aria-labelledby="flows-heading">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <h2
            id="flows-heading"
            className="text-base font-semibold font-display"
          >
            Seus flows
          </h2>

          <div className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/3 backdrop-blur-sm px-3 py-2 text-sm w-full md:max-w-64 focus-within:border-purple-500/30 focus-within:ring-1 focus-within:ring-purple-500/15 transition-all">
            <SearchIcon
              className="size-4 text-muted-foreground shrink-0"
              aria-hidden="true"
            />
            <label htmlFor="search-flows" className="sr-only">
              Buscar flows
            </label>
            <input
              id="search-flows"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar flows..."
              className="w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
            />
          </div>
        </div>

        <CreateFlowDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
        <ListFlows flows={filteredFlows} loading={isLoading} />
      </section>
    </div>
  );
}

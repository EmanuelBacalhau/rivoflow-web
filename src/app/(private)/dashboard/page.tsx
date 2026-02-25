"use client";

import { CircleDollarSignIcon, LayersIcon, SearchIcon } from "lucide-react";
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
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useCreateLinkCharge } from "@/hooks/mutations/useCreateLinkCharge";
import { useAccount } from "@/hooks/queries/useAccount";
import { useFlows } from "@/hooks/queries/useFlows";
import { useSimulateCredits } from "@/hooks/queries/useSimulateCredits";

const MIN_CREDITS_IN_REALS = 20;

export default function DashboardPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { isMobile } = useSidebar();
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

  return (
    <div className="p-8 flex flex-col flex-1">
      <div
        className={`flex gap-3 flex-col sticky top-0 z-20 bg-background py-4 space-y-4`}
      >
        <div
          className={`flex gap-3 ${isMobile ? "flex-col" : "flex-row justify-end"}`}
        >
          {isMobile && <SidebarTrigger size="icon-lg" />}

          <Button onClick={() => setIsCreateOpen(true)}>
            <LayersIcon className="mr-1 size-5" />
            Criar Flow
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <CircleDollarSignIcon className="mr-1 size-5" />
                Comprar Créditos
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créditos</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                Você tem {me?.balance.credits} créditos.
              </DialogDescription>

              <div className="grid items-center grid-cols-2 lg:grid-cols-4">
                {fastCredits.map((c) => (
                  <Button
                    key={c}
                    variant={credits === c ? "default" : "outline"}
                    onClick={() => {
                      setCredits(c);
                      setDebouncedCredits(c); // Immediate update for shortcut buttons
                    }}
                    className="mr-2 mb-2 transition-all"
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
                  onValueChange={(values) => {
                    setCredits(values.floatValue || 0);
                  }}
                  placeholder="R$ 0,00"
                  className="placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                />

                {credits < MIN_CREDITS_IN_REALS ? (
                  <p className="text-xs text-destructive text-right mt-1">
                    O valor mínimo para compra é de{" "}
                    {MIN_CREDITS_IN_REALS.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                    .
                  </p>
                ) : (
                  <div className="flex justify-end mt-1 min-h-[20px]">
                    {isSimulating ? (
                      <p className="text-xs text-muted-foreground animate-pulse">
                        Calculando créditos...
                      </p>
                    ) : simulatedCredits !== undefined ? (
                      <p className="text-xs text-muted-foreground">
                        Você receberá{" "}
                        <span className="font-semibold text-primary">
                          {simulatedCredits}
                        </span>{" "}
                        créditos
                      </p>
                    ) : null}
                  </div>
                )}
              </div>

              <Button
                disabled={
                  credits < MIN_CREDITS_IN_REALS || isCreatingLinkCharge
                }
                onClick={handleCreateLinkCharge}
              >
                {isCreatingLinkCharge ? "Criando link..." : "Comprar créditos"}
              </Button>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex justify-between items-center gap-3">
          <h1 className="text-xl flex items-center gap-2 font-semibold">
            <span>FLOWS</span>
            <span className="text-md text-muted-foreground">
              ({flows.length})
            </span>
          </h1>

          <div className="flex  items-center gap-2 rounded-md border border-border bg-secondary px-3 py-2 text-sm text-muted-foreground transition-colors focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
            <SearchIcon className="size-3 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar flows..."
              className="w-full bg-transparent text-sidebar-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>
        </div>
      </div>

      <CreateFlowDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />

      <ListFlows flows={filteredFlows} loading={isLoading} />
    </div>
  );
}

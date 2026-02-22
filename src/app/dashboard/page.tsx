"use client";

import { CircleDollarSignIcon, LayersIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import { NumericFormat } from "react-number-format";
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
import { useAccount } from "@/hooks/queries/useAccount";
import { useFlows } from "@/hooks/queries/useFlows";

const MIN_CREDITS_IN_REALS = 20;

export default function DashboardPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { isMobile } = useSidebar();
  const { flows, isLoading } = useFlows();
  const [search, setSearch] = useState("");
  const { me } = useAccount();
  const [credits, setCredits] = useState<number>(MIN_CREDITS_IN_REALS);

  const fastCredits = [30, 50, 100, 200];

  return (
    <div className="p-8 flex flex-col flex-1">
      <div
        className={`flex gap-3 flex-col sticky top-0 z-10 bg-background py-4 space-y-4`}
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
                <DialogTitle>Comprar Créditos</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                Você tem {me?.balance.credits} créditos.
              </DialogDescription>

              <div className="grid items-center grid-cols-2 lg:grid-cols-4">
                {fastCredits.map((c) => (
                  <Button
                    key={c}
                    variant="outline"
                    onClick={() => setCredits(c)}
                    className={`mr-2 mb-2 ${credits === c ? "bg-primary text-primary-foreground" : ""}`}
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

                {credits < MIN_CREDITS_IN_REALS && (
                  <p className="text-xs text-destructive text-right">
                    O valor mínimo para compra é de{" "}
                    {MIN_CREDITS_IN_REALS.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                    .
                  </p>
                )}
              </div>

              <Button disabled={credits < MIN_CREDITS_IN_REALS}>Comprar</Button>
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

      <ListFlows flows={flows} loading={isLoading} />
    </div>
  );
}

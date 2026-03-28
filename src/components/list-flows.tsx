import { LayersIcon } from "lucide-react";
import type { FlowService } from "@/services/flow-service";
import { CardFlow } from "./card-flow";
import { Skeleton } from "./ui/skeleton";

interface ListFlowsProps {
  flows: FlowService.Flow[];
  loading?: boolean;
}

export function ListFlows({ flows, loading }: ListFlowsProps) {
  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading &&
          Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              className="rounded-xl h-44 w-full"
              key={index.toString()}
            />
          ))}

        {flows.map((flow) => (
          <CardFlow key={flow.id} flow={flow} />
        ))}
      </div>

      {flows.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center gap-4 py-20">
          <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center">
            <LayersIcon className="size-7 text-muted-foreground/40" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">
              Nenhum flow encontrado
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Crie um novo flow para começar.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

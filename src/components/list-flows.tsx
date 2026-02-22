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
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
        {loading &&
          Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              className="flex items-center gap-2 rounded-md p-2 h-44 w-full"
              key={index.toString()}
            />
          ))}

        {flows.map((flow) => (
          <CardFlow key={flow.id} flow={flow} />
        ))}
      </div>

      {flows.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center gap-4 flex-1">
          <LayersIcon className="size-12 text-muted-foreground" />
          <p className="text-sm text-muted-foreground text-center">
            Nenhum flow encontrado. <br /> Crie um novo flow para começar.
          </p>
        </div>
      )}
    </>
  );
}

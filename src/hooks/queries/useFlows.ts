import { useQuery } from "@tanstack/react-query";
import { FlowService } from "@/services/flow-service";

export function useFlows() {
  const { data, isLoading } = useQuery({
    queryKey: ["flows"],
    queryFn: FlowService.getByAccount,
  });

  const flows: FlowService.Flow[] = data?.flows ?? [];

  return {
    flows,
    isLoading,
  };
}

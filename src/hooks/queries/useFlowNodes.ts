import { useQuery } from "@tanstack/react-query";
import { FlowService } from "@/services/flow-service";

interface UseFlowNodesParams {
  flowId: string | undefined;
  enabled?: boolean;
}

export function useFlowNodes(params: UseFlowNodesParams) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["flow", params.flowId],
    staleTime: 0,
    gcTime: 0,
    queryFn: () => FlowService.getById(params.flowId as string),
    enabled: params.enabled ?? Boolean(params.flowId),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    data,
    isLoading,
    isError,
  };
}

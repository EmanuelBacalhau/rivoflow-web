import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { queryClient } from "@/providers/main-provider";
import { FlowService } from "@/services/flow-service";
import type { GenerationImageNodeService } from "@/services/node/generation-image-node-service";
import { GenerationStatusEnum, NodeTypeEnum } from "@/types";

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
    refetchInterval: (query) => {
      const hasProcessingNodes = query.state.data?.nodes.some((node) => {
        if (node.data.type !== NodeTypeEnum.GENERATION_IMAGE) return false;
        const generationNode = node as GenerationImageNodeService.Node;

        const isQueued =
          generationNode.data.status === GenerationStatusEnum.QUEUED;
        const isProcessing =
          generationNode.data.status === GenerationStatusEnum.PROCESSING;

        return isProcessing || isQueued;
      });

      return hasProcessingNodes ? 5000 : false;
    },
  });

  const previousProcessingState = useRef(false);

  useEffect(() => {
    if (!data) return;

    const hasProcessingNodes = data.nodes.some((node) => {
      if (node.data.type !== NodeTypeEnum.GENERATION_IMAGE) return false;
      const generationNode = node as GenerationImageNodeService.Node;

      return (
        generationNode.data.status === GenerationStatusEnum.QUEUED ||
        generationNode.data.status === GenerationStatusEnum.PROCESSING
      );
    });

    if (previousProcessingState.current && !hasProcessingNodes) {
      queryClient.invalidateQueries({
        queryKey: ["account"],
      });
    }

    previousProcessingState.current = hasProcessingNodes;
  }, [data]);

  return {
    data,
    isLoading,
    isError,
  };
}

import { useMutation } from "@tanstack/react-query";
import type { Edge } from "@xyflow/react";
import type { Dispatch, SetStateAction } from "react";
import { EdgeService } from "@/services/EdgeService";

type CreateEdgeParams = {
  updateEdges: Dispatch<SetStateAction<Edge[]>>;
};

export function useCreateEdgeController({
  updateEdges: updateNodes,
}: CreateEdgeParams) {
  const { mutateAsync } = useMutation({
    mutationKey: ["createEdge"],
    mutationFn: async (paramsEdge: EdgeService.CreateParams) => {
      const response = await EdgeService.create(paramsEdge);
      return response.edge;
    },
    onSuccess: (edge) => {
      const { sourceNodeId, targetNodeId, id } = edge;

      updateNodes((prevEdges) => {
        return prevEdges.map((e) =>
          e.source === sourceNodeId && e.target === targetNodeId
            ? {
                id: id,
                source: sourceNodeId,
                target: targetNodeId,
              }
            : e,
        );
      });
    },
  });

  return {
    createEdge: mutateAsync,
  };
}

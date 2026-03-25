import { useMutation } from "@tanstack/react-query";
import type { Node } from "@xyflow/react";
import { isAxiosError } from "axios";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { ImageToVideoNodeService } from "@/services/node/image-to-video-node-service";

interface UpdateImageToVideoNodeParams {
  updateNodes: Dispatch<SetStateAction<Node[]>>;
}

export function useUpdateImageToVideoNodeController({
  updateNodes,
}: UpdateImageToVideoNodeParams) {
  const { mutateAsync } = useMutation({
    mutationKey: ["updateImageToVideoNode"],
    mutationFn: async (params: ImageToVideoNodeService.UpdateParams) => {
      await ImageToVideoNodeService.update(params);
    },
    onMutate: async (params) => {
      updateNodes((prevNodes) =>
        prevNodes.map((n) =>
          n.id === params.nodeId
            ? {
                ...n,
                data: {
                  ...n.data,
                  ...params.data,
                },
              }
            : n,
        ),
      );
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 404) return;
      toast.error("Erro ao atualizar configurações do vídeo.");
    },
  });

  return {
    updateImageToVideoNode: mutateAsync,
  };
}

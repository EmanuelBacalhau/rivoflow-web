import { useMutation } from "@tanstack/react-query";
import type { Node } from "@xyflow/react";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { ImageNodeService } from "@/services/node/ImageNodeService";

interface UploadImageNodeParams {
  updateNodes: Dispatch<SetStateAction<Node[]>>;
}

export function useUploadImageNodeController({
  updateNodes,
}: UploadImageNodeParams) {
  const { mutateAsync } = useMutation({
    mutationKey: ["uploadImageNode"],
    mutationFn: async (params: ImageNodeService.UploadImageParams) => {
      const response = await ImageNodeService.upload(params);
      return {
        key: response.key,
        nodeId: params.nodeId,
        flowId: params.flowId,
        imageUrl: response.imageUrl,
      };
    },
    onMutate: async (params) => {
      const { nodeId, file } = params;

      const previewUrl = URL.createObjectURL(file);

      updateNodes((prevNodes) =>
        prevNodes.map((n) =>
          n.id === nodeId
            ? {
                ...n,
                data: {
                  ...n.data,
                  imageUrl: previewUrl,
                },
              }
            : n,
        ),
      );

      return { nodeId, previewUrl };
    },
    onSuccess: (response, _, context) => {
      const { nodeId, key, imageUrl, flowId } = response;

      if (context?.previewUrl) {
        URL.revokeObjectURL(context.previewUrl);
      }

      updateNodes((prevNodes) => {
        return prevNodes.map((n) =>
          n.id === nodeId
            ? {
                ...n,
                data: {
                  ...n.data,
                  key,
                  imageUrl,
                },
              }
            : n,
        );
      });

      ImageNodeService.confirmUpload({
        nodeId,
        flowId,
      });
    },
    onError: (_, __, context) => {
      if (context?.previewUrl) {
        URL.revokeObjectURL(context.previewUrl);
      }

      if (context?.nodeId) {
        updateNodes((prevNodes) =>
          prevNodes.map((n) =>
            n.id === context.nodeId
              ? {
                  ...n,
                  data: {
                    ...n.data,
                    imageUrl: "",
                  },
                }
              : n,
          ),
        );
      }

      toast.error("Erro ao fazer upload da imagem. Tente novamente.");
    },
  });

  return {
    uploadImageNode: mutateAsync,
  };
}

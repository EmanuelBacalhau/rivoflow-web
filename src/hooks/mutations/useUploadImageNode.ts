import { useMutation } from "@tanstack/react-query";
import type { Node } from "@xyflow/react";
import { isAxiosError } from "axios";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { ImageNodeService } from "@/services/node/image-node-service";

interface UploadImageNodeParams {
  updateNodes: Dispatch<SetStateAction<Node[]>>;
  isDeleted?: (nodeId: string) => boolean;
  onUploadComplete?: (nodeId: string) => void;
}

export function useUploadImageNodeController({
  updateNodes,
  isDeleted,
  onUploadComplete,
}: UploadImageNodeParams) {
  const { mutateAsync } = useMutation({
    mutationKey: ["uploadImageNode"],
    mutationFn: async (params: ImageNodeService.UploadImageParams) => {
      const response = await ImageNodeService.upload(params);
      await ImageNodeService.confirmUpload({
        nodeId: params.nodeId,
        flowId: params.flowId,
      });
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
      const { nodeId, key, imageUrl } = response;

      if (context?.previewUrl) {
        URL.revokeObjectURL(context.previewUrl);
      }

      if (isDeleted?.(nodeId)) return;

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

      onUploadComplete?.(nodeId);
    },
    onError: (error, _, context) => {
      if (context?.previewUrl) {
        URL.revokeObjectURL(context.previewUrl);
      }

      if (isAxiosError(error) && error.response?.status === 404) return;

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

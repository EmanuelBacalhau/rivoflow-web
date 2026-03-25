import { useMutation } from "@tanstack/react-query";
import type { Node } from "@xyflow/react";
import { isAxiosError } from "axios";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { FileNodeService } from "@/services/node/file-node-service";

interface UploadImageNodeParams {
  updateNodes: Dispatch<SetStateAction<Node[]>>;
  isDeleted?: (nodeId: string) => boolean;
  onUploadComplete?: (nodeId: string, isVideo: boolean) => void;
}

export function useUploadImageNodeController({
  updateNodes,
  isDeleted,
  onUploadComplete,
}: UploadImageNodeParams) {
  const { mutateAsync } = useMutation({
    mutationKey: ["uploadImageNode"],
    mutationFn: async (params: FileNodeService.UploadParams) => {
      const response = await FileNodeService.upload(params);
      return {
        key: response.key,
        nodeId: params.nodeId,
        flowId: params.flowId,
        fileUrl: response.fileUrl,
        isVideo: params.file.type.startsWith("video/"),
      };
    },
    onMutate: async (params) => {
      const { nodeId, file } = params;
      const isVideo = file.type.startsWith("video/");

      const previewUrl = URL.createObjectURL(file);

      updateNodes((prevNodes) =>
        prevNodes.map((n) =>
          n.id === nodeId
            ? {
                ...n,
                data: {
                  ...n.data,
                  ...(isVideo
                    ? { videoUrl: previewUrl }
                    : { imageUrl: previewUrl }),
                },
              }
            : n,
        ),
      );

      return { nodeId, previewUrl, isVideo };
    },
    onSuccess: (response, _, context) => {
      const { nodeId, key, fileUrl, isVideo } = response;

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
                  ...(isVideo ? { videoUrl: fileUrl } : { imageUrl: fileUrl }),
                },
              }
            : n,
        );
      });

      onUploadComplete?.(nodeId, isVideo);
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
                    ...(context.isVideo
                      ? { videoUrl: undefined }
                      : { imageUrl: undefined }),
                  },
                }
              : n,
          ),
        );
      }

      toast.error("Erro ao fazer upload. Tente novamente.");
    },
  });

  return {
    uploadImageNode: mutateAsync,
  };
}

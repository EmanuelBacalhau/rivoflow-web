import { useMutation } from "@tanstack/react-query";
import type { Node } from "@xyflow/react";
import type { Dispatch, SetStateAction } from "react";
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
        imageUrl: response.imageUrl,
      };
    },
    onSuccess: (response) => {
      const { nodeId, key, imageUrl } = response;

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
    },
  });

  return {
    uploadImageNode: mutateAsync,
  };
}

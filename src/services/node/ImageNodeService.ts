import { type ImageNode, NodeTypeEnum, type Position } from "@/types/node";
import { Service } from "../Service";

export class ImageNodeService extends Service {
  static async create(
    params: ImageNodeService.CreateParams,
  ): Promise<ImageNodeService.CreateImageNodeResponse> {
    const response =
      await ImageNodeService.client.post<ImageNodeService.CreateImageNodeResponse>(
        "/nodes",
        {
          nodeType: NodeTypeEnum.IMAGE,
          position: params.position,
          flowId: params.flowId,
        },
      );

    return {
      node: response.data.node,
    };
  }

  static async upload(
    params: ImageNodeService.UploadImageParams,
  ): Promise<ImageNodeService.UploadImageResponse> {
    const file = {
      type: params.file.type,
      size: params.file.size,
    };

    const response =
      await ImageNodeService.client.post<ImageNodeService.UploadImageAxiosResponse>(
        `/nodes/${params.nodeId}/upload`,
        {
          flowId: params.flowId,
          file,
        },
      );
    const { uploadSignature, key, imageUrl } = response.data;

    await ImageNodeService.uploadPresignedPOST({
      uploadSignature,
      file: params.file,
    });

    return { key, imageUrl };
  }

  static async confirmUpload(params: ImageNodeService.ConfirmUploadParams) {
    await ImageNodeService.client.patch(
      `/nodes/${params.nodeId}/confirm-upload`,
      {
        flowId: params.flowId,
      },
    );
  }
}

export namespace ImageNodeService {
  export type Node = ImageNode;

  export type CreateParams = {
    position: Position;
    flowId: string;
  };

  export type CreateImageNodeResponse = {
    node: Node;
  };

  export type UploadImageParams = {
    nodeId: string;
    flowId: string;
    file: File;
  };

  export type UploadImageResponse = {
    key: string;
    imageUrl: string;
  };

  export type UploadImageAxiosResponse = {
    uploadSignature: string;
    key: string;
    imageUrl: string;
  };

  export type ConfirmUploadParams = {
    nodeId: string;
    flowId: string;
  };
}

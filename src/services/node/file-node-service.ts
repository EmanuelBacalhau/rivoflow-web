import type { ImageNode, Position } from "@/types/node";
import { Service } from "../service";

export class FileNodeService extends Service {
  static async create(
    params: FileNodeService.CreateParams,
  ): Promise<FileNodeService.CreateResponse> {
    const response =
      await FileNodeService.client.post<FileNodeService.CreateResponse>(
        `/flows/${params.flowId}/nodes/file`,
        {
          position: params.position,
        },
      );

    return {
      node: response.data.node,
    };
  }

  static async upload(
    params: FileNodeService.UploadParams,
  ): Promise<FileNodeService.UploadResponse> {
    const file = {
      type: params.file.type,
      size: params.file.size,
    };

    const response =
      await FileNodeService.client.post<FileNodeService.UploadAxiosResponse>(
        `/flows/${params.flowId}/nodes/${params.nodeId}/upload`,
        { file },
      );
    const { uploadSignature, key, fileUrl } = response.data;

    await FileNodeService.uploadPresignedPOST({
      uploadSignature,
      file: params.file,
    });

    return { key, fileUrl };
  }
}

export namespace FileNodeService {
  export type Node = ImageNode;

  export type CreateParams = {
    position: Position;
    flowId: string;
  };

  export type CreateResponse = {
    node: Node;
  };

  export type UploadParams = {
    nodeId: string;
    flowId: string;
    file: File;
  };

  export type UploadResponse = {
    key: string;
    fileUrl: string;
  };

  export type UploadAxiosResponse = {
    uploadSignature: string;
    key: string;
    fileUrl: string;
  };
}

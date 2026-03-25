import type { Position } from "@/types/node";
import { Service } from "../service";

export class NodeService extends Service {
  static async updatePosition(
    params: NodeService.UpdateNodePositionParams,
  ): Promise<void> {
    await NodeService.client.patch(
      `/flows/${params.flowId}/nodes/${params.nodeId}/position`,
      {
        position: params.position,
      },
    );
  }

  static async delete(params: NodeService.DeleteNodeParams): Promise<void> {
    await NodeService.client.delete(
      `/flows/${params.flowId}/nodes/${params.nodeId}`,
    );
  }

  static async getMetadata(
    params: NodeService.GetMetadataParams,
  ): Promise<NodeService.GetMetadataResponse> {
    const response =
      await NodeService.client.get<NodeService.GetMetadataResponse>(
        `/flows/${params.flowId}/nodes/${params.nodeId}/metadata`,
      );
    return response.data;
  }
}

export namespace NodeService {
  export type UpdateNodePositionParams = {
    nodeId: string;
    flowId: string;
    position: Position;
  };

  export type DeleteNodeParams = {
    nodeId: string;
    flowId: string;
  };

  export type GetMetadataParams = {
    nodeId: string;
    flowId: string;
  };

  export type GetMetadataResponse = {
    ready: boolean;
    duration: number | null;
  };
}

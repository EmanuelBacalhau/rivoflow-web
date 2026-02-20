import type { Position } from "@/types/node";
import { Service } from "../Service";

export class NodeService extends Service {
  static async updatePosition(
    params: NodeService.UpdateNodePositionParams,
  ): Promise<void> {
    await NodeService.client.put(
      `/flows/${params.flowId}/nodes/${params.nodeId}`,
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
}

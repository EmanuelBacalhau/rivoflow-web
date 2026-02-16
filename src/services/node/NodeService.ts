import type { EdgeService } from "../EdgeService";
import { Service } from "../Service";
import type { GenerationImageNodeService } from "./GenerationImageNodeService";
import type { ImageNodeService } from "./ImageNodeService";
import type { PromptNodeService } from "./PromptNodeService";
import type { NodeTypeEnum, Position } from "./types";

export class NodeService extends Service {
  static async getNodesByFlowId(
    flowId: string,
  ): Promise<NodeService.GetNodesByFlowIdResponse> {
    const response =
      await NodeService.client.get<NodeService.GetNodesByFlowIdResponse>(
        `/flows/${flowId}`,
      );

    return response.data;
  }

  static async updatePosition(
    params: NodeService.UpdateNodePositionParams,
  ): Promise<void> {
    await NodeService.client.put(`/nodes/${params.nodeId}`, {
      nodeType: params.nodeType,
      position: params.position,
      flowId: params.flowId,
    });
  }

  static async delete(params: NodeService.DeleteNodeParams): Promise<void> {
    await NodeService.client.delete(
      `/nodes/${params.nodeId}/flows/${params.flowId}`,
    );
  }
}

export namespace NodeService {
  export type GetNodesByFlowIdResponse = {
    flow: {
      title: string;
      projectId: string;
      id: string;
      createdAt: string;
      updatedAt: string;
    };
    nodes: Array<
      | PromptNodeService.Node
      | ImageNodeService.Node
      | GenerationImageNodeService.Node
    >;
    edges: Array<EdgeService.Edge>;
  };

  export type UpdateNodePositionParams = {
    nodeType: NodeTypeEnum;
    nodeId: string;
    flowId: string;
    position: Position;
  };

  export type DeleteNodeParams = {
    nodeId: string;
    flowId: string;
  };
}

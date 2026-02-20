import {
  type NodeDataPrompt,
  NodeTypeEnum,
  type Position,
  type PromptNode,
} from "@/types/node";
import { Service } from "../Service";

export class PromptNodeService extends Service {
  static async create(
    params: PromptNodeService.CreateParams,
  ): Promise<PromptNodeService.CreatePromptNodeResponse> {
    const response =
      await PromptNodeService.client.post<PromptNodeService.CreatePromptNodeResponse>(
        `/flows/${params.flowId}/nodes`,
        {
          nodeType: NodeTypeEnum.PROMPT,
          position: params.position,
        },
      );

    return { node: response.data.node };
  }

  static async update(params: PromptNodeService.UpdateParams): Promise<void> {
    await PromptNodeService.client.put<PromptNodeService.UpdateResponse>(
      `/flows/${params.flowId}/nodes/${params.nodeId}`,
      {
        data: params.data,
      },
    );
  }
}

export namespace PromptNodeService {
  export type Node = PromptNode;

  export type CreateParams = {
    position: Position;
    flowId: string;
  };

  export type CreatePromptNodeResponse = {
    node: Node;
  };

  export type UpdateParams = {
    flowId: string;
    nodeId: string;
    data?: Partial<NodeDataPrompt>;
  };

  export type UpdateResponse = {
    node: Node;
  };
}

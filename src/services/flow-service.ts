import type { EdgeService } from "./edge-service";
import type { GenerationImageNodeService } from "./node/generation-image-node-service";
import type { ImageNodeService } from "./node/image-node-service";
import type { PromptNodeService } from "./node/prompt-node-service";
import { Service } from "./service";

export class FlowService extends Service {
  static async create(title: string): Promise<FlowService.CreateFlowResponse> {
    const response =
      await FlowService.client.post<FlowService.CreateFlowResponse>("/flows", {
        title,
      });
    return response.data;
  }

  static async getByAccount(): Promise<FlowService.GetByAccountResponse> {
    const response =
      await FlowService.client.get<FlowService.GetByAccountResponse>(`/flows`);
    return response.data;
  }

  static async getById(
    flowId: string,
  ): Promise<FlowService.GetByFlowIdResponse> {
    const response =
      await FlowService.client.get<FlowService.GetByFlowIdResponse>(
        `/flows/${flowId}`,
      );
    return response.data;
  }

  static async delete(flowId: string): Promise<void> {
    await FlowService.client.delete(`/flows/${flowId}`);
  }
}

export namespace FlowService {
  export type GetByFlowIdResponse = {
    flow: Flow;
    nodes: Array<
      | PromptNodeService.Node
      | ImageNodeService.Node
      | (GenerationImageNodeService.Node & { creditsRequired: number })
    >;
    edges: Array<EdgeService.Edge>;
  };

  export type Flow = {
    id: string;
    title: string;
    accountId: string;
    createdAt: string;
    updatedAt: string;
  };

  export type CreateFlowResponse = {
    flow: Flow;
  };

  export type GetByAccountResponse = {
    flows: Flow[];
  };
}

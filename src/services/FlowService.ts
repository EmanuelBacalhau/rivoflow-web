import type { EdgeService } from "./EdgeService";
import type { GenerationImageNodeService } from "./node/GenerationImageNodeService";
import type { ImageNodeService } from "./node/ImageNodeService";
import type { PromptNodeService } from "./node/PromptNodeService";
import { Service } from "./Service";

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
    projectId: string;
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

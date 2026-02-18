import { Service } from "./Service";

export class FlowService extends Service {
  static async create(
    title: string,
    projectId: string,
  ): Promise<FlowService.CreateFlowResponse> {
    const response =
      await FlowService.client.post<FlowService.CreateFlowResponse>("/flows", {
        title,
        projectId,
      });
    return response.data;
  }

  static async getByProject(
    projectId: string,
  ): Promise<FlowService.GetByProjectResponse> {
    const response =
      await FlowService.client.get<FlowService.GetByProjectResponse>(
        `/projects/${projectId}/flows`,
      );
    return response.data;
  }
}

export namespace FlowService {
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

  export type GetByProjectResponse = {
    flows: Flow[];
  };
}

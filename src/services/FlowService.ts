import { Service } from "./Service";

export class FlowService extends Service {
  static async create(title: string): Promise<FlowService.CreateFlowResponse> {
    const response =
      await FlowService.client.post<FlowService.CreateFlowResponse>("/flows", {
        title,
      });
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
}

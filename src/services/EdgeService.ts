import { Service } from "./Service";

export class EdgeService extends Service {
  static async create(
    params: EdgeService.CreateParams,
  ): Promise<EdgeService.CreateEdgeResponse> {
    const response =
      await EdgeService.client.post<EdgeService.CreateEdgeResponse>(
        `/flows/${params.flowId}/edges`,
        {
          sourceNodeId: params.sourceNodeId,
          targetNodeId: params.targetNodeId,
        },
      );

    return { edge: response.data.edge };
  }

  static async delete(params: EdgeService.DeleteParams): Promise<void> {
    await EdgeService.client.delete(
      `/flows/${params.flowId}/edges/${params.edgeId}`,
    );
  }
}

export namespace EdgeService {
  export type CreateParams = {
    sourceNodeId: string;
    targetNodeId: string;
    flowId: string;
  };

  export type Edge = {
    id: string;
    flowId: string;
    sourceNodeId: string;
    targetNodeId: string;
    createdAt: string;
    updatedAt: string;
  };

  export type CreateEdgeResponse = {
    edge: Edge;
  };

  export type DeleteParams = {
    edgeId: string;
    flowId: string;
  };
}

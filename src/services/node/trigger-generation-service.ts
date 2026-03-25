import type {
  GenerationImageNode,
  NodeDataGenerationImage,
  Position,
} from "@/types/node";
import { Service } from "../service";

export class TriggerGenerationService extends Service {
  static async create(
    params: TriggerGenerationService.CreateParams,
  ): Promise<TriggerGenerationService.CreateResponse> {
    const response =
      await TriggerGenerationService.client.post<TriggerGenerationService.CreateResponse>(
        `/flows/${params.flowId}/nodes/generation-image`,
        {
          position: params.position,
        },
      );

    return { node: response.data.node };
  }

  static async update(params: TriggerGenerationService.UpdateParams) {
    await TriggerGenerationService.client.put(
      `/flows/${params.flowId}/nodes/${params.nodeId}/generation`,
      params.data,
    );
  }

  static async generate(params: TriggerGenerationService.GenerateImageParams) {
    await TriggerGenerationService.client.post(
      `/flows/${params.flowId}/nodes/${params.nodeGeneratorId}/generate`,
      {
        inputs: params.inputs,
      },
    );
  }

  static async getStatus(
    params: TriggerGenerationService.GetStatusParams,
  ): Promise<TriggerGenerationService.GetStatusResponse> {
    const response =
      await TriggerGenerationService.client.get<TriggerGenerationService.GetStatusResponse>(
        `/flows/${params.flowId}/nodes/${params.nodeId}/status`,
      );

    return response.data;
  }

  static async calculateCredits(
    params: TriggerGenerationService.CalculateCreditsParams,
  ): Promise<TriggerGenerationService.CalculateCreditsResponse> {
    const response =
      await TriggerGenerationService.client.get<TriggerGenerationService.CalculateCreditsResponse>(
        `/flows/${params.flowId}/nodes/${params.nodeId}/calculate-credits`,
      );

    return response.data;
  }
}

export namespace TriggerGenerationService {
  export type Node = GenerationImageNode;

  export type CreateParams = {
    position: Position;
    flowId: string;
  };

  export type CreateResponse = {
    node: Node;
  };

  export type GenerateImageParams = {
    flowId: string;
    nodeGeneratorId: string;
    inputs: string[];
  };

  export type UpdateParams = {
    flowId: string;
    nodeId: string;
    data: Partial<Pick<NodeDataGenerationImage, "aspectRatio" | "quality">>;
  };

  export type GetStatusParams = {
    nodeId: string;
    flowId: string;
  };

  export type ResultNode = {
    id: string;
    nodeType: string;
    flowId: string;
    position: { x: number; y: number };
    isExecuted: boolean;
    data: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
  };

  export type GetStatusResponse = {
    status: string;
    result: ResultNode | null;
  };

  export type CalculateCreditsParams = {
    nodeId: string;
    flowId: string;
  };

  export type CalculateCreditsResponse = {
    creditsRequired: number;
  };
}

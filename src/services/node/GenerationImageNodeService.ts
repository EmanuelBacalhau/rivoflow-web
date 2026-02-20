import {
  type GenerationImageNode,
  type NodeDataGenerationImage,
  NodeTypeEnum,
  type Position,
} from "@/types/node";
import { Service } from "../Service";

export class GenerationImageNodeService extends Service {
  static async create(
    params: GenerationImageNodeService.CreateParams,
  ): Promise<GenerationImageNodeService.CreateImageNodeResponse> {
    const response =
      await GenerationImageNodeService.client.post<GenerationImageNodeService.CreateImageNodeResponse>(
        `/flows/${params.flowId}/nodes`,
        {
          nodeType: NodeTypeEnum.GENERATION_IMAGE,
          position: params.position,
        },
      );

    return {
      node: response.data.node,
    };
  }

  static async update(params: GenerationImageNodeService.UpdateParams) {
    await GenerationImageNodeService.client.put(
      `/flows/${params.flowId}/nodes/${params.nodeId}`,
      {
        data: params.data,
      },
    );
  }

  static async generate(
    params: GenerationImageNodeService.GenerateImageParams,
  ) {
    await GenerationImageNodeService.client.post(
      `/flows/${params.flowId}/nodes/${params.nodeGeneratorId}/generate-image`,
      {
        inputs: params.inputs,
      },
    );
  }

  static async calculateCredits(
    params: GenerationImageNodeService.CalculateCreditsParams,
  ): Promise<GenerationImageNodeService.CalculateCreditsResponse> {
    const response =
      await GenerationImageNodeService.client.get<GenerationImageNodeService.CalculateCreditsResponse>(
        `/flows/${params.flowId}/nodes/${params.nodeId}/calculate-credits`,
      );

    return response.data;
  }
}

export namespace GenerationImageNodeService {
  export type Node = GenerationImageNode;

  export type CreateParams = {
    position: Position;
    flowId: string;
  };

  export type GenerateImageParams = {
    flowId: string;
    nodeGeneratorId: string;
    inputs: string[];
  };

  export type CreateImageNodeResponse = {
    node: Node;
  };

  export type UpdateParams = {
    flowId: string;
    nodeId: string;
    data: Partial<NodeDataGenerationImage>;
  };

  export type CalculateCreditsParams = {
    nodeId: string;
    flowId: string;
  };

  export type CalculateCreditsResponse = {
    creditsRequired: number;
  };
}

import { Service } from "../Service";
import { NodeTypeEnum, type Position } from "./types";

export class GenerationImageNodeService extends Service {
  static async create(
    params: GenerationImageNodeService.CreateParams,
  ): Promise<GenerationImageNodeService.CreateImageNodeResponse> {
    const response =
      await GenerationImageNodeService.client.post<GenerationImageNodeService.CreateImageNodeResponse>(
        "/nodes",
        {
          nodeType: NodeTypeEnum.GENERATION_IMAGE,
          position: params.position,
          flowId: params.flowId,
        },
      );

    return {
      node: response.data.node,
    };
  }

  static async update(params: GenerationImageNodeService.UpdateParams) {
    await GenerationImageNodeService.client.put(`/nodes/${params.nodeId}`, {
      flowId: params.flowId,
      nodeType: NodeTypeEnum.GENERATION_IMAGE,
      data: params.data,
    });
  }

  static async generate(
    params: GenerationImageNodeService.GenerateImageParams,
  ) {
    await GenerationImageNodeService.client.post(`/nodes/generate-image`, {
      flowId: params.flowId,
      nodeGeneratorId: params.nodeGeneratorId,
      inputs: params.inputs,
    });
  }
}

export namespace GenerationImageNodeService {
  export type CreateParams = {
    position: Position;
    flowId: string;
  };

  export type GenerateImageParams = {
    flowId: string;
    nodeGeneratorId: string;
    inputs: string[];
  };

  export enum GenerationStatusEnum {
    PENDING = "pending",
    QUEUED = "queued",
    PROCESSING = "processing",
    COMPLETED = "completed",
    FAILED = "failed",
  }

  export type NodeDataGenerationImage = {
    type: NodeTypeEnum.GENERATION_IMAGE;
    model?: string;
    parameters: {
      aspectRatio: string;
      quality: string;
    };
    status: GenerationStatusEnum;
  };

  export type Node = {
    id: string;
    flowId: string;
    position: Position;
    isExecuted: boolean;
    createdAt: string;
    updatedAt: string;
    data: NodeDataGenerationImage;
  };

  export type CreateImageNodeResponse = {
    node: Node;
  };

  export type UpdateParams = {
    flowId: string;
    nodeId: string;
    data: Partial<NodeDataGenerationImage>;
  };
}

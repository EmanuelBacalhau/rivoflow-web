import type { EdgeService } from "./edge-service";
import type { FileNodeService } from "./node/file-node-service";
import type { ImageToVideoNodeService } from "./node/image-to-video-node-service";
import type { MotionControlNodeService } from "./node/motion-control-node-service";
import type { PromptNodeService } from "./node/prompt-node-service";
import type { RemoveBgNodeService } from "./node/remove-bg-node-service";
import type { ResultImageNodeService } from "./node/result-image-node-service";
import type { ResultVideoNodeService } from "./node/result-video-node-service";
import type { TextToImageNodeService } from "./node/text-to-image-node-service";
import type { TriggerGenerationService } from "./node/trigger-generation-service";
import type { UpscaleNodeService } from "./node/upscale-node-service";
import type { VideoNodeService } from "./node/video-node-service";
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

  static async updateTitle(
    params: FlowService.UpdateFlowTitleParams,
  ): Promise<void> {
    await FlowService.client.patch(`/flows/${params.flowId}`, {
      title: params.title,
    });
  }
}

export namespace FlowService {
  export type GetByFlowIdResponse = {
    flow: Flow;
    nodes: Array<
      | PromptNodeService.Node
      | FileNodeService.Node
      | VideoNodeService.Node
      | TriggerGenerationService.Node
      | TextToImageNodeService.Node
      | UpscaleNodeService.Node
      | RemoveBgNodeService.Node
      | ImageToVideoNodeService.Node
      | MotionControlNodeService.Node
      | ResultImageNodeService.Node
      | ResultVideoNodeService.Node
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

  export type UpdateFlowTitleParams = {
    flowId: string;
    title: string;
  };
}

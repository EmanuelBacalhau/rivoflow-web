import type { NodeDataUpscale, Position, UpscaleNode } from "@/types/node";
import { Service } from "../service";

export class UpscaleNodeService extends Service {
  static async create(
    params: UpscaleNodeService.CreateParams,
  ): Promise<UpscaleNodeService.CreateResponse> {
    const response =
      await UpscaleNodeService.client.post<UpscaleNodeService.CreateResponse>(
        `/flows/${params.flowId}/nodes/upscale`,
        {
          position: params.position,
        },
      );

    return { node: response.data.node };
  }

  static async update(params: UpscaleNodeService.UpdateParams): Promise<void> {
    await UpscaleNodeService.client.put(
      `/flows/${params.flowId}/nodes/${params.nodeId}/upscale`,
      params.data,
    );
  }
}

export namespace UpscaleNodeService {
  export type Node = UpscaleNode;

  export type CreateParams = {
    position: Position;
    flowId: string;
  };

  export type CreateResponse = {
    node: Node;
  };

  export type UpdateParams = {
    flowId: string;
    nodeId: string;
    data: Partial<Pick<NodeDataUpscale, "scale" | "face" | "upscaleModel">>;
  };
}

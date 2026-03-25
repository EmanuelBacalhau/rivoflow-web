import type {
  MotionControlNode,
  NodeDataMotionControl,
  Position,
} from "@/types/node";
import { Service } from "../service";

export class MotionControlNodeService extends Service {
  static async create(
    params: MotionControlNodeService.CreateParams,
  ): Promise<MotionControlNodeService.CreateResponse> {
    const response =
      await MotionControlNodeService.client.post<MotionControlNodeService.CreateResponse>(
        `/flows/${params.flowId}/nodes/motion-control`,
        {
          position: params.position,
        },
      );

    return { node: response.data.node };
  }

  static async update(
    params: MotionControlNodeService.UpdateParams,
  ): Promise<void> {
    await MotionControlNodeService.client.put(
      `/flows/${params.flowId}/nodes/${params.nodeId}/motion-control`,
      params.data,
    );
  }
}

export namespace MotionControlNodeService {
  export type Node = MotionControlNode;

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
    data: Partial<Pick<NodeDataMotionControl, "keepOriginalSound">>;
  };
}

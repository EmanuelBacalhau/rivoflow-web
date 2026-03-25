import type { Position, RemoveBgNode } from "@/types/node";
import { Service } from "../service";

export class RemoveBgNodeService extends Service {
  static async create(
    params: RemoveBgNodeService.CreateParams,
  ): Promise<RemoveBgNodeService.CreateResponse> {
    const response =
      await RemoveBgNodeService.client.post<RemoveBgNodeService.CreateResponse>(
        `/flows/${params.flowId}/nodes/remove-bg`,
        {
          position: params.position,
        },
      );

    return { node: response.data.node };
  }
}

export namespace RemoveBgNodeService {
  export type Node = RemoveBgNode;

  export type CreateParams = {
    position: Position;
    flowId: string;
  };

  export type CreateResponse = {
    node: Node;
  };
}

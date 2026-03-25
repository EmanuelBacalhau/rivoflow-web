import type {
  NodeDataTextToImage,
  Position,
  TextToImageNode,
} from "@/types/node";
import { Service } from "../service";

export class TextToImageNodeService extends Service {
  static async create(
    params: TextToImageNodeService.CreateParams,
  ): Promise<TextToImageNodeService.CreateResponse> {
    const response =
      await TextToImageNodeService.client.post<TextToImageNodeService.CreateResponse>(
        `/flows/${params.flowId}/nodes/text-to-image`,
        {
          position: params.position,
        },
      );

    return { node: response.data.node };
  }

  static async update(
    params: TextToImageNodeService.UpdateParams,
  ): Promise<void> {
    await TextToImageNodeService.client.put(
      `/flows/${params.flowId}/nodes/${params.nodeId}/text-to-image`,
      params.data,
    );
  }
}

export namespace TextToImageNodeService {
  export type Node = TextToImageNode;

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
    data: Partial<Pick<NodeDataTextToImage, "aspectRatio" | "quality">>;
  };
}

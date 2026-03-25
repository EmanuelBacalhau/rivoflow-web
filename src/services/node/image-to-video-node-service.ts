import type {
  ImageToVideoNode,
  NodeDataImageToVideo,
  Position,
  VideoTier,
} from "@/types/node";
import { Service } from "../service";

export class ImageToVideoNodeService extends Service {
  static async create(
    params: ImageToVideoNodeService.CreateParams,
  ): Promise<ImageToVideoNodeService.CreateResponse> {
    const response =
      await ImageToVideoNodeService.client.post<ImageToVideoNodeService.CreateResponse>(
        `/flows/${params.flowId}/nodes/image-to-video`,
        {
          position: params.position,
          tier: params.tier,
        },
      );

    return { node: response.data.node };
  }

  static async update(
    params: ImageToVideoNodeService.UpdateParams,
  ): Promise<void> {
    await ImageToVideoNodeService.client.put(
      `/flows/${params.flowId}/nodes/${params.nodeId}/image-to-video`,
      params.data,
    );
  }
}

export namespace ImageToVideoNodeService {
  export type Node = ImageToVideoNode;

  export type CreateParams = {
    position: Position;
    flowId: string;
    tier?: VideoTier;
  };

  export type CreateResponse = {
    node: Node;
  };

  export type UpdateParams = {
    flowId: string;
    nodeId: string;
    data: Partial<
      Pick<
        NodeDataImageToVideo,
        "tier" | "duration" | "resolution" | "aspectRatio" | "generateAudio"
      >
    >;
  };
}

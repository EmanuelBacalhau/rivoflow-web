import type { Position, VideoNode } from "@/types/node";
import { Service } from "../service";

export class VideoNodeService extends Service {
  static async create(
    params: VideoNodeService.CreateParams,
  ): Promise<VideoNodeService.CreateResponse> {
    const response =
      await VideoNodeService.client.post<VideoNodeService.CreateResponse>(
        `/flows/${params.flowId}/nodes/video`,
        {
          position: params.position,
        },
      );

    return { node: response.data.node };
  }
}

export namespace VideoNodeService {
  export type Node = VideoNode;

  export type CreateParams = {
    position: Position;
    flowId: string;
  };

  export type CreateResponse = {
    node: Node;
  };
}

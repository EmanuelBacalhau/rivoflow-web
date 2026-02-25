export type Position = {
  x: number;
  y: number;
};

export enum NodeTypeEnum {
  PROMPT = "PROMPT",
  IMAGE = "IMAGE",
  GENERATION_IMAGE = "GENERATION_IMAGE",
  RESULT_IMAGE = "RESULT_IMAGE",
}

export enum GenerationStatusEnum {
  PENDING = "PENDING",
  QUEUED = "QUEUED",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export type NodeBase = {
  id: string;
  flowId: string;
  position: Position;
  isExecuted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type NodeDataPrompt = {
  type: NodeTypeEnum.PROMPT;
  prompt: string;
};

export type NodeDataImage = {
  type: NodeTypeEnum.IMAGE;
  key: string;
  imageUrl: string;
};

export type NodeDataGenerationImage = {
  type: NodeTypeEnum.GENERATION_IMAGE;
  model?: string;
  parameters: {
    aspectRatio: string;
    quality: string;
  };
  status: GenerationStatusEnum;
};

export type NodeDataResultImage = {
  type: NodeTypeEnum.RESULT_IMAGE;
  imageUrl?: string;
};

export type PromptNode = NodeBase & { data: NodeDataPrompt };
export type ImageNode = NodeBase & { data: NodeDataImage };
export type GenerationImageNode = NodeBase & { data: NodeDataGenerationImage };
export type ResultImageNode = NodeBase & { data: NodeDataResultImage };
export type AnyNode =
  | PromptNode
  | ImageNode
  | GenerationImageNode
  | ResultImageNode;

export type AspectRatio =
  | "9:16"
  | "1:1"
  | "16:9"
  | "4:3"
  | "2:3"
  | "3:2"
  | "3:4"
  | "4:5"
  | "5:4"
  | "21:9";
export type ImageSize = "1K" | "2K" | "4K";

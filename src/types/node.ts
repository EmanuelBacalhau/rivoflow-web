export type Position = {
  x: number;
  y: number;
};

export enum NodeTypeEnum {
  PROMPT = "PROMPT",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  GENERATION_IMAGE_EDIT = "GENERATION_IMAGE_EDIT",
  GENERATION_TEXT_TO_IMAGE = "GENERATION_TEXT_TO_IMAGE",
  GENERATION_UPSCALE = "GENERATION_UPSCALE",
  GENERATION_REMOVE_BG = "GENERATION_REMOVE_BG",
  GENERATION_IMAGE_TO_VIDEO = "GENERATION_IMAGE_TO_VIDEO",
  GENERATION_MOTION_CONTROL = "GENERATION_MOTION_CONTROL",
  RESULT_IMAGE = "RESULT_IMAGE",
  RESULT_VIDEO = "RESULT_VIDEO",
}

export const GENERATION_NODE_TYPES: NodeTypeEnum[] = [
  NodeTypeEnum.GENERATION_IMAGE_EDIT,
  NodeTypeEnum.GENERATION_TEXT_TO_IMAGE,
  NodeTypeEnum.GENERATION_UPSCALE,
  NodeTypeEnum.GENERATION_REMOVE_BG,
  NodeTypeEnum.GENERATION_IMAGE_TO_VIDEO,
  NodeTypeEnum.GENERATION_MOTION_CONTROL,
];

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
  nodeType: NodeTypeEnum;
  position: Position;
  isExecuted: boolean;
  totalTokens: number;
  createdAt: string;
  updatedAt: string;
};

// --- Node data shapes (match API GET /flows/{flowId}) ---

export type NodeDataPrompt = {
  prompt: string;
};

export type NodeDataImage = {
  key: string | null;
  imageUrl?: string;
};

export type NodeDataVideo = {
  key: string | null;
  duration?: number;
  videoUrl?: string;
};

export type NodeDataGenerationBase = {
  status: GenerationStatusEnum;
  attempts: number;
  outputNodeId: string | null;
  consumedCredits: number;
  creditsRequired: number;
};

export type NodeDataGenerationImage = NodeDataGenerationBase & {
  aspectRatio: AspectRatio;
  quality: ImageQuality;
};

export type NodeDataTextToImage = NodeDataGenerationBase & {
  aspectRatio: AspectRatio;
  quality: ImageQuality;
};

export type NodeDataUpscale = NodeDataGenerationBase & {
  scale: number;
};

export type NodeDataRemoveBg = NodeDataGenerationBase;

export type NodeDataImageToVideo = NodeDataGenerationBase & {
  tier: VideoTier;
  duration: string;
  resolution: VideoResolution;
  aspectRatio: VideoAspectRatio;
  generateAudio: boolean;
};

export type NodeDataMotionControl = NodeDataGenerationBase & {
  characterOrientation: "video";
  keepOriginalSound: boolean;
};

export type NodeDataResultImage = {
  key: string;
  inputType: string;
  imageUrl?: string;
};

export type NodeDataResultVideo = {
  key: string;
  duration: number;
  fps: number;
  videoUrl?: string;
};

// --- Composed node types ---

export type PromptNode = NodeBase & { data: NodeDataPrompt };
export type ImageNode = NodeBase & { data: NodeDataImage };
export type VideoNode = NodeBase & { data: NodeDataVideo };
export type GenerationImageNode = NodeBase & { data: NodeDataGenerationImage };
export type TextToImageNode = NodeBase & { data: NodeDataTextToImage };
export type UpscaleNode = NodeBase & { data: NodeDataUpscale };
export type RemoveBgNode = NodeBase & { data: NodeDataRemoveBg };
export type ImageToVideoNode = NodeBase & { data: NodeDataImageToVideo };
export type MotionControlNode = NodeBase & { data: NodeDataMotionControl };
export type ResultImageNode = NodeBase & { data: NodeDataResultImage };
export type ResultVideoNode = NodeBase & { data: NodeDataResultVideo };

export type AnyGenerationNode =
  | GenerationImageNode
  | TextToImageNode
  | UpscaleNode
  | RemoveBgNode
  | ImageToVideoNode
  | MotionControlNode;

export type AnyNode =
  | PromptNode
  | ImageNode
  | VideoNode
  | GenerationImageNode
  | TextToImageNode
  | UpscaleNode
  | RemoveBgNode
  | ImageToVideoNode
  | MotionControlNode
  | ResultImageNode
  | ResultVideoNode;

// --- Value types ---

export type AspectRatio =
  | "1:1"
  | "1:4"
  | "1:8"
  | "2:3"
  | "3:2"
  | "3:4"
  | "4:1"
  | "4:3"
  | "4:5"
  | "5:4"
  | "8:1"
  | "9:16"
  | "16:9"
  | "21:9";

export type ImageQuality = "0.5K" | "1K" | "2K" | "4K";

export type VideoTier = "standard" | "premium";
export type VideoResolution = "1080p" | "1440p" | "2160p";
export type VideoAspectRatio = "auto" | "16:9" | "9:16" | "1:1";
export type VideoDuration = "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10";

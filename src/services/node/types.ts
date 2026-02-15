export type Position = {
  x: number;
  y: number;
};

export enum NodeTypeEnum {
  PROMPT = "PROMPT",
  IMAGE = "IMAGE",
  GENERATION_IMAGE = "GENERATION_IMAGE",
  RESULT = "RESULT",
}

export type NodeEntity = {
  id: string;
  flowId: string;
  position: Position;
  isExecuted: boolean;
  createdAt: string;
  updatedAt: string;
};

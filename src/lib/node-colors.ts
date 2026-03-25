/**
 * Centralized node color definitions for ReactFlow edges and UI consistency.
 */

export const NODE_COLORS: Record<string, string> = {
  PROMPT: "#f59e0b", // amber-400
  IMAGE: "#3b82f6", // blue-500
  VIDEO: "#8b5cf6", // violet-500
  GENERATION_IMAGE: "#a855f7", // purple-500
  GENERATION_TEXT_TO_IMAGE: "#6366f1", // indigo-500
  GENERATION_UPSCALE: "#14b8a6", // teal-500
  GENERATION_REMOVE_BG: "#f43f5e", // rose-500
  GENERATION_IMAGE_TO_VIDEO: "#f97316", // orange-500
  GENERATION_MOTION_CONTROL: "#ec4899", // pink-500
  RESULT_IMAGE: "#22c55e", // green-500
  RESULT_VIDEO: "#10b981", // emerald-500
};

export const DEFAULT_EDGE_COLOR = "#6b7280"; // gray-500 fallback

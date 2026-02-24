/**
 * Centralized node color definitions for ReactFlow edges and UI consistency.
 * These colors serve as visual identifiers for the four node types:
 * - PROMPT (Amber): User input and prompts
 * - IMAGE (Blue): Image uploads and references
 * - GENERATION_IMAGE (Purple): AI image generation
 * - RESULT_IMAGE (Green): Generated outputs
 */

export const NODE_COLORS: Record<string, string> = {
  PROMPT: "#f59e0b", // amber-400
  IMAGE: "#3b82f6", // blue-500
  GENERATION_IMAGE: "#a855f7", // purple-500
  RESULT_IMAGE: "#22c55e", // green-500
};

export const DEFAULT_EDGE_COLOR = "#6b7280"; // gray-500 fallback

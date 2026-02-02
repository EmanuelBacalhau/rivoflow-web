import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || "",
});

export type AspectRatio =
  | "9:16"
  | "1:1"
  | "16:9"
  | "4:3"
  | "3:4"
  | "2:3"
  | "3:2";
export type ImageSize = "1K" | "2K" | "4K";

interface GenerateImageParams {
  prompt: string;
  referenceImages?: string[];
  aspectRatio?: AspectRatio;
  imageSize?: ImageSize;
}

export async function generateImage({
  prompt,
  referenceImages = [],
  aspectRatio = "1:1",
  imageSize = "2K",
}: GenerateImageParams): Promise<string> {
  const contents: any[] = [];

  if (referenceImages.length > 0) {
    for (const imageUrl of referenceImages) {
      const base64Data = imageUrl.split(",")[1];
      const mimeType = imageUrl.split(";")[0].split(":")[1] || "image/jpeg";

      contents.push({
        inlineData: {
          mimeType,
          data: base64Data,
        },
      });
    }
  }

  contents.push({ text: prompt });

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-image-preview",
    contents,
    config: {
      responseModalities: ["IMAGE"],
      imageConfig: {
        aspectRatio,
        imageSize,
        personGeneration: "allow_all",
      },
      temperature: 0.7,
    },
  });

  const parts = response.candidates?.[0]?.content?.parts;
  if (!parts) {
    throw new Error("No response from AI");
  }

  for (const part of parts) {
    if (part.inlineData) {
      const { mimeType, data } = part.inlineData;
      return `data:${mimeType};base64,${data}`;
    }
  }

  throw new Error("No image generated");
}

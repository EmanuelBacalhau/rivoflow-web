"use client";

import { Handle, type NodeProps, Position } from "@xyflow/react";
import {
  CheckCircleIcon,
  ImagePlusIcon,
  UploadCloudIcon,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useId } from "react";
import { useFlow } from "@/contexts/FlowContext";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

interface UploadImageNodeData {
  imageUrl?: string;
}

export function UploadImageNode({ id, data }: NodeProps) {
  const { updateNodeData } = useFlow();
  const nodeData = data as UploadImageNodeData;
  const inputId = useId();

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      if (selectedFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
          updateNodeData(id, {
            imageUrl: reader.result as string,
            file: selectedFile,
          });
        };
        reader.readAsDataURL(selectedFile);
      }
    },
    [id, updateNodeData],
  );

  const handleRemoveImage = useCallback(() => {
    updateNodeData(id, { imageUrl: "" });
  }, [id, updateNodeData]);

  return (
    <Card className="w-64 p-1 shadow-lg border-blue-200 bg-linear-to-b from-white to-blue-50/30">
      <Handle
        type="source"
        position={Position.Right}
        className="bg-blue-400! size-3! border-2! border-white!"
      />

      <CardContent className="p-3 space-y-3">
        <header className="flex items-center gap-2">
          <div className="bg-linear-to-br from-blue-400 to-blue-600 p-2 grid place-items-center rounded-lg shadow-sm">
            <ImagePlusIcon className="size-4 text-white" strokeWidth={2} />
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-sm">Imagem</h3>
            <span className="text-xs text-gray-500">Produto ou referência</span>
          </div>

          {nodeData.imageUrl && (
            <Badge
              variant="secondary"
              className="text-[10px] bg-blue-100 text-blue-700 rounded-full p-2"
            >
              <CheckCircleIcon className="size-3" />
            </Badge>
          )}
        </header>

        {nodeData.imageUrl ? (
          <div className="w-full h-40 overflow-hidden rounded-lg relative group border border-blue-100">
            <Image
              src={nodeData.imageUrl}
              alt="Uploaded Reference"
              fill
              quality={100}
              className="object-cover"
            />

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                size="icon"
                variant="destructive"
                className="size-9 nodrag"
                onClick={handleRemoveImage}
              >
                <XIcon className="size-5" />
              </Button>
            </div>
          </div>
        ) : (
          <label htmlFor={inputId} className="block">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
              id={inputId}
            />
            <div className="cursor-pointer text-center text-gray-400 border-2 border-dashed border-blue-200 transition-all rounded-lg p-6 hover:border-blue-400 hover:bg-blue-50/50 nodrag group">
              <div className="bg-blue-100 rounded-full p-3 mx-auto mb-3 w-fit group-hover:bg-blue-200 transition-colors">
                <UploadCloudIcon className="size-6 text-blue-500" />
              </div>
              <p className="text-xs font-medium text-gray-600 mb-1">
                Clique para carregar
              </p>
              <p className="text-[10px] text-gray-400">JPG, PNG ou WebP</p>
            </div>
          </label>
        )}
      </CardContent>
    </Card>
  );
}

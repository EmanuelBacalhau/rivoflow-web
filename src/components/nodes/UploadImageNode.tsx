"use client";

import { Handle, type NodeProps, Position } from "@xyflow/react";
import {
  CheckIcon,
  ImagePlusIcon,
  Trash2Icon,
  UploadCloudIcon,
  ZoomInIcon,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useFlow } from "@/contexts/flow";
import type { ImageNodeService } from "@/services/node/ImageNodeService";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

type UploadImageNodeData = ImageNodeService.Node["data"] & {
  isExecuted?: boolean;
};

export function UploadImageNode({ id, data }: NodeProps) {
  const { updateNodeData, uploadImageNode, flowId } = useFlow();
  const [nodeData, setNodeData] = useState<UploadImageNodeData>(
    data as UploadImageNodeData,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const inputId = `input-file-${id}`;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setNodeData((prev) => ({
        ...prev,
        imageUrl: URL.createObjectURL(selectedFile),
      }));
      updateNodeData(id, { imageUrl: URL.createObjectURL(selectedFile) });
      uploadImageNode({
        flowId,
        nodeId: id,
        file: selectedFile,
      });
    }
  };

  const handleRemoveImage = () => {
    setNodeData((prev) => ({
      ...prev,
      imageUrl: "",
    }));
    updateNodeData(id, { imageUrl: "" });
  };

  return (
    <Card className="w-64 p-0 shadow-lg border-blue-200 bg-linear-to-b from-white to-blue-50/30">
      <Handle
        type="source"
        position={Position.Right}
        className="bg-blue-400! size-3! border-2! border-white!"
      />

      <CardContent className="p-2 space-y-3">
        <header className="flex items-center gap-2">
          <div className="bg-linear-to-br from-blue-400 to-blue-600 p-2 grid place-items-center rounded-lg shadow-sm">
            <ImagePlusIcon className="size-4 text-white" strokeWidth={2} />
          </div>

          <div className="flex-1 flex flex-col">
            <h3 className="font-semibold text-sm">Imagem</h3>
            <span className="text-xs text-gray-500">Produto ou referência</span>
          </div>

          {nodeData.isExecuted && (
            <div className="bg-green-100 p-1 rounded-full grid place-items-center">
              <CheckIcon className="size-4 text-green-500" />
            </div>
          )}
        </header>

        {nodeData.imageUrl ? (
          <div className="w-full h-40 overflow-hidden rounded-lg relative group border border-blue-100">
            <Image
              src={nodeData.imageUrl}
              alt="Uploaded Reference"
              fill
              sizes="256px"
              quality={75}
              priority
              className="object-cover"
            />

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                size="icon"
                variant="destructive"
                className="cursor-pointer"
                onClick={handleRemoveImage}
              >
                <Trash2Icon className="size-5" />
              </Button>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="icon" className="cursor-pointer">
                    <ZoomInIcon className="size-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl p-0 overflow-hidden">
                  <DialogTitle className="sr-only">
                    Visualização da imagem
                  </DialogTitle>

                  <div className="relative w-full h-[80vh]">
                    <Image
                      src={nodeData.imageUrl}
                      alt="Visualização da imagem"
                      fill
                      sizes="(max-width: 896px) 100vw, 896px"
                      quality={100}
                      className="object-contain"
                    />
                  </div>
                </DialogContent>
              </Dialog>
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
            <div className="cursor-pointer text-center text-gray-400 border-2 border-dashed border-blue-200 transition-all rounded-lg p-6 hover:border-blue-400 hover:bg-blue-50/50 group">
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

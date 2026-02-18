"use client";

import { Handle, type NodeProps, Position } from "@xyflow/react";
import {
  CheckIcon,
  ImagePlusIcon,
  UploadCloudIcon,
  ZoomInIcon,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useFlow } from "@/contexts/flow";
import type { ImageNodeService } from "@/services/node/ImageNodeService";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

type UploadImageNodeData = ImageNodeService.Node["data"] & {
  isExecuted?: boolean;
};

export function UploadImageNode({ id, data, selected }: NodeProps) {
  const { uploadImageNode, flowId } = useFlow();
  const nodeData = data as UploadImageNodeData;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const inputId = `input-file-${id}`;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      uploadImageNode({
        flowId,
        nodeId: id,
        file: selectedFile,
      });
    }
  };

  return (
    <div
      className={`w-64 rounded-xl border bg-white shadow-md overflow-hidden transition-shadow ${selected ? "border-blue-400 ring-2 ring-blue-300 shadow-blue-100 shadow-lg" : "border-blue-200"}`}
    >
      <Handle
        type="source"
        position={Position.Right}
        className="bg-blue-400! size-3! border-2! border-white!"
      />

      <div className="flex items-center gap-2.5 px-3 py-2.5 bg-linear-to-r from-blue-50 to-sky-50 border-b border-blue-100">
        <div className="w-7 h-7 rounded-lg bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-sm shrink-0">
          <ImagePlusIcon className="size-3.5 text-white" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-gray-800 leading-tight">
            Imagem
          </h3>
          <p className="text-[10px] text-blue-600/80">Produto ou referência</p>
        </div>
        {nodeData.isExecuted && (
          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <CheckIcon className="size-3 text-green-600" />
          </div>
        )}
      </div>

      <div className="p-3">
        {nodeData.imageUrl ? (
          <div className="w-full h-40 overflow-hidden rounded-lg relative group border border-blue-100">
            <Image
              src={nodeData.imageUrl}
              alt="Uploaded Reference"
              fill
              sizes="256px"
              quality={100}
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
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
            <div className="cursor-pointer text-center border-2 border-dashed border-blue-200 rounded-lg p-5 hover:border-blue-400 hover:bg-blue-50/50 transition-all group">
              <div className="bg-blue-100 rounded-full p-2.5 mx-auto mb-2.5 w-fit group-hover:bg-blue-200 transition-colors">
                <UploadCloudIcon className="size-5 text-blue-500" />
              </div>
              <p className="text-xs font-medium text-gray-600 mb-0.5">
                Clique para carregar
              </p>
              <p className="text-[10px] text-gray-400">JPG, PNG ou WebP</p>
            </div>
          </label>
        )}
      </div>
    </div>
  );
}

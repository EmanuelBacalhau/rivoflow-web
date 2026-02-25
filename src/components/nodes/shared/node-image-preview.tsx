"use client";

import { ZoomInIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface NodeImagePreviewProps {
  imageUrl: string;
  altText: string;
  sizes?: string;
  borderColor?: "blue" | "green";
}

export function NodeImagePreview({
  imageUrl,
  altText,
  sizes = "256px",
  borderColor = "blue",
}: NodeImagePreviewProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const borderClass =
    borderColor === "green" ? "border-green-500/20" : "border-blue-500/20";

  return (
    <div
      className={`w-full h-40 overflow-hidden rounded-lg relative group border ${borderClass}`}
    >
      <Image
        src={imageUrl}
        alt={altText}
        fill
        sizes={sizes}
        quality={100}
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="icon" className="cursor-pointer nodrag">
              <ZoomInIcon className="size-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl p-0 overflow-hidden">
            <DialogTitle className="sr-only">
              Visualização da imagem
            </DialogTitle>
            <div className="relative w-full h-[80vh]">
              <Image
                src={imageUrl}
                alt={altText}
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
  );
}

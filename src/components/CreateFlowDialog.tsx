"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreateFlow } from "@/hooks/mutations/useCreateFlow";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProjectDialog({
  open,
  onOpenChange,
}: CreateProjectDialogProps) {
  const router = useRouter();
  const [name, setName] = useState("");

  const { createFlow, isCreatingFlow } = useCreateFlow();

  const handleCreateFlow = async (flowName: string) => {
    const { flow } = await createFlow(flowName);
    router.push(`/dashboard/flow/${flow.id}`);
  };

  const handleOpenChange = (value: boolean) => {
    if (!value) setName("");
    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogTitle>Novo Flow</DialogTitle>
        <DialogDescription>
          Dê um nome ao seu flow para organizá-lo.
        </DialogDescription>
        <div className="space-y-4 pt-2">
          <Input
            placeholder="Ex: Campanha Verão 2025"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !isCreatingFlow && handleCreateFlow(name)
            }
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => handleCreateFlow(name)}
              disabled={isCreatingFlow}
            >
              {isCreatingFlow ? "Criando..." : "Criar Flow"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

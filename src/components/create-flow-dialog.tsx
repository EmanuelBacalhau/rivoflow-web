"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateFlow } from "@/hooks/mutations/useCreateFlow";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";

interface CreateFlowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateFlowDialog({
  open,
  onOpenChange,
}: CreateFlowDialogProps) {
  const router = useRouter();
  const [name, setName] = useState("");

  const { createFlow, isCreatingFlow } = useCreateFlow();

  const handleCreateFlow = async (flowName: string) => {
    try {
      const { flow } = await createFlow(flowName);
      router.push(`/dashboard/flow/${flow.id}`);
      onOpenChange(false);
      setName("");
    } catch {
      toast.error("Erro ao criar flow. Tente novamente.");
    }
  };

  const handleOpenChange = (value: boolean) => {
    if (!value) setName("");
    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogTitle>Novo flow</DialogTitle>
        <DialogDescription>
          Dê um nome ao seu flow para organizá-lo.
        </DialogDescription>
        <form
          className="space-y-4 pt-1"
          onSubmit={(e) => {
            e.preventDefault();
            if (!isCreatingFlow && name.trim()) handleCreateFlow(name);
          }}
        >
          <div>
            <label htmlFor="flow-name" className="sr-only">
              Nome do flow
            </label>
            <Input
              id="flow-name"
              placeholder={`Ex: Campanha Verão ${new Date().getFullYear()}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => handleOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              type="submit"
              disabled={isCreatingFlow || !name.trim()}
            >
              {isCreatingFlow ? "Criando..." : "Criar flow"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

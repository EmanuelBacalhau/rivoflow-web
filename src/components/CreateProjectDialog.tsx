"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProjectService } from "@/services/ProjectService";
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

  const { mutate, isPending } = useMutation({
    mutationFn: () => ProjectService.create(name.trim() || "Novo Projeto"),
    onSuccess: ({ project }) => {
      onOpenChange(false);
      setName("");
      router.push(`/dashboard/projects/${project.id}`);
    },
  });

  const handleOpenChange = (value: boolean) => {
    if (!value) setName("");
    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogTitle>Novo Projeto</DialogTitle>
        <DialogDescription>
          Dê um nome ao seu projeto para organizar seus flows.
        </DialogDescription>
        <div className="space-y-4 pt-2">
          <Input
            placeholder="Ex: Campanha Verão 2025"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isPending && mutate()}
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
              onClick={() => mutate()}
              disabled={isPending}
            >
              {isPending ? "Criando..." : "Criar Projeto"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

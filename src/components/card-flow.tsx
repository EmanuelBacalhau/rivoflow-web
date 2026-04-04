import { format } from "date-fns";
import { LayersIcon, PencilIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useDeleteFlow } from "@/hooks/mutations/useDeleteFlow";
import { useUpdateFlow } from "@/hooks/mutations/useUpdateFlow";
import type { FlowService } from "@/services/flow-service";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";

interface CardFlowProps {
  flow: FlowService.Flow;
}

export function CardFlow({ flow }: CardFlowProps) {
  const { deleteFlow, isFlowDeleting } = useDeleteFlow();
  const { updateFlow, isFlowUpdating } = useUpdateFlow();
  const [title, setTitle] = useState(flow.title);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <Card
      key={flow.id}
      className="p-0 overflow-hidden border-white/8 bg-white/3 backdrop-blur-sm hover:border-purple-500/25 transition-all duration-300 group shadow-none"
    >
      <CardContent className="p-0">
        <Link href={`/dashboard/flow/${flow.id}`}>
          <div className="p-6 bg-white/2 grid place-items-center">
            <LayersIcon className="size-12 text-muted-foreground/20" />
          </div>
        </Link>

        <div className="p-4 flex justify-between items-center gap-3">
          <div className="min-w-0">
            <Link
              href={`/dashboard/flow/${flow.id}`}
              className="hover:underline underline-offset-2"
            >
              <h3 className="text-sm font-semibold truncate">{flow.title}</h3>
            </Link>
            <p className="text-xs text-muted-foreground mt-1">
              Atualizado em{" "}
              {format(new Date(flow.updatedAt), "dd/MM/yyyy 'às' HH:mm")}
            </p>
          </div>

          <div className="flex items-center gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <Dialog
              onOpenChange={setIsUpdateDialogOpen}
              open={isUpdateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Renomear ${flow.title}`}
                >
                  <PencilIcon className="size-3.5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Renomear flow</DialogTitle>
                  <DialogDescription>
                    Altere o título do flow <strong>{flow.title}</strong>.
                  </DialogDescription>
                </DialogHeader>
                <Input
                  defaultValue={flow.title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancelar</Button>
                  </DialogClose>
                  <Button
                    disabled={
                      title.trim() === "" ||
                      title === flow.title ||
                      isFlowUpdating
                    }
                    onClick={async () => {
                      await updateFlow({ flowId: flow.id, title });
                      setIsUpdateDialogOpen(false);
                    }}
                  >
                    {isFlowUpdating ? "Salvando..." : "Salvar"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog
              onOpenChange={setIsDeleteDialogOpen}
              open={isDeleteDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="hover:text-destructive"
                  aria-label={`Excluir ${flow.title}`}
                >
                  <TrashIcon className="size-3.5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Excluir flow</DialogTitle>
                  <DialogDescription>
                    Tem certeza que deseja excluir <strong>{flow.title}</strong>
                    ? Esta ação não pode ser desfeita.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancelar</Button>
                  </DialogClose>
                  <Button
                    variant="destructive"
                    disabled={isFlowDeleting}
                    onClick={async () => {
                      await deleteFlow(flow.id);
                      setIsDeleteDialogOpen(false);
                    }}
                  >
                    {isFlowDeleting ? "Excluindo..." : "Excluir"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

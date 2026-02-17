"use client";

import {
  FolderOpenIcon,
  HistoryIcon,
  ImageIcon,
  LayoutDashboardIcon,
  Loader2Icon,
  MenuIcon,
  PlusIcon,
  SettingsIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FlowService } from "@/services/FlowService";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  active?: boolean;
  disabled?: boolean;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "canvas",
    label: "Canvas",
    icon: <LayoutDashboardIcon className="size-4" />,
    active: true,
  },
  {
    id: "projects",
    label: "Projetos",
    icon: <FolderOpenIcon className="size-4" />,
    disabled: true,
    badge: "Em breve",
  },
  {
    id: "gallery",
    label: "Galeria",
    icon: <ImageIcon className="size-4" />,
    disabled: true,
    badge: "Em breve",
  },
  {
    id: "history",
    label: "Histórico",
    icon: <HistoryIcon className="size-4" />,
    disabled: true,
    badge: "Em breve",
  },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  async function handleCreateFlow() {
    setIsCreating(true);
    try {
      const { flow } = await FlowService.create("Novo Flow");
      setIsOpen(false);
      router.push(`/dashboard/flow/${flow.id}`);
    } catch {
      toast.error("Erro ao criar flow. Tente novamente.");
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed left-4 top-4 z-20 size-10 rounded-lg shadow-lg bg-white/95 backdrop-blur-sm hover:bg-gray-50 border-gray-200"
        >
          <MenuIcon className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0 flex flex-col">
        <SheetHeader className="p-4 pb-2 border-b">
          <SheetTitle>
            <Image
              src="/rivoflow.png"
              alt="Orion Flow logo"
              width={44}
              height={44}
              className="rounded"
            />
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="p-3 space-y-1">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 mb-3 border-dashed"
              disabled
            >
              <PlusIcon className="size-4" />
              Novo Projeto
              <span className="ml-auto text-[10px] text-muted-foreground">
                Em breve
              </span>
            </Button>

            <Separator className="my-2" />

            <Button
              variant="outline"
              className="w-full justify-start gap-2 mb-3"
              onClick={handleCreateFlow}
              disabled={isCreating}
            >
              {isCreating ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                <PlusIcon className="size-4" />
              )}
              {isCreating ? "Criando..." : "Novo Flow"}
            </Button>

            <Separator className="my-2" />

            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground px-2 py-1">
                Navegação
              </p>
              {NAV_ITEMS.map((item) => (
                <Button
                  key={item.id}
                  variant={item.active ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-2 ${
                    item.disabled ? "opacity-50 cursor-not-allowed" : ""
                  } ${item.active ? "bg-purple-100 text-purple-700 hover:bg-purple-100" : ""}`}
                  disabled={item.disabled}
                >
                  {item.icon}
                  {item.label}
                  {item.badge && (
                    <span className="ml-auto text-[10px] text-muted-foreground bg-gray-100 px-1.5 py-0.5 rounded">
                      {item.badge}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </ScrollArea>

        <div className="p-3 border-t mt-auto">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            disabled
          >
            <SettingsIcon className="size-4" />
            Configurações
            <span className="ml-auto text-[10px] text-muted-foreground">
              Em breve
            </span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

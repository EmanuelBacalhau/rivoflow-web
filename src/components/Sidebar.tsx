"use client";

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
import {
  FolderOpenIcon,
  LayoutDashboardIcon,
  MenuIcon,
  SettingsIcon,
  SparklesIcon,
  ImageIcon,
  HistoryIcon,
  PlusIcon,
} from "lucide-react";
import { useState } from "react";

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
          <SheetTitle className="flex items-center gap-2">
            <div className="bg-linear-to-br from-purple-500 to-purple-700 p-1.5 rounded-lg">
              <SparklesIcon className="size-4 text-white" />
            </div>
            <span className="font-bold">Orion Flow</span>
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="p-3 space-y-1">
            {/* Novo Projeto */}
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

            {/* Navegação */}
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

        {/* Footer */}
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

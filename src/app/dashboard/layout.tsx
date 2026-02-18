"use client";

import { useMutation } from "@tanstack/react-query";
import {
  FolderOpenIcon,
  HistoryIcon,
  ImageIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  PlusIcon,
  SettingsIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FlowService } from "@/services/FlowService";

const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboardIcon,
    href: "/dashboard",
  },
  {
    id: "projects",
    label: "Projetos",
    icon: FolderOpenIcon,
    href: null,
    badge: "Em breve",
  },
  {
    id: "gallery",
    label: "Galeria",
    icon: ImageIcon,
    href: null,
    badge: "Em breve",
  },
  {
    id: "history",
    label: "Histórico",
    icon: HistoryIcon,
    href: null,
    badge: "Em breve",
  },
];

function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const { mutate: createFlow, isPending } = useMutation({
    mutationFn: () => FlowService.create("Novo Flow"),
    onSuccess: ({ flow }) => {
      router.push(`/dashboard/flow/${flow.id}`);
    },
  });

  return (
    <aside className="w-56 shrink-0 flex flex-col h-screen border-r border-border/50 bg-card/40">
      {/* Logo */}
      <div className="h-14 px-4 flex items-center border-b border-border/50">
        <Link href="/dashboard">
          <Image
            src="/rivoflow.png"
            alt="RivoFlow"
            width={32}
            height={32}
            className="rounded-lg"
          />
        </Link>
      </div>

      {/* New flow button */}
      <div className="p-3">
        <Button
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white justify-start gap-2"
          size="sm"
          onClick={() => createFlow()}
          disabled={isPending}
        >
          <PlusIcon className="w-4 h-4" />
          {isPending ? "Criando..." : "Novo Flow"}
        </Button>
      </div>

      <Separator />

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        <p className="text-[11px] font-medium text-muted-foreground px-2 py-2 uppercase tracking-wider">
          Menu
        </p>
        {NAV_ITEMS.map((item) => {
          const isActive = item.href && pathname === item.href;
          const isDisabled = !item.href;
          return (
            <div key={item.id}>
              {item.href ? (
                <Link href={item.href}>
                  <button
                    type="button"
                    className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm transition-colors ${
                      isActive
                        ? "bg-indigo-500/10 text-indigo-600 font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    {item.label}
                  </button>
                </Link>
              ) : (
                <button
                  type="button"
                  disabled={isDisabled}
                  className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm text-muted-foreground opacity-50 cursor-not-allowed"
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {item.label}
                  {item.badge && (
                    <span className="ml-auto text-[10px] bg-muted px-1.5 py-0.5 rounded">
                      {item.badge}
                    </span>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom */}
      <Separator />
      <div className="p-3 space-y-0.5">
        <button
          type="button"
          disabled
          className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm text-muted-foreground opacity-50 cursor-not-allowed"
        >
          <SettingsIcon className="w-4 h-4 shrink-0" />
          Configurações
        </button>
        <button
          type="button"
          className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <LogOutIcon className="w-4 h-4 shrink-0" />
          Sair
        </button>
      </div>
    </aside>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}

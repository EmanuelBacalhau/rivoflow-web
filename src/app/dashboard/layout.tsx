"use client";

import { useQuery } from "@tanstack/react-query";
import {
  FolderIcon,
  HistoryIcon,
  ImageIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CreateProjectDialog } from "@/components/CreateProjectDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ProjectService } from "@/services/ProjectService";

const SEARCH_THRESHOLD = 5;

const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboardIcon,
    href: "/dashboard",
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

function DashboardSidebar({ onNewProject }: { onNewProject: () => void }) {
  const pathname = usePathname();
  const [search, setSearch] = useState("");

  const { data } = useQuery({
    queryKey: ["projects"],
    queryFn: ProjectService.getAll,
  });

  const projects = data?.projects ?? [];
  const showSearch = projects.length > SEARCH_THRESHOLD;
  const filteredProjects = search.trim()
    ? projects.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()),
      )
    : projects;

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

      {/* New project button */}
      <div className="p-3">
        <Button
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white justify-start gap-2"
          size="sm"
          onClick={onNewProject}
        >
          <PlusIcon className="w-4 h-4" />
          Novo Projeto
        </Button>
      </div>

      <Separator />

      {/* Nav */}
      <nav className="flex-1 flex flex-col p-3 space-y-0.5 min-h-0">
        <p className="text-[11px] font-medium text-muted-foreground px-2 py-2 uppercase tracking-wider shrink-0">
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

        {/* Projects list */}
        <div className="pt-3 flex flex-col min-h-0 flex-1">
          <p className="text-[11px] font-medium text-muted-foreground px-2 py-2 uppercase tracking-wider shrink-0">
            Projetos
          </p>

          {showSearch && (
            <div className="relative mb-1.5 shrink-0">
              <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar..."
                className="h-7 pl-6 text-xs"
              />
            </div>
          )}

          <ScrollArea className="flex-1">
            <div className="space-y-0.5 pr-1">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => {
                  const isActive =
                    pathname === `/dashboard/projects/${project.id}`;
                  return (
                    <Link
                      key={project.id}
                      href={`/dashboard/projects/${project.id}`}
                    >
                      <button
                        type="button"
                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors ${
                          isActive
                            ? "bg-indigo-500/10 text-indigo-600 font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        }`}
                      >
                        <FolderIcon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate text-xs">{project.name}</span>
                      </button>
                    </Link>
                  );
                })
              ) : (
                <p className="text-[11px] text-muted-foreground px-2 py-1">
                  {search ? "Nenhum resultado" : "Nenhum projeto ainda"}
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
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
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar onNewProject={() => setIsCreateOpen(true)} />
      <CreateProjectDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}

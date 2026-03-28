"use client";

import {
  LayersIcon,
  LayoutDashboardIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CreateFlowDialog } from "@/components/create-flow-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFlows } from "@/hooks/queries/useFlows";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

const pages = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboardIcon,
  },
];

const SEARCH_THRESHOLD = 5;

export function AppSidebar() {
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { flows, isLoading } = useFlows();

  const showSearch = flows.length > SEARCH_THRESHOLD;
  const filteredFlows = search.trim()
    ? flows.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    : flows;

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center p-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="RivoFlow"
            width={28}
            height={28}
            className="rounded-md"
          />
          <span className="text-sm font-semibold font-display tracking-tight">
            RIVOFLOW
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="overflow-hidden">
        {/* CREATE FLOW */}
        <SidebarGroup>
          <CreateFlowDialog
            open={isCreateOpen}
            onOpenChange={setIsCreateOpen}
          />
          <Button
            size="sm"
            className="h-8 text-[13px]"
            onClick={() => setIsCreateOpen(true)}
          >
            <PlusIcon className="mr-1 size-3.5" />
            Novo flow
          </Button>
          {showSearch && (
            <div className="flex items-center gap-2 rounded-md border border-white/8 bg-white/3 px-2.5 py-1.5 text-sm text-muted-foreground transition-colors focus-within:border-purple-500/30 mt-2">
              <SearchIcon className="size-3 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar flows..."
                className="w-full bg-transparent text-sidebar-foreground placeholder:text-muted-foreground outline-none text-[13px]"
              />
            </div>
          )}
        </SidebarGroup>

        {/* MAIN MENU */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">
            Menu
          </SidebarGroupLabel>
          <SidebarMenu>
            {pages.map((page) => {
              const isCurrentPage = pathname === page.href;

              return (
                <SidebarMenuItem key={page.name}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={page.href}
                      className={
                        isCurrentPage ? "bg-accent text-foreground" : ""
                      }
                    >
                      <page.icon className="mr-2 h-4 w-4" />
                      <span className="text-[13px]">{page.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* FLOWS */}
        <SidebarGroup className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <SidebarGroupLabel className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">
            Flows
          </SidebarGroupLabel>

          <div className="flex-1 min-h-0 overflow-y-auto">
            <SidebarMenu>
              {isLoading &&
                [62, 80, 55, 72, 45].map((w) => (
                  <SidebarMenuItem key={w}>
                    <div className="flex items-center gap-2 rounded-md p-2 h-8">
                      <Skeleton className="size-4 shrink-0 rounded-sm" />
                      <Skeleton
                        className="h-3 rounded"
                        style={{ width: `${w}%` }}
                      />
                    </div>
                  </SidebarMenuItem>
                ))}

              {!isLoading &&
                filteredFlows.length > 0 &&
                filteredFlows.map((flow) => {
                  const isCurrentPage =
                    pathname === `/dashboard/flow/${flow.id}`;
                  return (
                    <SidebarMenuItem key={flow.id}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={`/dashboard/flow/${flow.id}`}
                          className={`flex items-center gap-2 ${isCurrentPage ? "bg-accent text-foreground" : ""}`}
                        >
                          <LayersIcon className="mr-2 size-3.5" />
                          <span className="truncate text-[13px]">
                            {flow.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}

              {!isLoading && filteredFlows.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-2 py-8">
                  <LayersIcon className="size-5 text-muted-foreground/40" />
                  <p className="text-[12px] text-muted-foreground text-center">
                    Nenhum flow encontrado.
                  </p>
                </div>
              )}
            </SidebarMenu>
          </div>
        </SidebarGroup>

        <SidebarFooter />
      </SidebarContent>
    </Sidebar>
  );
}

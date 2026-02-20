"use client";

import { useQuery } from "@tanstack/react-query";
import {
  CreditCardIcon,
  LayersIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  ZapIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CreateFlowDialog } from "@/components/CreateFlowDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useAccount } from "@/hooks/queries/useAccount";
import { FlowService } from "@/services/FlowService";

const SEARCH_THRESHOLD = 5;

const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboardIcon,
    href: "/dashboard",
  },
];

function UserMenu() {
  const { signOut } = useAuth();
  const { me } = useAccount();

  if (!me) return null;

  const initials =
    `${me.account.firstName[0]}${me.account.lastName[0]}`.toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2 py-1.5 rounded-xl shadow-lg border border-gray-200/80"
        >
          <div className="text-right">
            <p className="text-sm font-medium leading-tight">
              {me.account.firstName} {me.account.lastName}
            </p>

            <div className="flex items-center justify-end gap-1 mt-0.5">
              <ZapIcon className="w-3 h-3 text-amber-500" />
              <span className="text-[11px] font-semibold text-amber-500">
                {me.balance.credits} créditos
              </span>
            </div>
          </div>

          <Avatar className="w-8 h-8 shrink-0">
            <AvatarImage src={me.account.picture} alt={me.account.firstName} />
            <AvatarFallback className="text-xs font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="pb-1">
          <p className="text-sm font-medium">
            {me.account.firstName} {me.account.lastName}
          </p>
          <p className="text-xs font-normal text-muted-foreground truncate">
            {me.account.email}
          </p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <div className="px-2 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ZapIcon className="w-3.5 h-3.5 text-amber-500" />
            Créditos
          </div>
          <span className="text-xs font-semibold">{me.balance.credits}</span>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="gap-2 cursor-pointer">
          <CreditCardIcon className="w-4 h-4 text-indigo-500" />
          Depositar créditos
        </DropdownMenuItem>

        <DropdownMenuItem disabled className="gap-2">
          <SettingsIcon className="w-4 h-4" />
          Configurações
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="gap-2 cursor-pointer text-destructive focus:text-destructive"
          onClick={signOut}
        >
          <LogOutIcon className="w-4 h-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DashboardSidebar({ onNewFlow }: { onNewFlow: () => void }) {
  const pathname = usePathname();
  const [search, setSearch] = useState("");

  const { data } = useQuery({
    queryKey: ["projects"],
    queryFn: FlowService.getByAccount,
  });

  const flows: FlowService.Flow[] = data?.flows ?? [];
  const showSearch = flows.length > SEARCH_THRESHOLD;
  const filteredFlows = search.trim()
    ? flows.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    : flows;

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
          onClick={onNewFlow}
        >
          <PlusIcon className="w-4 h-4" />
          Novo Flow
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
                </button>
              )}
            </div>
          );
        })}

        {/* Projects list */}
        <div className="pt-3 flex flex-col min-h-0 flex-1">
          <p className="text-[11px] font-medium text-muted-foreground px-2 py-2 uppercase tracking-wider shrink-0">
            Flows
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
              {filteredFlows.length > 0 ? (
                filteredFlows.map((flow) => {
                  const isActive = pathname === `/dashboard/flow/${flow.id}`;
                  return (
                    <Link key={flow.id} href={`/dashboard/flow/${flow.id}`}>
                      <button
                        type="button"
                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors ${
                          isActive
                            ? "bg-indigo-500/10 text-indigo-600 font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        }`}
                      >
                        <LayersIcon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate text-xs">{flow.title}</span>
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
      <DashboardSidebar onNewFlow={() => setIsCreateOpen(true)} />
      <CreateFlowDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="absolute top-0 left-0 right-0 h-14 flex items-center justify-end gap-4 px-4 z-10">
          <UserMenu />
        </header>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LayersIcon,
  LayoutDashboardIcon,
  LoaderIcon,
  LogOut,
  SearchIcon,
  Trash2Icon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { CreateFlowDialog } from "@/components/create-flow-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-context";
import { useDeleteFlow } from "@/hooks/mutations/useDeleteFlow";
import { useAccount } from "@/hooks/queries/useAccount";
import { useFlows } from "@/hooks/queries/useFlows";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
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
  useSidebar,
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
  const router = useRouter();
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { signOut } = useAuth();

  const { flows, isLoading } = useFlows();
  const { me } = useAccount();
  const { deleteFlow } = useDeleteFlow();
  const [flowsForDelete, setFlowsForDelete] = useState<string[]>([]);

  const showSearch = flows.length > SEARCH_THRESHOLD;
  const filteredFlows = search.trim()
    ? flows.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    : flows;

  const handleDeleteFlow = async (flowId: string) => {
    try {
      setFlowsForDelete((prev) => [...prev, flowId]);
      await deleteFlow(flowId);
      toast.success("Flow deletado com sucesso.");
    } catch (error) {
      setFlowsForDelete((prev) => prev.filter((id) => id !== flowId));
      toast.error("Erro ao deletar flow. Tente novamente.");
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center p-4">
        <Link href="/dashboard">
          <Image
            src="/logo.png"
            alt="RivoFlow"
            width={42}
            height={42}
            className="rounded-lg"
          />
        </Link>

        <span className="text-xl font-semibold tracking-tight">RIVOFLOW</span>
      </SidebarHeader>

      <SidebarContent className="overflow-hidden">
        {/* CREATE FLOW DIALOG */}
        <SidebarGroup>
          <CreateFlowDialog
            open={isCreateOpen}
            onOpenChange={setIsCreateOpen}
          />
          <Button onClick={() => setIsCreateOpen(true)}>
            <LayersIcon className="mr-1 size-5" />
            Criar Flow
          </Button>
        </SidebarGroup>

        {/* MAIN MENU SECTION */}
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            {pages.map((page) => {
              const isCurrentPage = pathname === page.href;

              return (
                <SidebarMenuItem key={page.name}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={page.href}
                      className={isCurrentPage ? "bg-muted" : ""}
                    >
                      <page.icon className="mr-2 h-5 w-5" />
                      {page.name}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* FLOWS SECTION */}
        <SidebarGroup className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <SidebarGroupLabel>Flows</SidebarGroupLabel>

          {showSearch && (
            <div className="relative mb-1.5 px-2 shrink-0">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar..."
                className="h-7 pl-6 text-xs"
              />
            </div>
          )}

          <div className="flex-1 min-h-0 overflow-y-auto">
            <SidebarMenu className="px-2 pb-2">
              {isLoading &&
                [62, 80, 55, 72, 45].map((w) => (
                  <SidebarMenuItem key={w}>
                    <div className="flex items-center gap-2 rounded-md p-2 h-8">
                      <Skeleton className="size-4 shrink-0 rounded-sm" />
                      <Skeleton
                        className="h-3.5 rounded"
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
                  const isDeleting = flowsForDelete.includes(flow.id);
                  return (
                    <SidebarMenuItem key={flow.id}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={`/dashboard/flow/${flow.id}`}
                          aria-disabled={isDeleting}
                          className={`flex items-center gap-2 ${isCurrentPage ? "bg-muted" : ""}`}
                        >
                          <LayersIcon className="mr-2 size-5" />

                          <span className="truncate">{flow.title}</span>

                          <Button
                            size="xs"
                            className="ml-auto hover:bg-destructive! cursor-pointer"
                            variant="ghost"
                            disabled={isDeleting}
                            onClick={(e) => {
                              e.preventDefault();
                              if (isCurrentPage) {
                                router.push("/dashboard");
                              }
                              handleDeleteFlow(flow.id);
                            }}
                          >
                            {isDeleting ? (
                              <LoaderIcon className="size-3 animate-spin" />
                            ) : (
                              <Trash2Icon className="size-3" />
                            )}
                          </Button>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}

              {!isLoading && filteredFlows.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-2 py-10">
                  <LayersIcon className="size-6 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground text-center">
                    Nenhum flow encontrado. Crie um novo flow para começar.
                  </p>
                </div>
              )}
            </SidebarMenu>
          </div>
        </SidebarGroup>

        {/* LOADING PLACEHOLDER */}
        <SidebarFooter>
          <SidebarMenu>
            {!me && (
              <SidebarMenuItem className="cursor-not-allowed">
                <div className="flex items-center gap-2 rounded-md p-2">
                  <Skeleton className="size-8 shrink-0 rounded-sm" />

                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-3.5 rounded w-full" />
                    <Skeleton className="h-3.5 rounded w-full" />
                  </div>
                </div>
              </SidebarMenuItem>
            )}

            {me && (
              <SidebarMenuItem>
                <DropdownMenu>
                  {/* TRIGGER FOR USER MENU */}
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      <Avatar className="size-8 rounded-lg">
                        <AvatarImage
                          src={me?.account.picture}
                          alt={me?.account.firstName}
                        />
                        <AvatarFallback className="rounded-lg">
                          {me?.account.firstName?.[0] || "CN"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">
                          {`${me?.account.firstName} ${me?.account.lastName}`}
                        </span>
                        <span className="truncate text-xs">
                          {me?.account.email}
                        </span>
                      </div>
                      <ChevronsUpDown className="ml-auto size-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>

                  {/* DROPDOWN MENU CONTENT */}
                  <DropdownMenuContent
                    className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                    side={isMobile ? "bottom" : "right"}
                    align="end"
                    sideOffset={4}
                  >
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage
                            src={me?.account.picture}
                            alt={me?.account.firstName}
                          />
                          <AvatarFallback className="rounded-lg">
                            {me?.account.firstName?.[0] || "CN"}
                          </AvatarFallback>
                        </Avatar>

                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-medium">{`${me?.account.firstName} ${me?.account.lastName}`}</span>

                          <span className="truncate text-xs">
                            {me?.account.email}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <BadgeCheck />
                        Account
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CreditCard />
                        Billing
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Bell />
                        Notifications
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}

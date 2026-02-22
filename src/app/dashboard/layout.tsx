import type { PropsWithChildren } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col overflow-auto relative">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

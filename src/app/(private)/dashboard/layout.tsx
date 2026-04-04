import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen overflow-hidden bg-background">
        <AppHeader />
        <main className="flex-1 overflow-auto relative">{children}</main>
      </div>
    </TooltipProvider>
  );
}

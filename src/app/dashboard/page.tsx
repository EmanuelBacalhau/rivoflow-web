"use client";

import { useState } from "react";
import { CreateFlowDialog } from "@/components/create-flow-dialog";

export default function DashboardPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <CreateFlowDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}

"use client";

import { FlowCanvas } from "@/components/FlowCanvas";
import { FlowProvider } from "@/contexts/flow";

export default function FlowPage() {
  return (
    <FlowProvider>
      <FlowCanvas />
    </FlowProvider>
  );
}

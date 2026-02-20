"use client";

import { ReactFlowProvider } from "@xyflow/react";
import { FlowCanvas } from "@/components/FlowCanvas";
import { FlowProvider } from "@/contexts/FlowContext";

export default function FlowPage() {
  return (
    <ReactFlowProvider>
      <FlowProvider>
        <FlowCanvas />
      </FlowProvider>
    </ReactFlowProvider>
  );
}

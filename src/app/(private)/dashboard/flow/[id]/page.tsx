import { ReactFlowProvider } from "@xyflow/react";
import type { Metadata } from "next";
import { FlowCanvas } from "@/components/flow-canvas";
import { FlowProvider } from "@/contexts/flow-context";

export const metadata: Metadata = {
  title: "Editor de Flow",
};

export default function FlowPage() {
  return (
    <ReactFlowProvider>
      <FlowProvider>
        <FlowCanvas />
      </FlowProvider>
    </ReactFlowProvider>
  );
}

import { ReactFlowProvider } from "@xyflow/react";
import { FlowCanvas } from "@/components/flow-canvas";
import { FlowProvider } from "@/contexts/flow-context";

export default function FlowPage() {
  return (
    <ReactFlowProvider>
      <FlowProvider>
        <FlowCanvas />
      </FlowProvider>
    </ReactFlowProvider>
  );
}

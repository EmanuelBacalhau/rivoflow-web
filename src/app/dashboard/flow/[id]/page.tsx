"use client";

import { useParams } from "next/navigation";
import { FlowCanvas } from "@/components/FlowCanvas";
import { FlowProvider } from "@/contexts/flow";

export default function FlowPage() {
  const params = useParams<{ id: string }>();

  return (
    <FlowProvider>
      <FlowCanvas />
    </FlowProvider>
  );
}

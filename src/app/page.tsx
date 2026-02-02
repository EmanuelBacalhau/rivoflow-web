import { FlowCanvas } from "@/components/FlowCanvas";
import { FlowProvider } from "@/contexts/FlowContext";

export default function Home() {
  return (
    <FlowProvider>
      <FlowCanvas />
    </FlowProvider>
  );
}

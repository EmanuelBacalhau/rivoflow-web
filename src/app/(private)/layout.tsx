import type { PropsWithChildren } from "react";
import { MainProvider } from "@/providers/main-provider";

export default function PrivateLayout({ children }: PropsWithChildren) {
  return <MainProvider>{children}</MainProvider>;
}

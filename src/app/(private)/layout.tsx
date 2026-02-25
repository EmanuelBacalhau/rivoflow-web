import type { PropsWithChildren } from "react";
import { AuthProvider } from "@/contexts/auth-context";

export default function PrivateLayout({ children }: PropsWithChildren) {
  return <AuthProvider>{children}</AuthProvider>;
}

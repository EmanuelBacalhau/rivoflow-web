import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Pagamento Aprovado",
};

export default function PaymentSuccessLayout({ children }: PropsWithChildren) {
  return children;
}

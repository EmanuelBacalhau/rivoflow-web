import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import "@xyflow/react/dist/style.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { MainProvider } from "@/providers/main-provider";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RIVOFLOW",
  description: "Crie imagens para propaganda com inteligência artificial",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${roboto.variable} ${roboto.variable} antialiased min-h-screen`}
      >
        <ErrorBoundary>
          <MainProvider>{children}</MainProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

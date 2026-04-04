import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import "@xyflow/react/dist/style.css";
import Script from "next/script";
import { env } from "@/env";
import { MainProvider } from "@/providers/main-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default:
      "RivoFlow - Crie imagens para propaganda com Inteligência Artificial",
    template: "%s | RivoFlow",
  },
  description:
    "Crie criativos e anúncios em alta qualidade em segundos usando nosso editor visual de fluxos de Inteligência Artificial. Sem mensalidades, pague apenas pelo uso.",
  keywords: [
    "IA",
    "Inteligência Artificial",
    "Criativos",
    "Gerador de Imagens",
    "Design",
    "RivoFlow",
    "Editor Visual",
    "Marketing",
    "Anúncios",
    "Social Media",
  ],
  authors: [{ name: "RivoFlow Team" }],
  creator: "RivoFlow",
  publisher: "RivoFlow",
  openGraph: {
    title: "RivoFlow - Acelere sua Produção Visual com IA",
    description:
      "Crie criativos em alta qualidade em segundos usando nosso editor visual de IA. Sem assinatura, pague pelo uso.",
    url: env.NEXT_PUBLIC_APP_URL,
    siteName: "RivoFlow",
    images: [
      {
        url: "/open-graph.png",
        width: 800,
        height: 600,
        alt: "RivoFlow Logo",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RivoFlow - Acelere sua Produção Visual com IA",
    description:
      "Crie criativos em alta qualidade em segundos usando nosso editor visual de IA.",
    images: ["/open-graph.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "RivoFlow",
    applicationCategory: "DesignApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "20.00",
      priceCurrency: "BRL",
    },
    description:
      "Crie criativos e anúncios em alta qualidade em segundos usando nosso editor visual de fluxos de Inteligência Artificial.",
  };

  return (
    <html lang="pt-BR">
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify(jsonLd)}
        </Script>
      </head>
      <body
        className={`${inter.variable} ${sora.variable} antialiased min-h-screen dark`}
      >
        <MainProvider>{children}</MainProvider>
      </body>
    </html>
  );
}

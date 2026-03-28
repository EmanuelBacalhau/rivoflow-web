"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditBalance } from "@/components/credit-balance";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useAccount } from "@/hooks/queries/useAccount";
import { useFlows } from "@/hooks/queries/useFlows";

export function AppHeader() {
  const pathname = usePathname();
  const { me } = useAccount();
  const { flows } = useFlows();

  const segments = buildBreadcrumbs(pathname, flows);

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border h-17 px-6 flex items-center justify-between gap-4">
      {/* Left: Logo + Breadcrumb */}
      <div className="flex items-center gap-4 min-w-0">
        <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
          <Image
            src="/logo.png"
            alt="RivoFlow"
            width={28}
            height={28}
            className="rounded-lg"
          />
          <span className="font-display font-semibold text-sm tracking-tight text-white hidden sm:block">
            RivoFlow
          </span>
        </Link>

        <div className="w-px h-5 bg-white/8 hidden sm:block" />

        <Breadcrumb className="hidden sm:flex">
          <BreadcrumbList>
            {segments.flatMap((segment, i) => {
              const isLast = i === segments.length - 1;
              const items = [];
              if (i > 0) {
                items.push(<BreadcrumbSeparator key={`sep-${segment.href}`} />);
              }
              items.push(
                <BreadcrumbItem key={segment.href}>
                  {isLast ? (
                    <BreadcrumbPage className="truncate max-w-48">
                      {segment.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={segment.href}>{segment.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>,
              );
              return items;
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right: CreditBalance avatar */}
      <div className="flex items-center gap-3 shrink-0">
        {me && (
          <CreditBalance
            balance={me.balance}
            picture={me.account.picture}
            name={`${me.account.firstName} ${me.account.lastName}`}
            email={me.account.email}
          />
        )}
      </div>
    </header>
  );
}

interface BreadcrumbSegment {
  label: string;
  href: string;
}

function buildBreadcrumbs(
  pathname: string,
  flows: { id: string; title: string }[],
): BreadcrumbSegment[] {
  const segments: BreadcrumbSegment[] = [];

  if (pathname === "/dashboard") {
    segments.push({ label: "Dashboard", href: "/dashboard" });
    return segments;
  }

  // /dashboard/flow/[id]
  const flowMatch = pathname.match(/^\/dashboard\/flow\/(.+)$/);
  if (flowMatch) {
    segments.push({ label: "Dashboard", href: "/dashboard" });
    const flowId = flowMatch[1];
    const flow = flows.find((f) => f.id === flowId);
    segments.push({
      label: flow?.title || "Flow",
      href: `/dashboard/flow/${flowId}`,
    });
    return segments;
  }

  // Fallback
  segments.push({ label: "Dashboard", href: "/dashboard" });
  return segments;
}

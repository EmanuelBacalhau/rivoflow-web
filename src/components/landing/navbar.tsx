"use client";

import { ArrowRightIcon, MenuIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface NavLink {
  label: string;
  href: string;
}

interface LandingNavbarProps {
  navLinks: NavLink[];
}

export function LandingNavbar({ navLinks }: LandingNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="RIVOFLOW"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span className="font-semibold text-lg tracking-tight hidden sm:block">
            RivoFlow
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/auth/google"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Entrar
          </Link>
          <Link href="/auth/google">
            <Button className="rounded-lg">
              Começar grátis
              <ArrowRightIcon className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-muted-foreground rounded-md hover:bg-accent transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu"
          type="button"
        >
          {mobileMenuOpen ? (
            <XIcon className="w-5 h-5" />
          ) : (
            <MenuIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background px-6 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="block text-sm text-muted-foreground py-2.5 px-3 hover:text-foreground hover:bg-accent rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3">
            <Link href="/auth/google" className="block">
              <Button className="w-full">Começar grátis</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

"use client";

import { ChevronRightIcon, MenuIcon, XIcon } from "lucide-react";
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
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="RIVOFLOW"
            width={36}
            height={36}
            className="rounded-xl"
          />
          <span className="font-bold text-lg hidden sm:block">RivoFlow</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/auth/google">
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white rounded-lg"
            >
              Começar agora
              <ChevronRightIcon className="w-3.5 h-3.5 ml-0.5" />
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
        <div className="md:hidden border-t border-border/50 bg-background px-6 py-4 space-y-3 text-center">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="block text-sm text-muted-foreground py-1 hover:bg-muted rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/auth/google">
            <Button
              size="sm"
              className="w-full mt-2 bg-primary hover:bg-primary/90 text-white"
            >
              Começar agora
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}

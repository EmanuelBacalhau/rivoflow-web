"use client";

import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/auth-context";
import type { AccountService } from "@/services/account-service";

interface CreditBalanceProps {
  balance: AccountService.GetMeResponse["balance"];
  picture?: string;
  name?: string;
  email?: string;
}

export function CreditBalance({
  balance,
  picture,
  name,
  email,
}: CreditBalanceProps) {
  const { signOut } = useAuth();
  const { lifetimeSpent, lifetimeDeposited, credits } = balance;
  const percentage =
    lifetimeDeposited === 0 ? 0 : (lifetimeSpent / lifetimeDeposited) * 100;
  const remainingPercentage = Math.max(0, 100 - percentage);

  // SVG circle math
  const size = 44;
  const strokeWidth = 2.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset =
    circumference - (remainingPercentage / 100) * circumference;

  const initial = name?.[0] || "?";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="relative cursor-pointer outline-none"
          style={{ width: size, height: size }}
        >
          {/* Progress ring SVG */}
          <svg
            className="absolute inset-0 -rotate-90"
            width={size}
            height={size}
            aria-hidden="true"
          >
            {/* Background ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-white/8"
            />
            {/* Progress ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="url(#credit-ring-gradient)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              className="transition-all duration-700 ease-out"
            />
            <defs>
              <linearGradient
                id="credit-ring-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="rgb(168, 85, 247)" />
                <stop offset="100%" stopColor="rgb(139, 92, 246)" />
              </linearGradient>
            </defs>
          </svg>

          {/* Avatar centered inside ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Avatar className="size-8">
              <AvatarImage src={picture} alt={name} />
              <AvatarFallback className="text-[11px] font-semibold bg-purple-500/15 text-purple-300">
                {initial}
              </AvatarFallback>
            </Avatar>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-56 rounded-xl"
      >
        {/* User info */}
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-3 px-3 py-3">
            <Avatar className="size-8">
              <AvatarImage src={picture} alt={name} />
              <AvatarFallback className="text-[10px] font-semibold bg-purple-500/15 text-purple-300">
                {initial}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left leading-tight min-w-0">
              <span className="truncate font-medium text-[13px]">{name}</span>
              <span className="truncate text-[11px] text-muted-foreground">
                {email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Credits info */}
        <div className="px-3 py-2.5">
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-muted-foreground">Créditos</span>
            <span className="font-semibold tabular-nums">{credits}</span>
          </div>
          <div className="mt-2 overflow-hidden rounded-full bg-white/5 h-1.5">
            <div
              className="bg-purple-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${remainingPercentage}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground text-right mt-1 tabular-nums">
            {remainingPercentage.toFixed(0)}% restantes
          </p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => signOut(true)}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="size-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

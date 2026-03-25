import { ZapIcon } from "lucide-react";
import type { AccountService } from "@/services/account-service";

interface CreditBalanceProps {
  balance: AccountService.GetMeResponse["balance"];
}

export function CreditBalance({ balance }: CreditBalanceProps) {
  const { lifetimeSpent, lifetimeDeposited, credits } = balance;
  const percentage =
    lifetimeDeposited === 0 ? 0 : (lifetimeSpent / lifetimeDeposited) * 100;
  const remainingPercentage = 100 - percentage;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2 mt-1.5">
        <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center">
          <ZapIcon className="size-2.5 text-primary" />
        </div>
        <span className="text-[11px] font-medium text-muted-foreground">
          Créditos
        </span>
        <span className="ml-auto text-[12px] font-semibold tabular-nums">
          {credits}
        </span>
      </div>

      <div className="flex flex-col gap-0.5">
        <div className="overflow-hidden rounded bg-muted h-1.5">
          <div
            className="bg-primary h-full rounded transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-[10px] text-muted-foreground text-right tabular-nums">
          {remainingPercentage ? remainingPercentage.toFixed(0) : 0}% restantes
        </span>
      </div>
    </div>
  );
}

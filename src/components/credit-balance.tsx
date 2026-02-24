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
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 mt-2">
        <div className="bg-primary w-fit p-2 rounded-lg">
          <ZapIcon className="size-3 text-white" />
        </div>

        <strong>Creditos</strong>

        <span className="ml-auto text-sm font-bold text-primary">
          {credits}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <div className="overflow-hidden rounded-lg bg-gray-200">
          <div
            className={`bg-primary h-2`}
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>

        <span className="text-xs text-muted-foreground text-right">
          {remainingPercentage ? remainingPercentage.toFixed(2) : 0}% restantes
        </span>
      </div>
    </div>
  );
}

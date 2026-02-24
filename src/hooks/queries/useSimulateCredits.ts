import { useQuery } from "@tanstack/react-query";
import { PaymentService } from "@/services/payment-service";

export function useSimulateCredits(amount: number, enabled: boolean = true) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["simulate-credits", amount],
    queryFn: () => PaymentService.simulateCredits({ amount }),
    enabled: enabled && amount > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    simulatedCredits: data?.credits,
    isSimulating: isLoading,
    isSimulationError: isError,
  };
}

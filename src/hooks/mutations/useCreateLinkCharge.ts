import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/providers/main-provider";
import { PaymentService } from "@/services/payment-service";

export function useCreateLinkCharge() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: PaymentService.createLinkCharge,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["account"],
      });
    },
  });

  return {
    createLinkCharge: mutateAsync,
    isCreatingLinkCharge: isPending,
  };
}

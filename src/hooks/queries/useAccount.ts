import { useQuery } from "@tanstack/react-query";
import { AccountService } from "@/services/AccountService";

interface IUseAccountParams {
  enabled?: boolean;
}

export function useAccount(params?: IUseAccountParams) {
  const { data, refetch } = useQuery({
    enabled: params?.enabled ?? true,
    queryKey: ["account"],
    queryFn: () => AccountService.getMe(),
    staleTime: Infinity,
  });

  return {
    account: data,
    loadAccount: refetch,
  };
}

import { type Query, useQuery } from "@tanstack/react-query";
import { AccountService } from "@/services/account-service";

interface IUseAccountParams {
  enabled?: boolean;
  refetchInterval?:
    | number
    | false
    | ((
        query: Query<
          AccountService.GetMeResponse,
          Error,
          AccountService.GetMeResponse,
          readonly unknown[]
        >,
      ) => number | false);
}

export function useAccount(params?: IUseAccountParams) {
  const { data, refetch } = useQuery({
    enabled: params?.enabled ?? true,
    queryKey: ["account"],
    queryFn: () => AccountService.getMe(),
    staleTime: Infinity,
    refetchInterval: params?.refetchInterval,
  });

  return {
    me: data,
    loadAccount: refetch,
  };
}

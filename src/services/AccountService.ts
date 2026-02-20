import { Service } from "./Service";

export class AccountService extends Service {
  static async getMe(): Promise<AccountService.GetMeResponse> {
    const response =
      await AccountService.client.get<AccountService.GetMeResponse>("/me");
    return response.data;
  }
}

export namespace AccountService {
  export type GetMeResponse = {
    account: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      picture: string;
      isActive: boolean;
    };
    balance: {
      credits: number;
      lifetimeDeposited: number;
      lifetimeSpent: number;
    };
  };
}

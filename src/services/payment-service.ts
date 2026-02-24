import { Service } from "./service";

export class PaymentService extends Service {
  static async createLinkCharge(
    params: PaymentService.CreateLinkChargeParams,
  ): Promise<PaymentService.CreateLinkChargeResponse> {
    const response =
      await PaymentService.client.post<PaymentService.CreateLinkChargeResponse>(
        "/payments/link-charge",
        params,
      );

    return response.data;
  }

  static async simulateCredits(
    params: PaymentService.SimulateCreditsParams,
  ): Promise<PaymentService.SimulateCreditsResponse> {
    const response =
      await PaymentService.client.get<PaymentService.SimulateCreditsResponse>(
        `/payments/simulate-credits?amount=${params.amount}`,
      );

    return response.data;
  }
}

export namespace PaymentService {
  export type CreateLinkChargeParams = {
    amount: number;
  };

  export type CreateLinkChargeResponse = {
    link: string;
  };

  export type SimulateCreditsParams = {
    amount: number;
  };

  export type SimulateCreditsResponse = {
    credits: number;
  };
}

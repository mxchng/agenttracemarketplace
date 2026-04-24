import type { IPaymentVerifier, PaymentChallenge, PaymentResult } from "@/lib/payment/interface";

export class MockPaymentVerifier implements IPaymentVerifier {
  async verify(_request: Request): Promise<PaymentResult> {
    return {
      ok: true,
      mode: "mock",
      paymentTxHash: "mock-tx-hash",
      amountUsd: "5.00",
    };
  }

  async generateChallenge(
    listingId: string,
    amountUsd: string,
  ): Promise<PaymentChallenge> {
    return {
      amountUsd,
      listingId,
      message: "Mock mode challenge. Client would normally confirm payment here.",
      mode: "mock",
    };
  }
}

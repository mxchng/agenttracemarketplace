export type PaymentMode = "mock" | "x402";

export type PaymentChallenge = {
  amountUsd: string;
  listingId: string;
  message: string;
  mode: PaymentMode;
};

export type PaymentResult = {
  ok: boolean;
  mode: PaymentMode;
  paymentTxHash: string;
  amountUsd: string;
};

export interface IPaymentVerifier {
  verify(request: Request): Promise<PaymentResult>;
  generateChallenge(listingId: string, amountUsd: string): Promise<PaymentChallenge>;
}

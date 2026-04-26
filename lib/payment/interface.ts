export type PaymentMode = "mock" | "x402";

export type PaymentRequirement = {
  scheme: "exact";
  network: string;
  asset: string;
  amount: string;
  payTo: string;
  maxTimeoutSeconds: number;
  extra: {
    name: string;
    version: string;
  };
};

export type PaymentRequiredResponse = {
  x402Version: 2;
  error: string;
  resource: {
    url: string;
    description: string;
    mimeType: string;
  };
  accepts: PaymentRequirement[];
};

export type PaymentChallenge = {
  mode: PaymentMode;
  status: 402;
  body: PaymentRequiredResponse;
  headers: Record<string, string>;
};

export type PaymentPayload = {
  x402Version: 1 | 2;
  accepted: PaymentRequirement;
  payload: Record<string, unknown>;
  resource?: {
    url: string;
    description: string;
    mimeType: string;
  };
};

export type PaymentResult = {
  ok: boolean;
  mode: PaymentMode;
  paymentTxHash: string;
  amountUsd: string;
  payer?: string;
  settlement?: Record<string, unknown>;
};

export type PaymentContext = {
  amountAtomic: string;
  amountUsd: string;
  listingId: string;
  resource: {
    url: string;
    description: string;
    mimeType: string;
  };
};

export interface IPaymentVerifier {
  verify(request: Request, context: PaymentContext): Promise<PaymentResult>;
  generateChallenge(context: PaymentContext): Promise<PaymentChallenge>;
}

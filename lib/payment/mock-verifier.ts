import { Buffer } from "node:buffer";
import type {
  IPaymentVerifier,
  PaymentChallenge,
  PaymentContext,
  PaymentRequiredResponse,
  PaymentResult,
} from "@/lib/payment/interface";
import { getAddress } from "viem";

const mockNetwork = process.env.X402_NETWORK_ID || "eip155:8453";
const mockAssetAddress = getAddress(
  process.env.X402_ASSET_ADDRESS || "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
);
const mockPayToAddress = getAddress(
  process.env.X402_PAY_TO || "0x0000000000000000000000000000000000000001",
);

function toBase64Json(value: unknown) {
  return Buffer.from(JSON.stringify(value)).toString("base64");
}

export class MockPaymentVerifier implements IPaymentVerifier {
  async verify(_request: Request, context: PaymentContext): Promise<PaymentResult> {
    return {
      ok: true,
      mode: "mock",
      paymentTxHash: "mock-tx-hash",
      amountUsd: context.amountUsd,
    };
  }

  async generateChallenge(context: PaymentContext): Promise<PaymentChallenge> {
    const body = {
      x402Version: 2,
      error: "PAYMENT-SIGNATURE header is required",
      resource: {
        url: context.resource.url,
        description: context.resource.description,
        mimeType: context.resource.mimeType,
      },
      accepts: [
        {
          scheme: "exact",
          network: mockNetwork,
          asset: mockAssetAddress,
          amount: context.amountAtomic,
          payTo: mockPayToAddress,
          maxTimeoutSeconds: 60,
          extra: {
            name: "Mock USD",
            version: "2",
          },
        },
      ],
    } satisfies PaymentRequiredResponse;

    return {
      mode: "mock",
      status: 402,
      body,
      headers: {
        "PAYMENT-REQUIRED": toBase64Json(body),
        "Access-Control-Expose-Headers": "PAYMENT-REQUIRED, PAYMENT-RESPONSE",
      },
    };
  }
}

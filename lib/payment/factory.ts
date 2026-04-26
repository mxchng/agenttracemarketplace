import type { IPaymentVerifier } from "@/lib/payment/interface";
import { MockPaymentVerifier } from "@/lib/payment/mock-verifier";
import { X402PaymentVerifier } from "@/lib/payment/x402-verifier";

export function getPaymentVerifier(): IPaymentVerifier {
  return process.env.PAYMENT_MODE === "x402"
    ? new X402PaymentVerifier()
    : new MockPaymentVerifier();
}

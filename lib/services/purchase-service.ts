import { sampleListings } from "@/lib/data/mock-data";
import type { IPaymentVerifier } from "@/lib/payment/interface";

export type PurchaseIntent = {
  listingId: string;
  buyerWalletAddress: string;
};

export type PurchaseReceipt = {
  listingId: string;
  paymentTxHash: string;
  accessGrantExpiresAt: string;
  accessState: "active";
};

// One service owns purchase and grant rules, regardless of entry point.
export class PurchaseService {
  constructor(private readonly verifier: IPaymentVerifier) {}

  async createHumanPurchase(intent: PurchaseIntent): Promise<PurchaseReceipt> {
    const listing = sampleListings.find((item) => item.id === intent.listingId);

    if (!listing) {
      throw new Error("Listing not found.");
    }

    const payment = await this.verifier.verify(new Request("https://example.invalid"));

    return {
      listingId: listing.id,
      paymentTxHash: payment.paymentTxHash,
      accessGrantExpiresAt: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      accessState: "active",
    };
  }
}

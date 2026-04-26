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

  async createHumanPurchase(
    intent: PurchaseIntent,
    request: Request,
  ): Promise<PurchaseReceipt & { mode: string; settlement?: Record<string, unknown> }> {
    const listing = sampleListings.find((item) => item.id === intent.listingId);

    if (!listing) {
      throw new Error("Listing not found.");
    }

    const payment = await this.verifier.verify(request, {
      listingId: listing.id,
      amountAtomic: listing.priceAtomic,
      amountUsd: listing.priceUsd,
      resource: {
        url: `https://tracer.local/listings/${listing.id}`,
        description: listing.title,
        mimeType: "application/json",
      },
    });

    return {
      listingId: listing.id,
      paymentTxHash: payment.paymentTxHash,
      accessGrantExpiresAt: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      accessState: "active",
      mode: payment.mode,
      settlement: payment.settlement,
    };
  }
}

import { prisma } from "@/lib/prisma";
import { getListingBySlugRaw } from "@/lib/data/listings";
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

const ACCESS_GRANT_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export class PurchaseService {
  constructor(private readonly verifier: IPaymentVerifier) {}

  async createHumanPurchase(
    intent: PurchaseIntent,
    request: Request,
  ): Promise<PurchaseReceipt & { mode: string; settlement?: Record<string, unknown> }> {
    const listing = await getListingBySlugRaw(intent.listingId);

    if (!listing) {
      throw new Error("Listing not found.");
    }

    if (!listing.asset) {
      throw new Error("Listing has no downloadable asset.");
    }

    const priceUsd = Number(listing.priceUsd).toFixed(2);
    const priceAtomic = String(Math.round(Number(listing.priceUsd) * 1_000_000));

    const payment = await this.verifier.verify(request, {
      listingId: listing.slug,
      amountAtomic: priceAtomic,
      amountUsd: priceUsd,
      resource: {
        url: `https://tracer.local/listings/${listing.slug}`,
        description: listing.title,
        mimeType: "application/json",
      },
    });

    const walletAddress = intent.buyerWalletAddress.toLowerCase();
    const expiresAt = new Date(Date.now() + ACCESS_GRANT_TTL_MS);

    const buyer = await prisma.user.upsert({
      where: { walletAddress },
      update: {},
      create: { walletAddress },
    });

    const purchase = await prisma.purchase.create({
      data: {
        buyerId: buyer.id,
        listingId: listing.id,
        amountUsd: Number(priceUsd),
        paymentTxHash: payment.paymentTxHash,
        accessGrants: {
          create: {
            buyerId: buyer.id,
            assetId: listing.asset.id,
            expiresAt,
          },
        },
      },
      include: { accessGrants: true },
    });

    return {
      listingId: listing.slug,
      paymentTxHash: purchase.paymentTxHash,
      accessGrantExpiresAt: purchase.accessGrants[0]?.expiresAt.toISOString() ?? expiresAt.toISOString(),
      accessState: "active",
      mode: payment.mode,
      settlement: payment.settlement,
    };
  }
}

import { NextResponse } from "next/server";
import { MockPaymentVerifier } from "@/lib/payment/mock-verifier";
import { PurchaseService } from "@/lib/services/purchase-service";

export async function POST(request: Request) {
  const body = (await request.json()) as { listingId?: string; buyerWalletAddress?: string };

  if (!body.listingId || !body.buyerWalletAddress) {
    return NextResponse.json(
      { error: "listingId and buyerWalletAddress are required." },
      { status: 400 },
    );
  }

  const service = new PurchaseService(new MockPaymentVerifier());
  const receipt = await service.createHumanPurchase({
    listingId: body.listingId,
    buyerWalletAddress: body.buyerWalletAddress,
  });

  return NextResponse.json(receipt, { status: 201 });
}

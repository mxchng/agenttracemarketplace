import { NextResponse } from "next/server";
import { Buffer } from "node:buffer";
import { getPaymentVerifier } from "@/lib/payment/factory";
import { PurchaseService } from "@/lib/services/purchase-service";

export async function POST(request: Request) {
  const body = (await request.json()) as { listingId?: string; buyerWalletAddress?: string };

  if (!body.listingId || !body.buyerWalletAddress) {
    return NextResponse.json(
      { error: "listingId and buyerWalletAddress are required." },
      { status: 400 },
    );
  }

  const service = new PurchaseService(getPaymentVerifier());

  try {
    const receipt = await service.createHumanPurchase(
      {
        listingId: body.listingId,
        buyerWalletAddress: body.buyerWalletAddress,
      },
      request,
    );

    const response = NextResponse.json(receipt, { status: 201 });

    if (receipt.mode === "x402" && receipt.settlement) {
      response.headers.set(
        "PAYMENT-RESPONSE",
        Buffer.from(JSON.stringify(receipt.settlement)).toString("base64"),
      );
      response.headers.set(
        "Access-Control-Expose-Headers",
        "PAYMENT-RESPONSE, PAYMENT-REQUIRED",
      );
    }

    return response;
  } catch (error) {
    const detail =
      error instanceof Error ? error.message : "Purchase verification failed.";

    return NextResponse.json({ error: detail }, { status: 402 });
  }
}

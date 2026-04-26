import { NextResponse } from "next/server";
import { sampleListings } from "@/lib/data/mock-data";
import { getPaymentVerifier } from "@/lib/payment/factory";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: RouteProps) {
  const { id } = await params;
  const listing = sampleListings.find((item) => item.id === id);

  if (!listing) {
    return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  }

  const challenge = await getPaymentVerifier().generateChallenge({
    listingId: listing.id,
    amountAtomic: listing.priceAtomic,
    amountUsd: listing.priceUsd,
    resource: {
      url: `https://agenttracemarketplace.local/listings/${listing.id}`,
      description: listing.title,
      mimeType: "application/json",
    },
  });

  const response = NextResponse.json(challenge.body, { status: challenge.status });

  for (const [header, value] of Object.entries(challenge.headers)) {
    response.headers.set(header, value);
  }

  return response;
}

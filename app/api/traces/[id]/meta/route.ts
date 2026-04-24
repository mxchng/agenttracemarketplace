import { NextResponse } from "next/server";
import { sampleListings } from "@/lib/data/mock-data";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: RouteProps) {
  const { id } = await params;
  const listing = sampleListings.find((item) => item.id === id);

  if (!listing) {
    return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  }

  return NextResponse.json({
    id: listing.id,
    title: listing.title,
    domain: listing.domain,
    taskType: listing.taskType,
    sourceLabel: listing.sourceLabel,
    verificationStatus: listing.verificationStatus,
    previewBoundaryNote: "inputs/outputs withheld until purchase",
  });
}

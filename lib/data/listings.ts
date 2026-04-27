import { prisma } from "@/lib/prisma";
import { toListingSummary } from "@/lib/data/listing-mapper";
import type { ListingSummary } from "@/lib/data/mock-data";

const listingInclude = { tools: true, asset: true } as const;

export async function getAllListings(): Promise<ListingSummary[]> {
  const rows = await prisma.traceListing.findMany({
    include: listingInclude,
    orderBy: { createdAt: "asc" },
  });
  return rows.map(toListingSummary);
}

export async function getListingBySlug(slug: string): Promise<ListingSummary | null> {
  const row = await prisma.traceListing.findUnique({
    where: { slug },
    include: listingInclude,
  });
  return row ? toListingSummary(row) : null;
}

export async function getListingBySlugRaw(slug: string) {
  return prisma.traceListing.findUnique({
    where: { slug },
    include: listingInclude,
  });
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getOptionalWalletSession } from "@/lib/auth/session";

const SourceType = z.enum(["SYNTHETIC", "HYBRID", "AGENT_GENERATED", "HUMAN_GENERATED"]);
const VerificationStatus = z.enum(["PREVIEW_BOUNDARY_ENFORCED", "SCHEMA_REVIEWED", "HUMAN_REVIEWED"]);

const CreateListingSchema = z.object({
  title: z.string().min(4).max(200),
  description: z.string().min(10).max(1000),
  domain: z.string().min(2).max(100),
  taskType: z.string().min(2).max(100),
  sourceType: SourceType,
  verificationStatus: VerificationStatus,
  priceUsd: z.number().positive().max(10_000),
  tools: z.array(z.string().min(1).max(60)).max(20).default([]),
  samplePreview: z.string().min(2).max(4000),
  storageKey: z.string().max(500).optional(),
});

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

async function uniqueSlug(base: string) {
  let candidate = base;
  let suffix = 0;
  while (await prisma.traceListing.findUnique({ where: { slug: candidate } })) {
    suffix++;
    candidate = `${base}-${suffix}`;
  }
  return candidate;
}

export async function POST(request: Request) {
  const session = await getOptionalWalletSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = CreateListingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const slug = await uniqueSlug(slugify(data.title));

  const user = await prisma.user.upsert({
    where: { walletAddress: session.walletAddress },
    update: {},
    create: { walletAddress: session.walletAddress },
  });

  let supplierProfile = await prisma.supplierProfile.findUnique({ where: { userId: user.id } });
  if (!supplierProfile) {
    supplierProfile = await prisma.supplierProfile.create({
      data: { userId: user.id, baseWalletAddress: session.walletAddress },
    });
  }

  const listing = await prisma.traceListing.create({
    data: {
      slug,
      title: data.title,
      description: data.description,
      domain: data.domain,
      taskType: data.taskType,
      sourceType: data.sourceType,
      verificationStatus: data.verificationStatus,
      priceUsd: data.priceUsd,
      supplierProfileId: supplierProfile.id,
      tools: { create: data.tools.map((value) => ({ value })) },
      asset: {
        create: {
          storageKey: data.storageKey ?? `uploads/${slug}.jsonl`,
          samplePreview: data.samplePreview,
          formatVersion: "1.0",
          sourceType: data.sourceType,
        },
      },
    },
    include: { tools: true },
  });

  await prisma.supplierProfile.update({
    where: { id: supplierProfile.id },
    data: { listingCount: { increment: 1 } },
  });

  return NextResponse.json({ id: listing.slug, slug: listing.slug }, { status: 201 });
}

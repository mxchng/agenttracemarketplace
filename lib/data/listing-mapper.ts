import type { TraceListing, ListingTool } from "@prisma/client";
import type { ListingSummary } from "@/lib/data/mock-data";

type ListingWithTools = TraceListing & { tools: ListingTool[] };

const SOURCE_LABELS: Record<string, { label: string; toneClass: string }> = {
  SYNTHETIC: { label: "Synthetic seed, clearly labeled", toneClass: "status-chip--synthetic" },
  HYBRID: { label: "Hybrid sample set", toneClass: "" },
  AGENT_GENERATED: { label: "Agent generated", toneClass: "" },
  HUMAN_GENERATED: { label: "Human generated", toneClass: "" },
};

const VERIFICATION_LABELS: Record<string, string> = {
  PREVIEW_BOUNDARY_ENFORCED: "Preview boundary enforced",
  SCHEMA_REVIEWED: "Schema reviewed",
  HUMAN_REVIEWED: "Human reviewed",
};

export function toListingSummary(listing: ListingWithTools): ListingSummary {
  const source = SOURCE_LABELS[listing.sourceType] ?? { label: listing.sourceType, toneClass: "" };
  const priceUsd = Number(listing.priceUsd).toFixed(2);
  const priceAtomic = String(Math.round(Number(listing.priceUsd) * 1_000_000));

  return {
    id: listing.slug,
    title: listing.title,
    useCase: listing.description,
    domain: listing.domain,
    taskType: listing.taskType,
    tools: listing.tools.map((t) => t.value),
    sourceLabel: source.label,
    sourceToneClass: source.toneClass,
    verificationStatus: VERIFICATION_LABELS[listing.verificationStatus] ?? listing.verificationStatus,
    verificationToneClass: "status-chip--verified",
    priceLabel: `$${priceUsd} / batch`,
    priceUsd,
    priceAtomic,
    previewHook: "Step labels and tool names visible. Inputs and outputs withheld until purchase.",
    accessTermLabel: "30-day access term",
  };
}

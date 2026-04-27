import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const browser = await prisma.traceListing.upsert({
    where: { slug: "browser-trace-bundle" },
    update: {},
    create: {
      slug: "browser-trace-bundle",
      title: "Browser QA traces for purchase and checkout flows",
      description:
        "50 browser-task traces showing retries, recovery, and completion behavior in commerce-style flows.",
      domain: "QA automation",
      taskType: "web task execution",
      sourceType: "SYNTHETIC",
      verificationStatus: "SCHEMA_REVIEWED",
      priceUsd: 5.0,
      tools: {
        create: [{ value: "browser-use" }, { value: "fetch" }, { value: "form fill" }],
      },
      asset: {
        create: {
          storageKey: "seeds/browser-trace-bundle.jsonl",
          samplePreview: JSON.stringify([
            { step: 1, label: "Navigate", type: "tool_call", tool: "browser-use" },
            { step: 2, label: "Inspect state", type: "tool_result", tool: "page check" },
            { step: 3, label: "Finish task", type: "completion", tool: "success path" },
          ]),
          formatVersion: "1.0",
          sourceType: "SYNTHETIC",
        },
      },
    },
  });

  const research = await prisma.traceListing.upsert({
    where: { slug: "research-agent-pack" },
    update: {},
    create: {
      slug: "research-agent-pack",
      title: "Research agent traces for synthesis and citation grounding",
      description:
        "A compact bundle for teams tuning research assistants that need good fallback behavior.",
      domain: "Research",
      taskType: "multi-source synthesis",
      sourceType: "HYBRID",
      verificationStatus: "PREVIEW_BOUNDARY_ENFORCED",
      priceUsd: 8.0,
      tools: {
        create: [{ value: "search" }, { value: "fetch" }, { value: "citation" }],
      },
      asset: {
        create: {
          storageKey: "seeds/research-agent-pack.jsonl",
          samplePreview: JSON.stringify([
            { step: 1, label: "Search query", type: "tool_call", tool: "search" },
            { step: 2, label: "Fetch source", type: "tool_call", tool: "fetch" },
            { step: 3, label: "Ground citation", type: "tool_result", tool: "citation" },
          ]),
          formatVersion: "1.0",
          sourceType: "HYBRID",
        },
      },
    },
  });

  console.log("Seeded listings:", browser.id, research.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

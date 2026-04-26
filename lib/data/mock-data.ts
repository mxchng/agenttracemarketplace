export type ListingSummary = {
  id: string;
  title: string;
  useCase: string;
  domain: string;
  taskType: string;
  tools: string[];
  sourceLabel: string;
  sourceToneClass: string;
  verificationStatus: string;
  verificationToneClass: string;
  priceLabel: string;
  priceUsd: string;
  priceAtomic: string;
  previewHook: string;
  accessTermLabel: string;
};

export const sampleListings: ListingSummary[] = [
  {
    id: "browser-trace-bundle",
    title: "Browser QA traces for purchase and checkout flows",
    useCase:
      "50 browser-task traces showing retries, recovery, and completion behavior in commerce-style flows.",
    domain: "QA automation",
    taskType: "web task execution",
    tools: ["browser-use", "fetch", "form fill"],
    sourceLabel: "Synthetic seed, clearly labeled",
    sourceToneClass: "status-chip--synthetic",
    verificationStatus: "Schema reviewed",
    verificationToneClass: "status-chip--verified",
    priceLabel: "$5 / batch",
    priceUsd: "5.00",
    priceAtomic: "5000000",
    previewHook: "3-step excerpt shows navigation, tool choice, and completion path",
    accessTermLabel: "30-day access term",
  },
  {
    id: "research-agent-pack",
    title: "Research agent traces for synthesis and citation grounding",
    useCase:
      "A compact bundle for teams tuning research assistants that need good fallback behavior.",
    domain: "Research",
    taskType: "multi-source synthesis",
    tools: ["search", "fetch", "citation"],
    sourceLabel: "Hybrid sample set",
    sourceToneClass: "",
    verificationStatus: "Preview boundary enforced",
    verificationToneClass: "status-chip--verified",
    priceLabel: "$8 / batch",
    priceUsd: "8.00",
    priceAtomic: "8000000",
    previewHook: "Preview exposes step labels and tool names, not source payloads",
    accessTermLabel: "Download on demand",
  },
];

export type PurchaseRecord = {
  id: string;
  listingTitle: string;
  status: "download-ready" | "purchase-recorded" | "expired";
  statusLabel: string;
  toneClass: string;
  note: string;
};

export const samplePurchases: PurchaseRecord[] = [
  {
    id: "purchase-1",
    listingTitle: "Browser QA traces for purchase and checkout flows",
    status: "download-ready",
    statusLabel: "Download ready",
    toneClass: "status-chip--verified",
    note: "Access grant is active. Fetch a fresh URL when you need it.",
  },
  {
    id: "purchase-2",
    listingTitle: "Research agent traces for synthesis and citation grounding",
    status: "purchase-recorded",
    statusLabel: "Asset preparing",
    toneClass: "",
    note: "Purchase is recorded. Retry download if the short-lived URL has expired.",
  },
  {
    id: "purchase-3",
    listingTitle: "Legacy support bot traces",
    status: "expired",
    statusLabel: "Access expired",
    toneClass: "status-chip--expired",
    note: "Grant term ended. Repurchase to restore access.",
  },
];

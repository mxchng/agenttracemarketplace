import Link from "next/link";
import { notFound } from "next/navigation";
import { ListingPurchaseBox } from "@/components/listing-purchase-box";
import { getOptionalWalletSession } from "@/lib/auth/session";
import { SiteHeader } from "@/components/site-header";
import { baseAppChainLabel } from "@/lib/base/chain";
import { sampleListings } from "@/lib/data/mock-data";

type ListingDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ListingDetailPage({
  params,
}: ListingDetailPageProps) {
  const session = await getOptionalWalletSession();
  const { id } = await params;
  const listing = sampleListings.find((item) => item.id === id);

  if (!listing) {
    notFound();
  }

  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="page">
        <div className="section">
          <span className="eyebrow">Listing detail</span>
          <h1 className="page-title">{listing.title}</h1>
          <p className="section-copy">{listing.useCase}</p>
        </div>
        <section className="two-column">
          <div className="stack">
            <article className="panel stack">
              <h2 className="section-title" style={{ fontSize: "2rem" }}>
                Trust block
              </h2>
              <div className="inline-meta">
                <span className={`status-chip ${listing.sourceToneClass}`}>
                  {listing.sourceLabel}
                </span>
                <span className={`status-chip ${listing.verificationToneClass}`}>
                  {listing.verificationStatus}
                </span>
                <span className="label-chip">{listing.accessTermLabel}</span>
              </div>
              <p className="muted-copy">
                This scaffold keeps trust above preview and purchase so buyers know
                what they are looking at before price and action compete for attention.
              </p>
            </article>

            <article className="panel stack">
              <h2 className="section-title" style={{ fontSize: "2rem" }}>
                Safe preview
              </h2>
              <div className="preview-list">
                <div className="preview-step">
                  <strong>1. Navigate</strong>
                  <span className="muted-copy">tool_call • browser-use</span>
                </div>
                <div className="preview-step">
                  <strong>2. Inspect state</strong>
                  <span className="muted-copy">tool_result • page check</span>
                </div>
                <div className="preview-step">
                  <strong>3. Finish task</strong>
                  <span className="muted-copy">completion • success path</span>
                </div>
              </div>
              <p className="muted-copy">
                Inputs and outputs withheld until purchase.
              </p>
            </article>

            <article className="panel stack">
              <h2 className="section-title" style={{ fontSize: "2rem" }}>
                Deep metadata
              </h2>
              <div className="catalog-card__meta">
                <span className="label-chip">{listing.domain}</span>
                <span className="label-chip">{listing.taskType}</span>
                {listing.tools.map((tool) => (
                  <span className="label-chip" key={tool}>
                    {tool}
                  </span>
                ))}
              </div>
              <p className="muted-copy">
                Schema details and richer provenance notes belong below the fold in
                the full implementation.
              </p>
            </article>
          </div>

          <aside className="panel stack">
            <span className="eyebrow">Purchase box</span>
            <h2 className="section-title" style={{ fontSize: "2rem" }}>
              {listing.priceLabel}
            </h2>
            <p className="muted-copy">
              Stable purchase states matter more than flashy wallet choreography,
              even when the wallet flow is rooted in {baseAppChainLabel}.
            </p>
            <ListingPurchaseBox
              currentSessionWalletAddress={session?.walletAddress ?? null}
              listingId={listing.id}
              priceLabel={listing.priceLabel}
            />
          </aside>
        </section>
      </main>
    </div>
  );
}

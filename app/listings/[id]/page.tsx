import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { baseAppChainLabel } from "@/lib/base/chain";
import { sampleListings } from "@/lib/data/mock-data";

type ListingDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ListingDetailPage({
  params,
}: ListingDetailPageProps) {
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
            <div className="stack">
              <div className="preview-step">
                <strong>Not signed in</strong>
                <span className="muted-copy">
                  Connect wallet to create an app session.
                </span>
              </div>
              <div className="preview-step">
                <strong>Purchase pending</strong>
                <span className="muted-copy">
                  Show one calm state while payment and grant creation resolve.
                </span>
              </div>
              <div className="preview-step">
                <strong>Session expired</strong>
                <span className="muted-copy">
                  Re-authenticate without losing listing context.
                </span>
              </div>
            </div>
            <div className="button-row">
              <Link className="button-link" href="/buyer/purchases">
                View buyer library states
              </Link>
              <span className="button-link--secondary">Mock purchase flow</span>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

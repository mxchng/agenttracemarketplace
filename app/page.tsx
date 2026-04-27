import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { baseAppChainLabel } from "@/lib/base/chain";
import { getAllListings } from "@/lib/data/listings";

export default async function HomePage() {
  const listings = await getAllListings();
  const featured = listings[0];

  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="page">
        <section className="hero-grid">
          <div className="section">
            <span className="eyebrow">Base-native trace marketplace</span>
            <h1 className="display-title">
              Buy agent behavior, not just static datasets.
            </h1>
            <p className="lede">
              A buyer-first MVP for teams who want inspectable trace bundles,
              factual trust signals, and machine-ready access paths settled on{" "}
              {baseAppChainLabel}.
            </p>
            <div className="button-row">
              <Link className="button-link" href="/marketplace">
                Browse marketplace
              </Link>
              <Link className="button-link--secondary" href="/buyer/purchases">
                See purchase states
              </Link>
            </div>
            <div className="trust-strip" aria-label="Trust strip">
              <div className="trust-strip__item">
                <strong>Labeling promise</strong>
                <p className="muted-copy">
                  Synthetic traces are disclosed clearly. No pretending seed data
                  is something else.
                </p>
              </div>
              <div className="trust-strip__item">
                <strong>Wallet-based access</strong>
                <p className="muted-copy">
                  Coinbase wallet and injected-wallet support sit behind the app shell now.
                </p>
              </div>
              <div className="trust-strip__item">
                <strong>Base and x402 seam</strong>
                <p className="muted-copy">
                  Human and machine purchase flows share one domain model on top of Base.
                </p>
              </div>
              <div className="trust-strip__item">
                <strong>Structured trace schema</strong>
                <p className="muted-copy">
                  Safe previews expose the shape of the trace without leaking the
                  paid payload.
                </p>
              </div>
            </div>
          </div>
          <aside className="panel stack">
            <span className="eyebrow">Concrete example</span>
            <h2 className="section-title" style={{ fontSize: "2rem" }}>
              {featured.title}
            </h2>
            <p className="muted-copy">{featured.useCase}</p>
            <div className="inline-meta">
              <span className={`status-chip ${featured.sourceToneClass}`}>
                {featured.sourceLabel}
              </span>
              <span className={`status-chip ${featured.verificationToneClass}`}>
                {featured.verificationStatus}
              </span>
              <span className="label-chip">{featured.priceLabel}</span>
            </div>
            <div className="preview-step">
              <strong>Preview rule</strong>
              <p className="muted-copy">
                First three step summaries only. Inputs and outputs stay withheld
                until purchase.
              </p>
            </div>
          </aside>
        </section>
      </main>
      <footer className="site-footer">
        Supplier self-serve remains below the fold in this buyer-first scaffold.
      </footer>
    </div>
  );
}

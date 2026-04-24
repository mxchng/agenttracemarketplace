import { ListingCard } from "@/components/listing-card";
import { SiteHeader } from "@/components/site-header";
import { sampleListings } from "@/lib/data/mock-data";

export default function MarketplacePage() {
  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="page">
        <div className="section">
          <span className="eyebrow">Marketplace</span>
          <h1 className="page-title">Browse trace bundles by trust and task fit.</h1>
          <p className="section-copy">
            The scan order is deliberate: use case first, then provenance, then
            verification, then price.
          </p>
        </div>
        <section className="marketplace-layout" style={{ gridTemplateColumns: "280px 1fr" }}>
          <aside className="panel filters-panel" aria-label="Filters">
            <div className="filter-group">
              <strong>Domain</strong>
              <div className="filter-row">
                <span className="label-chip">QA automation</span>
                <span className="label-chip">Research</span>
              </div>
            </div>
            <div className="filter-group">
              <strong>Task type</strong>
              <div className="filter-row">
                <span className="label-chip">web task execution</span>
                <span className="label-chip">multi-source synthesis</span>
              </div>
            </div>
            <div className="filter-group">
              <strong>Source type</strong>
              <div className="filter-row">
                <span className="label-chip">synthetic</span>
                <span className="label-chip">hybrid</span>
              </div>
            </div>
            <p className="muted-copy">
              Mobile implementation should move this panel into a filter drawer.
            </p>
          </aside>
          <section className="catalog-list" aria-label="Listings">
            {sampleListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </section>
        </section>
      </main>
    </div>
  );
}

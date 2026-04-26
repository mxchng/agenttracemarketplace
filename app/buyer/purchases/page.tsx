import { requireWalletSession } from "@/lib/auth/session";
import { SiteHeader } from "@/components/site-header";
import { samplePurchases } from "@/lib/data/mock-data";

export default async function BuyerPurchasesPage() {
  const session = await requireWalletSession();

  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="page">
        <div className="section">
          <span className="eyebrow">Buyer library</span>
          <h1 className="page-title">Purchased trace bundles should feel owned.</h1>
          <p className="section-copy">
            Signed in as {session.walletAddress}. This buyer-first scaffold treats
            purchases as a reusable library, not a dead receipt page.
          </p>
        </div>
        <section className="purchases-list">
          {samplePurchases.map((purchase) => (
            <article className="card purchase-row" key={purchase.id}>
              <div className="inline-meta">
                <span className={`status-chip ${purchase.toneClass}`}>
                  {purchase.statusLabel}
                </span>
              </div>
              <h2 className="section-title" style={{ fontSize: "1.5rem" }}>
                {purchase.listingTitle}
              </h2>
              <p className="muted-copy">{purchase.note}</p>
              <div className="button-row">
                <span className="button-link">Fetch download URL</span>
                <span className="button-link--secondary">View entitlement</span>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

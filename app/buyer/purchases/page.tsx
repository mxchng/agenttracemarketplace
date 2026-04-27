import Link from "next/link";
import { requireWalletSession } from "@/lib/auth/session";
import { SiteHeader } from "@/components/site-header";
import { prisma } from "@/lib/prisma";

export default async function BuyerPurchasesPage() {
  const session = await requireWalletSession();

  const purchases = await prisma.purchase.findMany({
    where: { buyer: { walletAddress: session.walletAddress } },
    include: {
      listing: true,
      accessGrants: { orderBy: { expiresAt: "desc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

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
          {purchases.length === 0 ? (
            <article className="card purchase-row">
              <p className="muted-copy">No purchases yet.</p>
              <div className="button-row">
                <Link className="button-link" href="/marketplace">Browse marketplace</Link>
              </div>
            </article>
          ) : (
            purchases.map((purchase) => {
              const grant = purchase.accessGrants[0];
              const now = new Date();
              const isActive = grant && grant.expiresAt > now;
              const statusLabel = isActive ? "Download ready" : grant ? "Access expired" : "Asset preparing";
              const toneClass = isActive ? "status-chip--verified" : grant ? "status-chip--expired" : "";
              const note = isActive
                ? `Access grant active until ${grant.expiresAt.toLocaleDateString()}.`
                : grant
                ? "Grant term ended. Repurchase to restore access."
                : "Purchase recorded. Asset is being prepared.";

              return (
                <article className="card purchase-row" key={purchase.id}>
                  <div className="inline-meta">
                    <span className={`status-chip ${toneClass}`}>{statusLabel}</span>
                  </div>
                  <h2 className="section-title" style={{ fontSize: "1.5rem" }}>
                    {purchase.listing.title}
                  </h2>
                  <p className="muted-copy">{note}</p>
                  <div className="button-row">
                    <Link
                      className="button-link"
                      href={`/api/traces/${purchase.listing.slug}/download`}
                    >
                      Fetch download URL
                    </Link>
                    <span className="button-link--secondary">View entitlement</span>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </main>
    </div>
  );
}

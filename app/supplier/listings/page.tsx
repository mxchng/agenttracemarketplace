import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { getOptionalWalletSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export default async function SupplierListingsPage() {
  const session = await getOptionalWalletSession();

  if (!session) {
    redirect("/");
  }

  const listings = await prisma.traceListing.findMany({
    where: {
      supplierProfile: { user: { walletAddress: session.walletAddress } },
    },
    include: { tools: true, _count: { select: { purchases: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="page">
        <div className="section">
          <span className="eyebrow">Supplier</span>
          <h1 className="page-title">Your listings</h1>
          <p className="section-copy">
            Listings you have published to the marketplace.
          </p>
        </div>
        <div className="button-row" style={{ marginBottom: "var(--space-6)" }}>
          <Link className="button-link" href="/supplier/listings/new">
            Create listing
          </Link>
        </div>
        {listings.length === 0 ? (
          <div className="panel stack">
            <p className="muted-copy">No listings yet.</p>
            <Link className="button-link" href="/supplier/listings/new">
              Create your first listing
            </Link>
          </div>
        ) : (
          <section className="catalog-list">
            {listings.map((listing) => (
              <article className="panel stack" key={listing.id}>
                <div className="inline-meta">
                  <span className="label-chip">{listing.domain}</span>
                  <span className="label-chip">{listing.taskType}</span>
                  <span className="label-chip">{listing.sourceType.replace(/_/g, " ").toLowerCase()}</span>
                  <span className="status-chip status-chip--verified">
                    {listing.verificationStatus.replace(/_/g, " ").toLowerCase()}
                  </span>
                </div>
                <h2 className="section-title" style={{ fontSize: "1.25rem" }}>
                  {listing.title}
                </h2>
                <p className="muted-copy">{listing.description}</p>
                <div className="inline-meta">
                  <span className="label-chip">
                    ${Number(listing.priceUsd).toFixed(2)} / batch
                  </span>
                  <span className="label-chip">
                    {listing._count.purchases} purchase{listing._count.purchases !== 1 ? "s" : ""}
                  </span>
                  {listing.tools.map((t) => (
                    <span className="label-chip" key={t.id}>{t.value}</span>
                  ))}
                </div>
                <div className="button-row">
                  <Link
                    className="button-link--secondary"
                    href={`/listings/${listing.slug}`}
                  >
                    View listing
                  </Link>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

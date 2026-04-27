import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { CreateListingForm } from "@/components/create-listing-form";
import { getOptionalWalletSession } from "@/lib/auth/session";

export default async function NewListingPage() {
  const session = await getOptionalWalletSession();

  if (!session) {
    redirect("/");
  }

  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="page">
        <div className="section">
          <span className="eyebrow">Supplier</span>
          <h1 className="page-title">Create a listing</h1>
          <p className="section-copy">
            Listings are visible to buyers immediately. Make sure the source type and
            verification status are accurate before publishing.
          </p>
        </div>
        <div className="panel" style={{ maxWidth: "720px" }}>
          <CreateListingForm />
        </div>
      </main>
    </div>
  );
}

import Link from "next/link";
import type { ListingSummary } from "@/lib/data/mock-data";

type ListingCardProps = {
  listing: ListingSummary;
};

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <article className="card catalog-card">
      <div className="stack">
        <div className="inline-meta">
          <span className={`status-chip ${listing.sourceToneClass}`}>
            {listing.sourceLabel}
          </span>
          <span className={`status-chip ${listing.verificationToneClass}`}>
            {listing.verificationStatus}
          </span>
          <span className="label-chip">{listing.priceLabel}</span>
        </div>
        <div className="stack">
          <h2 className="section-title" style={{ fontSize: "1.5rem" }}>
            {listing.title}
          </h2>
          <p className="muted-copy">{listing.useCase}</p>
        </div>
        <div className="catalog-card__meta">
          <span className="label-chip">{listing.domain}</span>
          <span className="label-chip">{listing.taskType}</span>
          {listing.tools.map((tool) => (
            <span className="label-chip" key={tool}>
              {tool}
            </span>
          ))}
        </div>
      </div>
      <div className="stack">
        <p className="muted-copy">
          Preview hook: {listing.previewHook}
          <br />
          Inputs and outputs stay withheld until purchase.
        </p>
        <div className="button-row">
          <Link className="button-link" href={`/listings/${listing.id}`}>
            Inspect listing
          </Link>
          <span className="button-link--secondary">
            {listing.accessTermLabel}
          </span>
        </div>
      </div>
    </article>
  );
}

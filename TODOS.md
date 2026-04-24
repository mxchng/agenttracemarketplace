# TODOs

## Supplier self-serve dashboard and listing creation

What: Add supplier self-serve flows for dashboard access, listing creation, upload handling, and seller-side sales visibility.

Why: The buyer-first MVP intentionally defers the second side of the marketplace so we can prove purchase and download behavior first.

Pros: Preserves the reason for the scope cut, makes the next product step explicit, and gives future implementation a clear starting point.

Cons: The exact seller workflow may change after the buyer loop is validated.

Context: Deferred during `/plan-eng-review` after choosing the buyer-first MVP scope. This should start only after seeded listings, human purchase flow, machine challenge flow, and grant-based download all work reliably.

Depends on / blocked by: Blocked by a working buyer-first MVP and initial seeded inventory validation.

## Search and ranking re-evaluation

What: Revisit search and ranking once listing volume or filter complexity outgrows indexed relational queries.

Why: The MVP should stay boring by default with normalized indexed filters, but marketplace browse quality will eventually need a more capable search layer.

Pros: Records the decision boundary for when to upgrade instead of re-arguing it from scratch later.

Cons: The exact threshold and tooling choice may evolve with real usage data.

Context: Deferred during `/plan-eng-review` after choosing normalized indexed filters and no external search engine for v1. Revisit if browse latency climbs, facet quality degrades, or listing count makes relational filtering feel bad.

Depends on / blocked by: Blocked by real usage data, listing growth, or observed marketplace latency.

## Provenance and verification metadata expansion

What: Expand the trust model beyond basic source labeling to include provenance evidence, verification events, and stronger buyer trust signals.

Why: Synthetic traces are acceptable in v1 only if they are labeled clearly. Longer term, the marketplace needs better provenance and verification to earn trust.

Pros: Keeps trust work visible after MVP shipping pressure kicks in and creates a natural next step after basic labeling.

Cons: The exact design should be informed by real supplier and buyer behavior rather than guessed upfront.

Context: Deferred during `/plan-eng-review` after keeping clear labeling in v1 and postponing richer verification and reputation systems.

Depends on / blocked by: Blocked by post-MVP supplier onboarding and actual marketplace behavior.

## Supplier-side responsive and accessibility design

What: Define responsive behavior, empty states, and accessibility rules for supplier self-serve surfaces when the seller workflow returns to scope.

Why: The buyer-first MVP now has explicit mobile and accessibility standards. The supplier side should not fall back to a stacked desktop UI or vague a11y cleanup later.

Pros: Preserves design parity between buyer and supplier surfaces, keeps the mobile/a11y quality bar consistent, and gives future implementation a clear reminder.

Cons: The exact seller workflow may evolve before it is built, so some details will need revision later.

Context: Deferred during `/plan-design-review` because supplier dashboard and listing creation remain out of scope in the buyer-first MVP, while buyer-side responsive and accessibility behavior was specified in detail.

Depends on / blocked by: Blocked by supplier self-serve returning from deferred scope.

import Link from "next/link";
import { BaseWalletButton } from "@/components/base-wallet-button";
import { getOptionalWalletSession } from "@/lib/auth/session";
import { baseAppChainLabel } from "@/lib/base/chain";

export async function SiteHeader() {
  const session = await getOptionalWalletSession();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="brand-mark">
          <Link className="brand-mark__title" href="/">
            agenttracemarketplace
          </Link>
          <span className="brand-mark__subtitle">
            Buyer-first MVP for agent training traces
          </span>
        </div>
        <nav aria-label="Primary" className="nav-links">
          <Link href="/marketplace">Browse marketplace</Link>
          <Link href="/buyer/purchases">Purchases</Link>
          <span className="status-chip">{baseAppChainLabel}</span>
          <BaseWalletButton currentSessionWalletAddress={session?.walletAddress ?? null} />
        </nav>
      </div>
    </header>
  );
}

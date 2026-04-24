"use client";

import { useMemo, useState } from "react";
import { baseAppChain, baseAppChainLabel, shortWalletAddress } from "@/lib/base/chain";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";

export function BaseWalletButton() {
  const { address, chainId, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const [lastError, setLastError] = useState<string | null>(null);

  const preferredConnector = useMemo(() => {
    return (
      connectors.find((connector) => {
        const id = connector.id.toLowerCase();
        const name = connector.name.toLowerCase();
        return id.includes("coinbase") || name.includes("coinbase");
      }) ?? connectors[0]
    );
  }, [connectors]);

  if (!isConnected) {
    return (
      <div className="stack" style={{ gap: "8px" }}>
        <button
          type="button"
          className="button-link"
          onClick={() => {
            setLastError(null);

            if (!preferredConnector) {
              setLastError("No wallet connector is available in this browser.");
              return;
            }

            connect(
              { connector: preferredConnector },
              {
                onError(error) {
                  setLastError(error.message);
                },
              },
            );
          }}
          disabled={isPending || !preferredConnector}
        >
          {isPending
            ? "Connecting..."
            : preferredConnector?.name
              ? `Connect with ${preferredConnector.name}`
              : "Connect Base wallet"}
        </button>
        {lastError ? (
          <p className="muted-copy" role="status">
            Wallet connection failed: {lastError}
          </p>
        ) : (
          <p className="muted-copy" role="status">
            Preferred path: Coinbase Wallet first, then injected wallet fallback.
          </p>
        )}
      </div>
    );
  }

  if (chainId !== baseAppChain.id) {
    return (
      <button
        type="button"
        className="button-link"
        onClick={() => switchChain({ chainId: baseAppChain.id })}
        disabled={isSwitching}
      >
        {isSwitching ? "Switching..." : `Switch to ${baseAppChainLabel}`}
      </button>
    );
  }

  return (
    <button type="button" className="button-link--secondary" onClick={() => disconnect()}>
      {shortWalletAddress(address ?? "")} on {baseAppChainLabel}
    </button>
  );
}

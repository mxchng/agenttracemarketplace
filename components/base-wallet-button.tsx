"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { baseAppChain, baseAppChainLabel, shortWalletAddress } from "@/lib/base/chain";
import { useAccount, useConnect, useDisconnect, useSignMessage, useSwitchChain } from "wagmi";

type BaseWalletButtonProps = {
  currentSessionWalletAddress?: string | null;
};

export function BaseWalletButton({
  currentSessionWalletAddress = null,
}: BaseWalletButtonProps) {
  const { address, chainId, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { signMessageAsync, isPending: isSigning } = useSignMessage();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const router = useRouter();
  const [lastError, setLastError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const preferredConnector = useMemo(() => {
    return (
      connectors.find((connector) => {
        const id = connector.id.toLowerCase();
        const name = connector.name.toLowerCase();
        return id.includes("coinbase") || name.includes("coinbase");
      }) ?? connectors[0]
    );
  }, [connectors]);

  const normalizedAddress = address?.toLowerCase() ?? null;
  const isSignedInForConnectedWallet =
    Boolean(normalizedAddress) &&
    currentSessionWalletAddress?.toLowerCase() === normalizedAddress;

  async function signInWithWallet() {
    if (!address || typeof chainId !== "number") {
      setLastError("Connect a wallet on Base before signing in.");
      return;
    }

    setLastError(null);
    setIsAuthenticating(true);

    try {
      const nonceResponse = await fetch("/api/auth/nonce", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress: address,
          chainId,
        }),
      });

      const noncePayload = (await nonceResponse.json()) as {
        message?: string;
        error?: string;
      };

      if (!nonceResponse.ok || !noncePayload.message) {
        throw new Error(noncePayload.error ?? "Could not start wallet sign-in.");
      }

      const signature = await signMessageAsync({ message: noncePayload.message });

      const verifyResponse = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress: address,
          message: noncePayload.message,
          signature,
        }),
      });

      const verifyPayload = (await verifyResponse.json()) as { error?: string };

      if (!verifyResponse.ok) {
        throw new Error(verifyPayload.error ?? "Wallet sign-in failed.");
      }

      router.refresh();
    } catch (error) {
      setLastError(error instanceof Error ? error.message : "Wallet sign-in failed.");
    } finally {
      setIsAuthenticating(false);
    }
  }

  async function signOut() {
    setLastError(null);
    setIsAuthenticating(true);

    try {
      await fetch("/api/auth/logout", { method: "POST" });
      disconnect();
      router.refresh();
    } catch (error) {
      setLastError(error instanceof Error ? error.message : "Sign-out failed.");
    } finally {
      setIsAuthenticating(false);
    }
  }

  if (!isConnected) {
    return (
      <div className="wallet-control">
        <button
          type="button"
          className="button-link wallet-control__button"
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
          {isPending ? "Connecting..." : "Connect Wallet"}
        </button>
        {lastError ? <p className="wallet-control__error" role="status">{lastError}</p> : null}
      </div>
    );
  }

  if (chainId !== baseAppChain.id) {
    return (
      <div className="wallet-control">
        <button
          type="button"
          className="button-link wallet-control__button"
          onClick={() => switchChain({ chainId: baseAppChain.id })}
          disabled={isSwitching}
        >
          {isSwitching ? "Switching..." : `Switch to ${baseAppChainLabel}`}
        </button>
      </div>
    );
  }

  if (!isSignedInForConnectedWallet) {
    return (
      <div className="wallet-control">
        <button
          type="button"
          className="button-link wallet-control__button"
          onClick={() => void signInWithWallet()}
          disabled={isAuthenticating || isSigning}
        >
          {isAuthenticating || isSigning ? "Signing in..." : "Sign In"}
        </button>
        {lastError ? <p className="wallet-control__error" role="status">{lastError}</p> : null}
      </div>
    );
  }

  return (
    <div className="wallet-control">
      <button
        type="button"
        className="button-link--secondary wallet-control__button wallet-control__button--connected"
        onClick={() => void signOut()}
        disabled={isAuthenticating}
        title="Signed in. Click to sign out."
      >
        <span className="wallet-control__status-dot" aria-hidden="true" />
        {isAuthenticating ? "Signing out..." : shortWalletAddress(address ?? "")}
      </button>
      {lastError ? <p className="wallet-control__error" role="status">{lastError}</p> : null}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { decodePaymentResponseHeader, x402Client, x402HTTPClient, type PaymentRequired } from "@x402/fetch";
import { ExactEvmScheme, toClientEvmSigner } from "@x402/evm";
import type { Address } from "viem";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { baseAppChain, baseAppChainLabel, shortWalletAddress } from "@/lib/base/chain";

type ListingPurchaseBoxProps = {
  currentSessionWalletAddress?: string | null;
  listingId: string;
  priceLabel: string;
};

type PurchaseReceipt = {
  listingId: string;
  paymentTxHash: string;
  accessGrantExpiresAt: string;
  accessState: "active";
  mode: string;
};

type PurchaseSuccess = {
  receipt: PurchaseReceipt;
  settlement: Record<string, unknown> | null;
};

type X402TypedData = {
  account: Address;
  domain: Record<string, unknown>;
  types: Record<string, unknown>;
  primaryType: string;
  message: Record<string, unknown>;
};

function shortHash(value: string) {
  return `${value.slice(0, 10)}...${value.slice(-6)}`;
}

export function ListingPurchaseBox({
  currentSessionWalletAddress = null,
  listingId,
  priceLabel,
}: ListingPurchaseBoxProps) {
  const { address, chainId, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient({ chainId: baseAppChain.id });
  const [quote, setQuote] = useState<PaymentRequired["accepts"][number] | null>(null);
  const [phase, setPhase] = useState<
    "idle" | "quoting" | "signing" | "submitting" | "success" | "error"
  >("idle");
  const [lastError, setLastError] = useState<string | null>(null);
  const [purchase, setPurchase] = useState<PurchaseSuccess | null>(null);

  const normalizedAddress = address?.toLowerCase() ?? null;
  const isSignedInForConnectedWallet =
    Boolean(normalizedAddress) &&
    currentSessionWalletAddress?.toLowerCase() === normalizedAddress;

  const buttonLabel =
    phase === "quoting"
      ? "Fetching quote..."
      : phase === "signing"
        ? "Awaiting wallet..."
        : phase === "submitting"
          ? "Submitting payment..."
          : "Purchase with Base";

  async function handlePurchase() {
    if (!isConnected || !address) {
      setLastError("Connect your wallet before purchasing.");
      setPhase("error");
      return;
    }

    if (chainId !== baseAppChain.id) {
      setLastError(`Switch to ${baseAppChainLabel} before purchasing.`);
      setPhase("error");
      return;
    }

    if (!isSignedInForConnectedWallet) {
      setLastError("Sign in with the connected wallet before purchasing.");
      setPhase("error");
      return;
    }

    if (!walletClient || !publicClient) {
      setLastError("Wallet client is not ready yet. Retry in a moment.");
      setPhase("error");
      return;
    }

    setLastError(null);
    setPurchase(null);
    setPhase("quoting");

    try {
      const challengeResponse = await fetch(`/api/traces/${listingId}/challenge`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const challengeBody = (await challengeResponse.json().catch(() => null)) as unknown;

      if (challengeResponse.status !== 402) {
        const detail =
          typeof challengeBody === "object" &&
          challengeBody &&
          "error" in challengeBody &&
          typeof challengeBody.error === "string"
            ? challengeBody.error
            : "Could not fetch the payment challenge.";
        throw new Error(detail);
      }

      const signer = toClientEvmSigner(
        {
          address: address as Address,
          signTypedData(message) {
            const signTypedData = walletClient.signTypedData as (
              payload: X402TypedData,
            ) => Promise<`0x${string}`>;

            return signTypedData({
              account: address as Address,
              domain: message.domain,
              types: message.types,
              primaryType: message.primaryType,
              message: message.message,
            });
          },
        },
        {
          readContract: publicClient.readContract.bind(publicClient),
          getTransactionCount: publicClient.getTransactionCount.bind(publicClient),
          estimateFeesPerGas: publicClient.estimateFeesPerGas.bind(publicClient),
        },
      );

      const httpClient = new x402HTTPClient(
        x402Client.fromConfig({
          schemes: [
            {
              network: "eip155:*",
              client: new ExactEvmScheme(signer),
            },
          ],
        }),
      );

      const paymentRequired = httpClient.getPaymentRequiredResponse(
        (name) => challengeResponse.headers.get(name),
        challengeBody,
      );
      const selectedRequirement = paymentRequired.accepts[0];

      if (!selectedRequirement) {
        throw new Error("The server did not advertise any payment options.");
      }

      setQuote(selectedRequirement);
      setPhase("signing");

      const paymentPayload = await httpClient.createPaymentPayload(paymentRequired);
      const paymentHeaders = httpClient.encodePaymentSignatureHeader(paymentPayload);

      setPhase("submitting");

      const purchaseResponse = await fetch("/api/purchases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...paymentHeaders,
        },
        body: JSON.stringify({
          listingId,
          buyerWalletAddress: address,
        }),
      });

      const purchaseBody = (await purchaseResponse.json().catch(() => null)) as
        | (PurchaseReceipt & { error?: string })
        | { error?: string }
        | null;

      if (!purchaseResponse.ok) {
        const detail =
          purchaseBody && "error" in purchaseBody && typeof purchaseBody.error === "string"
            ? purchaseBody.error
            : "Payment could not be verified.";
        throw new Error(detail);
      }

      const paymentResponse = purchaseResponse.headers.get("PAYMENT-RESPONSE");
      const settlement = paymentResponse
        ? (decodePaymentResponseHeader(paymentResponse) as Record<string, unknown>)
        : null;

      setPurchase({
        receipt: purchaseBody as PurchaseReceipt,
        settlement,
      });
      setPhase("success");
    } catch (error) {
      setPhase("error");
      setLastError(error instanceof Error ? error.message : "Purchase failed.");
    }
  }

  return (
    <div className="purchase-flow">
      <div className="purchase-flow__status">
        <strong>{isSignedInForConnectedWallet ? "Signed in" : "Sign-in required"}</strong>
        <span className="muted-copy">
          {isSignedInForConnectedWallet && address
            ? `Ready to authorize payment as ${shortWalletAddress(address)}.`
            : "Connect, switch to Base, and sign in once before paying."}
        </span>
      </div>

      {quote ? (
        <div className="purchase-flow__status">
          <strong>Quote locked</strong>
          <span className="muted-copy">
            {priceLabel} on {quote.network} to {shortWalletAddress(quote.payTo)}.
          </span>
        </div>
      ) : null}

      {purchase ? (
        <div className="purchase-flow__status purchase-flow__status--success">
          <strong>Payment settled</strong>
          <span className="muted-copy">
            Receipt {shortHash(purchase.receipt.paymentTxHash)} active until{" "}
            {new Date(purchase.receipt.accessGrantExpiresAt).toLocaleDateString()}.
          </span>
          {purchase.settlement && typeof purchase.settlement.transaction === "string" ? (
            <span className="muted-copy">
              Facilitator confirmed {shortHash(purchase.settlement.transaction)}.
            </span>
          ) : null}
        </div>
      ) : null}

      {lastError ? (
        <p className="purchase-flow__error" role="status">
          {lastError}
        </p>
      ) : null}

      <div className="button-row">
        <button
          type="button"
          className="button-link"
          onClick={() => void handlePurchase()}
          disabled={phase === "quoting" || phase === "signing" || phase === "submitting"}
        >
          {buttonLabel}
        </button>
        <Link className="button-link--secondary" href="/buyer/purchases">
          View buyer library
        </Link>
      </div>
    </div>
  );
}

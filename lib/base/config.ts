import { QueryClient } from "@tanstack/react-query";
import { createPublicClient, http } from "viem";
import { createConfig } from "wagmi";
import { coinbaseWallet, injected } from "wagmi/connectors";
import { base, baseSepolia } from "wagmi/chains";
import { baseAppChain, baseRpcUrl } from "@/lib/base/chain";

const coinbaseWalletPreference =
  process.env.NEXT_PUBLIC_COINBASE_WALLET_PREFERENCE === "all" ||
  process.env.NEXT_PUBLIC_COINBASE_WALLET_PREFERENCE === "smartWalletOnly"
    ? process.env.NEXT_PUBLIC_COINBASE_WALLET_PREFERENCE
    : "eoaOnly";

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected(),
    coinbaseWallet({
      appName: "Tracer",
      // The current custom x402 flow relies on direct typed-data signing.
      // Defaulting to an EOA wallet avoids Smart Wallet request-handling issues here.
      preference: coinbaseWalletPreference,
    }),
  ],
  transports: {
    [base.id]: http(
      baseAppChain.id === base.id ? baseRpcUrl : process.env.NEXT_PUBLIC_BASE_MAINNET_RPC_URL,
    ),
    [baseSepolia.id]: http(
      baseAppChain.id === baseSepolia.id
        ? baseRpcUrl
        : process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL,
    ),
  },
});

export const baseQueryClient = new QueryClient();

export const basePublicClient = createPublicClient({
  chain: baseAppChain,
  transport: http(baseRpcUrl),
});

import { QueryClient } from "@tanstack/react-query";
import { createConfig, http } from "wagmi";
import { coinbaseWallet, injected } from "wagmi/connectors";
import { base, baseSepolia } from "wagmi/chains";
import { baseAppChain, baseRpcUrl } from "@/lib/base/chain";

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected(),
    coinbaseWallet({
      appName: "agenttracemarketplace",
      preference: "smartWalletOnly",
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

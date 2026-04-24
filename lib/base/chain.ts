import { base, baseSepolia } from "wagmi/chains";

const network = process.env.NEXT_PUBLIC_BASE_NETWORK === "sepolia" ? "sepolia" : "mainnet";

export const baseAppChain = network === "sepolia" ? baseSepolia : base;
export const baseAppChainLabel = network === "sepolia" ? "Base Sepolia" : "Base Mainnet";
export const baseRpcUrl =
  process.env.NEXT_PUBLIC_BASE_RPC_URL ||
  (network === "sepolia" ? "https://sepolia.base.org" : "https://mainnet.base.org");

export function shortWalletAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

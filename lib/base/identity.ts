export type WalletSession = {
  walletAddress: string;
  issuedAt: string;
  sessionId: string;
};

export function parseWalletAddress(value: string) {
  const normalized = value.trim().toLowerCase();

  if (!/^0x[a-f0-9]{40}$/.test(normalized)) {
    throw new Error("Wallet address must be a 0x-prefixed 40-byte hex string.");
  }

  return normalized;
}

export function buildMockWalletSession(walletAddress: string): WalletSession {
  return {
    walletAddress: parseWalletAddress(walletAddress),
    issuedAt: new Date().toISOString(),
    sessionId: "mock-session",
  };
}

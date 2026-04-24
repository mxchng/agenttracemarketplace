"use client";

import { type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { baseQueryClient, wagmiConfig } from "@/lib/base/config";

type BaseProviderProps = {
  children: ReactNode;
};

export function BaseProvider({ children }: BaseProviderProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={baseQueryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

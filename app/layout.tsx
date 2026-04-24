import type { Metadata } from "next";
import { BaseProvider } from "@/components/providers/base-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "agenttracemarketplace",
  description: "Base-native marketplace for agent training traces.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <BaseProvider>{children}</BaseProvider>
      </body>
    </html>
  );
}

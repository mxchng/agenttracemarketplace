import { NextResponse } from "next/server";
import { buildAuthMessage, createNonceChallenge, setNonceChallengeCookie } from "@/lib/auth/session";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    walletAddress?: string;
    chainId?: number;
  };

  if (!body.walletAddress || typeof body.chainId !== "number") {
    return NextResponse.json(
      { error: "walletAddress and chainId are required." },
      { status: 400 },
    );
  }

  try {
    const url = new URL(request.url);
    const challenge = createNonceChallenge({
      walletAddress: body.walletAddress,
      chainId: body.chainId,
      domain: request.headers.get("host") ?? url.host,
      uri: url.origin,
    });

    await setNonceChallengeCookie(challenge);

    return NextResponse.json({
      message: buildAuthMessage(challenge),
      expiresAt: challenge.expiresAt,
    });
  } catch (error) {
    const detail =
      error instanceof Error ? error.message : "Nonce issuance failed unexpectedly.";

    return NextResponse.json({ error: detail }, { status: 400 });
  }
}

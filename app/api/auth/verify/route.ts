import { NextResponse } from "next/server";
import {
  buildAuthMessage,
  buildWalletSession,
  clearNonceChallengeCookie,
  parseWalletAddress,
  readNonceChallengeCookie,
  setWalletSessionCookie,
} from "@/lib/auth/session";
import { basePublicClient } from "@/lib/base/config";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    walletAddress?: string;
    message?: string;
    signature?: string;
  };

  if (!body.walletAddress || !body.message || !body.signature) {
    return NextResponse.json(
      { error: "walletAddress, message, and signature are required." },
      { status: 400 },
    );
  }

  try {
    const challenge = await readNonceChallengeCookie();

    if (!challenge) {
      return NextResponse.json(
        { error: "Sign-in challenge expired. Request a new nonce." },
        { status: 401 },
      );
    }

    const walletAddress = parseWalletAddress(body.walletAddress);
    const expectedMessage = buildAuthMessage(challenge);

    if (walletAddress !== challenge.walletAddress || body.message !== expectedMessage) {
      await clearNonceChallengeCookie();

      return NextResponse.json(
        { error: "Challenge did not match this wallet session." },
        { status: 401 },
      );
    }

    const isValidSignature = await basePublicClient.verifyMessage({
      address: walletAddress as `0x${string}`,
      message: body.message,
      signature: body.signature as `0x${string}`,
    });

    if (!isValidSignature) {
      return NextResponse.json({ error: "Signature verification failed." }, { status: 401 });
    }

    const user = await prisma.user.upsert({
      where: { walletAddress },
      update: {},
      create: { walletAddress },
    });

    await clearNonceChallengeCookie();
    await setWalletSessionCookie(
      buildWalletSession({ userId: user.id, walletAddress: user.walletAddress }),
    );

    return NextResponse.json({
      status: "signed-in",
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
      },
    });
  } catch (error) {
    const detail =
      error instanceof Error ? error.message : "Signature verification failed unexpectedly.";

    return NextResponse.json({ error: detail }, { status: 400 });
  }
}

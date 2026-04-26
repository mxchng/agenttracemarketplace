import { NextResponse } from "next/server";
import { clearNonceChallengeCookie, clearWalletSessionCookie } from "@/lib/auth/session";

export async function POST() {
  await clearNonceChallengeCookie();
  await clearWalletSessionCookie();

  return NextResponse.json({ status: "signed-out" });
}

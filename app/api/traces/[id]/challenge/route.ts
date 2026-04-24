import { NextResponse } from "next/server";
import { MockPaymentVerifier } from "@/lib/payment/mock-verifier";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: RouteProps) {
  const { id } = await params;
  const verifier = new MockPaymentVerifier();
  const challenge = await verifier.generateChallenge(id, "5.00");

  return NextResponse.json(challenge, { status: 402 });
}

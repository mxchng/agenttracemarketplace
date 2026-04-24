import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    nonce: "mock-nonce",
    message: "Scaffolded endpoint. Replace with nonce issuance and session bootstrap.",
  });
}

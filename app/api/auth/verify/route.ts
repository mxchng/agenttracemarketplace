import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    status: "not-implemented",
    detail: "Scaffolded endpoint. Replace with signed nonce verification and session creation.",
  });
}

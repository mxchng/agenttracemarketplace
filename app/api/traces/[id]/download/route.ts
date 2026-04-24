import { NextResponse } from "next/server";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: RouteProps) {
  const { id } = await params;

  return NextResponse.json({
    listingId: id,
    detail:
      "Scaffolded endpoint. Replace with access grant lookup and short-lived blob URL generation.",
  });
}

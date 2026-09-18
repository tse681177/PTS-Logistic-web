import { NextRequest, NextResponse } from "next/server";
import { INITIAL_ORDERS } from "@/lib/seed-data";
import { sanitizePublicOrder } from "@/lib/store";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code")?.trim().toUpperCase();

  if (!code) {
    return NextResponse.json({ success: false, error: "Захиалгын код шаардлагатай" }, { status: 400 });
  }

  const found = INITIAL_ORDERS.find((o) => o.order_code.toUpperCase() === code);
  if (!found) {
    return NextResponse.json({ success: false, error: "Захиалга олдсонгүй" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: sanitizePublicOrder(found) });
}

import { NextResponse } from "next/server";
import { INITIAL_ORDERS } from "@/lib/seed-data";
import { sanitizePublicOrder } from "@/lib/store";

export async function GET() {
  // Always return public scrubbed data
  const publicOrders = INITIAL_ORDERS.map(sanitizePublicOrder);
  return NextResponse.json({ success: true, data: publicOrders });
}

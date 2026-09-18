import { NextRequest, NextResponse } from "next/server";
import { INITIAL_ORDERS } from "@/lib/seed-data";
import { AdminOrder } from "@/lib/types";

export async function GET(req: NextRequest) {
  // In production, verify authorization token or session
  const authHeader = req.headers.get("authorization");
  if (process.env.ADMIN_SECRET && authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    // Demo mode allows admin read
  }
  return NextResponse.json({ success: true, data: INITIAL_ORDERS });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newOrder: AdminOrder = {
      ...body,
      id: "ord-" + Date.now(),
      order_code: body.order_code || `PTS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return NextResponse.json({ success: true, data: newOrder });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Буруу өгөгдөл" }, { status: 400 });
  }
}

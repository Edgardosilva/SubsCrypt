import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/utils/auth-helpers";
import { SubscriptionService } from "@/lib/services/subscription.service";

// GET /api/dashboard/stats?currency=CLP - Get dashboard statistics
export async function GET(request: Request) {
  const { session, error } = await getAuthSession();
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const currency = searchParams.get("currency") || "CLP";
    
    const stats = await SubscriptionService.getDashboardStats(session!.user!.id!, currency);
    return NextResponse.json(stats);
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

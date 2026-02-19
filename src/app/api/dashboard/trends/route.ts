import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { SubscriptionService } from "@/lib/services/subscription.service";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const currency = searchParams.get("currency") || "CLP";
    const period = searchParams.get("period") || "monthly";
    const months = parseInt(searchParams.get("months") || "6");
    const weeks = parseInt(searchParams.get("weeks") || "8");

    const trends = period === "weekly"
      ? await SubscriptionService.getWeeklySpendingTrends(session.user.id, currency, weeks)
      : await SubscriptionService.getSpendingTrends(session.user.id, currency, months);

    return NextResponse.json(trends);
  } catch (error) {
    console.error("Error fetching spending trends:", error);
    return NextResponse.json(
      { error: "Failed to fetch spending trends" },
      { status: 500 }
    );
  }
}

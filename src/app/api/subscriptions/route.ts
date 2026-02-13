import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/utils/auth-helpers";
import { SubscriptionService } from "@/lib/services/subscription.service";
import { createSubscriptionSchema } from "@/lib/validators/subscription";

// GET /api/subscriptions - Get all subscriptions for authenticated user
export async function GET() {
  const { session, error } = await getAuthSession();
  if (error) return error;

  try {
    const subscriptions = await SubscriptionService.getAll(session!.user!.id!);
    return NextResponse.json(subscriptions);
  } catch (err) {
    console.error("Error fetching subscriptions:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/subscriptions - Create a new subscription
export async function POST(req: NextRequest) {
  const { session, error } = await getAuthSession();
  if (error) return error;

  try {
    const body = await req.json();
    const validated = createSubscriptionSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const subscription = await SubscriptionService.create(session!.user!.id!, validated.data);
    return NextResponse.json(subscription, { status: 201 });
  } catch (err) {
    console.error("Error creating subscription:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

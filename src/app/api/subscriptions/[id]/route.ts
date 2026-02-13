import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/utils/auth-helpers";
import { SubscriptionService } from "@/lib/services/subscription.service";
import { updateSubscriptionSchema } from "@/lib/validators/subscription";

// GET /api/subscriptions/[id] - Get a single subscription
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await getAuthSession();
  if (error) return error;

  const { id } = await params;

  try {
    const subscription = await SubscriptionService.getById(id, session!.user!.id!);

    if (!subscription) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    return NextResponse.json(subscription);
  } catch (err) {
    console.error("Error fetching subscription:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/subscriptions/[id] - Update a subscription
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await getAuthSession();
  if (error) return error;

  const { id } = await params;

  try {
    const body = await req.json();
    const validated = updateSubscriptionSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const subscription = await SubscriptionService.update(id, session!.user!.id!, validated.data);

    if (!subscription) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    return NextResponse.json(subscription);
  } catch (err) {
    console.error("Error updating subscription:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/subscriptions/[id] - Delete a subscription
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await getAuthSession();
  if (error) return error;

  const { id } = await params;

  try {
    const deleted = await SubscriptionService.delete(id, session!.user!.id!);

    if (!deleted) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Subscription deleted" });
  } catch (err) {
    console.error("Error deleting subscription:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

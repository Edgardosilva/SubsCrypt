import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { markAsRead } from "@/lib/services/notification.service";

/**
 * PATCH /api/notifications/[id]
 * Marca una notificación específica como leída
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const notification = await markAsRead(params.id, session.user.id);

    return NextResponse.json({ notification });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json(
      { error: "Error al marcar notificación" },
      { status: 500 }
    );
  }
}

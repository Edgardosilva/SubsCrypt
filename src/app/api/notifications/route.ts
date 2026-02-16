import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getUserNotifications,
  getUnreadCount,
  markAllAsRead,
  generateAllNotifications,
} from "@/lib/services/notification.service";

/**
 * GET /api/notifications
 * Obtiene notificaciones del usuario
 * Query params:
 * - unreadOnly: boolean (opcional)
 * - generate: boolean (genera automáticamente antes de retornar)
 */
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get("unreadOnly") === "true";
    const shouldGenerate = searchParams.get("generate") === "true";

    // Generar notificaciones automáticamente si se solicita
    if (shouldGenerate) {
      await generateAllNotifications(session.user.id);
    }

    // Obtener notificaciones
    const notifications = await getUserNotifications(session.user.id, {
      unreadOnly,
      includeExpired: false,
    });

    // Obtener contador de no leídas
    const unreadCount = await getUnreadCount(session.user.id);

    return NextResponse.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Error al obtener notificaciones" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/notifications
 * Marca todas las notificaciones como leídas
 */
export async function PATCH() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    await markAllAsRead(session.user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking all as read:", error);
    return NextResponse.json(
      { error: "Error al marcar notificaciones" },
      { status: 500 }
    );
  }
}

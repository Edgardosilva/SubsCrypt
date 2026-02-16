import { prisma } from "@/lib/prisma";
import { NotificationType, Priority } from "@/generated/prisma";
import { formatCurrency } from "@/lib/utils";

/**
 * Calcula días hasta una fecha
 */
function daysUntilDate(date: Date | string): number {
  const target = new Date(date);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Crea una notificación en la base de datos
 */
export async function createNotification(data: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority?: Priority;
  actionUrl?: string;
  metadata?: any;
  expiresAt?: Date;
}) {
  return await prisma.notification.create({
    data: {
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      priority: data.priority || "LOW",
      actionUrl: data.actionUrl,
      metadata: data.metadata,
      expiresAt: data.expiresAt,
    },
  });
}

/**
 * Genera notificaciones de pagos próximos para un usuario
 * Busca suscripciones activas con pagos en los próximos 7 días
 */
export async function generatePaymentNotifications(userId: string) {
  const today = new Date();
  const in7Days = new Date(today);
  in7Days.setDate(today.getDate() + 7);

  // Obtener suscripciones activas con pagos próximos
  const subscriptions = await prisma.subscription.findMany({
    where: {
      userId,
      status: "ACTIVE",
      nextBilling: {
        gte: today,
        lte: in7Days,
      },
    },
  });

  const notifications = [];

  for (const sub of subscriptions) {
    if (!sub.nextBilling) continue;

    const daysUntil = daysUntilDate(sub.nextBilling);
    const formattedAmount = formatCurrency(Number(sub.price), sub.currency);

    // Verificar si ya existe una notificación para este pago
    const existingNotification = await prisma.notification.findFirst({
      where: {
        userId,
        type: daysUntil === 0 ? "URGENT_PAYMENT" : "UPCOMING_PAYMENT",
        metadata: {
          path: ["subscriptionId"],
          equals: sub.id,
        },
        createdAt: {
          gte: new Date(today.setHours(0, 0, 0, 0)),
        },
      },
    });

    // Si ya existe, no crear duplicado
    if (existingNotification) continue;

    // Pago hoy (urgente)
    if (daysUntil === 0) {
      const notification = await createNotification({
        userId,
        type: "URGENT_PAYMENT",
        title: `Pago hoy - ${sub.name}`,
        message: `Se cargará ${formattedAmount} hoy`,
        priority: "HIGH",
        actionUrl: `/subscriptions/${sub.id}`,
        metadata: {
          subscriptionId: sub.id,
          amount: Number(sub.price),
          currency: sub.currency,
        },
        expiresAt: sub.nextBilling,
      });
      notifications.push(notification);
    }
    // Pago en 1-7 días
    else if (daysUntil > 0 && daysUntil <= 7) {
      const dateText = sub.nextBilling.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
      });

      const notification = await createNotification({
        userId,
        type: "UPCOMING_PAYMENT",
        title: `Pago próximo - ${sub.name}`,
        message: `${formattedAmount} en ${daysUntil} ${daysUntil === 1 ? "día" : "días"} (${dateText})`,
        priority: daysUntil <= 3 ? "MEDIUM" : "LOW",
        actionUrl: `/subscriptions/${sub.id}`,
        metadata: {
          subscriptionId: sub.id,
          amount: Number(sub.price),
          currency: sub.currency,
          daysUntil,
        },
        expiresAt: sub.nextBilling,
      });
      notifications.push(notification);
    }
  }

  return notifications;
}

/**
 * Genera notificaciones para trials que están por terminar
 * Busca suscripciones en trial con menos de 3 días restantes
 */
export async function generateTrialEndingNotifications(userId: string) {
  const today = new Date();
  const in3Days = new Date(today);
  in3Days.setDate(today.getDate() + 3);

  // Obtener trials que terminan pronto
  const trials = await prisma.subscription.findMany({
    where: {
      userId,
      status: "TRIAL",
      nextBilling: {
        gte: today,
        lte: in3Days,
      },
    },
  });

  const notifications = [];

  for (const sub of trials) {
    if (!sub.nextBilling) continue;

    const daysUntil = daysUntilDate(sub.nextBilling);

    // Verificar si ya existe notificación
    const existingNotification = await prisma.notification.findFirst({
      where: {
        userId,
        type: "TRIAL_ENDING",
        metadata: {
          path: ["subscriptionId"],
          equals: sub.id,
        },
        createdAt: {
          gte: new Date(today.setHours(0, 0, 0, 0)),
        },
      },
    });

    if (existingNotification) continue;

    const formattedAmount = formatCurrency(Number(sub.price), sub.currency);
    const dateText = sub.nextBilling.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    });

    const notification = await createNotification({
      userId,
      type: "TRIAL_ENDING",
      title: `Trial termina ${daysUntil === 0 ? "hoy" : `en ${daysUntil} ${daysUntil === 1 ? "día" : "días"}`} - ${sub.name}`,
      message: `Se cobrará ${formattedAmount} el ${dateText}. Cancela si no lo necesitas`,
      priority: "HIGH",
      actionUrl: `/subscriptions/${sub.id}`,
      metadata: {
        subscriptionId: sub.id,
        amount: Number(sub.price),
        currency: sub.currency,
        daysUntil,
      },
      expiresAt: sub.nextBilling,
    });

    notifications.push(notification);
  }

  return notifications;
}

/**
 * Genera todas las notificaciones para un usuario
 */
export async function generateAllNotifications(userId: string) {
  const paymentNotifications = await generatePaymentNotifications(userId);
  const trialNotifications = await generateTrialEndingNotifications(userId);

  return {
    payments: paymentNotifications,
    trials: trialNotifications,
    total: paymentNotifications.length + trialNotifications.length,
  };
}

/**
 * Obtiene notificaciones de un usuario
 */
export async function getUserNotifications(userId: string, options?: {
  unreadOnly?: boolean;
  limit?: number;
  includeExpired?: boolean;
}) {
  const where: any = { userId };

  if (options?.unreadOnly) {
    where.read = false;
  }

  if (!options?.includeExpired) {
    where.OR = [
      { expiresAt: null },
      { expiresAt: { gte: new Date() } },
    ];
  }

  const notifications = await prisma.notification.findMany({
    where,
    orderBy: [
      { priority: "desc" }, // HIGH primero
      { createdAt: "desc" },
    ],
    take: options?.limit || 50,
  });

  return notifications;
}

/**
 * Cuenta notificaciones no leídas
 */
export async function getUnreadCount(userId: string): Promise<number> {
  return await prisma.notification.count({
    where: {
      userId,
      read: false,
      OR: [
        { expiresAt: null },
        { expiresAt: { gte: new Date() } },
      ],
    },
  });
}

/**
 * Marca notificación como leída
 */
export async function markAsRead(notificationId: string, userId: string) {
  return await prisma.notification.update({
    where: {
      id: notificationId,
      userId, // Seguridad: solo el dueño puede marcar como leída
    },
    data: {
      read: true,
    },
  });
}

/**
 * Marca todas las notificaciones como leídas
 */
export async function markAllAsRead(userId: string) {
  return await prisma.notification.updateMany({
    where: {
      userId,
      read: false,
    },
    data: {
      read: true,
    },
  });
}

/**
 * Elimina notificaciones expiradas
 * Útil para ejecutar como cron job
 */
export async function cleanupExpiredNotifications() {
  const result = await prisma.notification.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });

  return result.count;
}

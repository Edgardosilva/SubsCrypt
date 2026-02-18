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
 * Solo avisa el día anterior (mañana) y el día del cobro (hoy)
 */
export async function generatePaymentNotifications(userId: string) {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 2); // rango: hoy y mañana

  const subscriptions = await prisma.subscription.findMany({
    where: {
      userId,
      status: "ACTIVE",
      nextBilling: {
        gte: now,
        lte: tomorrow,
      },
    },
  });

  const notifications = [];

  for (const sub of subscriptions) {
    if (!sub.nextBilling) continue;

    const daysUntil = daysUntilDate(sub.nextBilling);

    // Solo notificar hoy (0) o mañana (1)
    if (daysUntil > 1) continue;

    const type = daysUntil === 0 ? "URGENT_PAYMENT" : "UPCOMING_PAYMENT";
    const formattedAmount = formatCurrency(Number(sub.price), sub.currency);

    // Deduplicación por ciclo: si ya existe una notificación para esta
    // suscripción con el mismo expiresAt (= nextBilling), no crear otra
    const existingNotification = await prisma.notification.findFirst({
      where: {
        userId,
        type,
        expiresAt: sub.nextBilling,
        metadata: {
          path: ["subscriptionId"],
          equals: sub.id,
        },
      },
    });

    if (existingNotification) continue;

    const notification = await createNotification({
      userId,
      type,
      title: daysUntil === 0
        ? `Pago hoy — ${sub.name}`
        : `Pago mañana — ${sub.name}`,
      message: daysUntil === 0
        ? `Se cargará ${formattedAmount} hoy`
        : `Se cargará ${formattedAmount} mañana`,
      priority: daysUntil === 0 ? "HIGH" : "MEDIUM",
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
 * Genera notificaciones para trials que están por terminar
 * Solo avisa el día anterior y el día en que termina
 */
export async function generateTrialEndingNotifications(userId: string) {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 2);

  const trials = await prisma.subscription.findMany({
    where: {
      userId,
      status: "TRIAL",
      nextBilling: {
        gte: now,
        lte: tomorrow,
      },
    },
  });

  const notifications = [];

  for (const sub of trials) {
    if (!sub.nextBilling) continue;

    const daysUntil = daysUntilDate(sub.nextBilling);
    if (daysUntil > 1) continue;

    // Deduplicación por ciclo usando expiresAt
    const existingNotification = await prisma.notification.findFirst({
      where: {
        userId,
        type: "TRIAL_ENDING",
        expiresAt: sub.nextBilling,
        metadata: {
          path: ["subscriptionId"],
          equals: sub.id,
        },
      },
    });

    if (existingNotification) continue;

    const formattedAmount = formatCurrency(Number(sub.price), sub.currency);

    const notification = await createNotification({
      userId,
      type: "TRIAL_ENDING",
      title: daysUntil === 0
        ? `Trial termina hoy — ${sub.name}`
        : `Trial termina mañana — ${sub.name}`,
      message: `Se cobrará ${formattedAmount} ${daysUntil === 0 ? "hoy" : "mañana"}. Cancela si no lo necesitas`,
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
 * Limpia notificaciones irrelevantes:
 * 1. Las de pagos ya realizados (expiresAt pasado)
 * 2. Las "lejanas" del sistema anterior (expiresAt > mañana),
 *    ya que el nuevo sistema solo genera notificaciones para hoy y mañana
 */
export async function cleanupPaidNotifications(userId: string) {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(23, 59, 59, 999);

  // Eliminar pagadas/expiradas
  await prisma.notification.deleteMany({
    where: {
      userId,
      type: { in: ["UPCOMING_PAYMENT", "URGENT_PAYMENT", "TRIAL_ENDING"] },
      expiresAt: { lt: now },
    },
  });

  // Eliminar notificaciones de más de 1 día de distancia (backlog del sistema antiguo)
  return await prisma.notification.deleteMany({
    where: {
      userId,
      type: { in: ["UPCOMING_PAYMENT", "TRIAL_ENDING"] },
      expiresAt: { gt: tomorrow },
    },
  });
}

/**
 * Genera todas las notificaciones para un usuario
 */
export async function generateAllNotifications(userId: string) {
  // Primero limpiar las de pagos ya realizados
  await cleanupPaidNotifications(userId);

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
    // Ordenar por fecha de pago más próxima (expiresAt = nextBilling)
    // Las que no tienen fecha de expiración van al final
    orderBy: [
      { expiresAt: "asc" },
      { priority: "desc" },
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

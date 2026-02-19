import { prisma } from "@/lib/prisma";
import { CreateSubscriptionInput, UpdateSubscriptionInput } from "@/lib/validators/subscription";
import { Prisma } from "@/generated/prisma";
import { convertCurrency } from "@/lib/utils/currency";

export class SubscriptionService {
  static async getAll(userId: string) {
    return prisma.subscription.findMany({
      where: { userId },
      orderBy: { nextBilling: "asc" },
    });
  }

  static async getById(id: string, userId: string) {
    return prisma.subscription.findFirst({
      where: { id, userId },
      include: { payments: { orderBy: { paidAt: "desc" }, take: 10 } },
    });
  }

  static async create(userId: string, data: CreateSubscriptionInput) {
    const nextBilling = data.nextBilling ?? this.calculateNextBilling(data.billingDay, data.cycle);

    return prisma.subscription.create({
      data: {
        userId,
        name: data.name,
        description: data.description,
        logo: data.logo || null,
        url: data.url || null,
        price: new Prisma.Decimal(data.price),
        currency: data.currency,
        cycle: data.cycle,
        billingDay: data.billingDay,
        nextBilling,
        startDate: data.startDate ?? new Date(),
        category: data.category,
        status: data.status,
        color: data.color,
        notes: data.notes,
      },
    });
  }

  static async update(id: string, userId: string, data: UpdateSubscriptionInput) {
    const existing = await prisma.subscription.findFirst({
      where: { id, userId },
    });

    if (!existing) return null;

    return prisma.subscription.update({
      where: { id },
      data: {
        ...data,
        price: data.price !== undefined ? new Prisma.Decimal(data.price) : undefined,
        logo: data.logo === "" ? null : data.logo,
        url: data.url === "" ? null : data.url,
      },
    });
  }

  static async delete(id: string, userId: string) {
    const existing = await prisma.subscription.findFirst({
      where: { id, userId },
    });

    if (!existing) return null;

    return prisma.subscription.delete({ where: { id } });
  }

  static async getDashboardStats(userId: string, displayCurrency: string = "CLP") {
    const subscriptions = await prisma.subscription.findMany({
      where: { userId, status: "ACTIVE" },
    });

    const monthlyTotal = subscriptions.reduce((total, sub) => {
      const price = Number(sub.price);
      // Convertir el precio a la moneda de visualización
      const convertedPrice = convertCurrency(price, sub.currency, displayCurrency);
      
      switch (sub.cycle) {
        case "WEEKLY":
          return total + convertedPrice * 4.33;
        case "MONTHLY":
          return total + convertedPrice;
        case "QUARTERLY":
          return total + convertedPrice / 3;
        case "SEMI_ANNUAL":
          return total + convertedPrice / 6;
        case "ANNUAL":
          return total + convertedPrice / 12;
        default:
          return total + convertedPrice;
      }
    }, 0);

    const annualTotal = monthlyTotal * 12;

    const upcomingBills = await prisma.subscription.findMany({
      where: {
        userId,
        status: "ACTIVE",
        nextBilling: {
          gte: new Date(),
          lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      },
      orderBy: { nextBilling: "asc" },
      take: 5,
    });

    const byCategory = subscriptions.reduce(
      (acc, sub) => {
        const category = sub.category;
        if (!acc[category]) acc[category] = { count: 0, total: 0 };
        acc[category].count++;
        // Convertir el precio a la moneda de visualización para el total por categoría
        const convertedPrice = convertCurrency(Number(sub.price), sub.currency, displayCurrency);
        acc[category].total += convertedPrice;
        return acc;
      },
      {} as Record<string, { count: number; total: number }>
    );

    return {
      totalActive: subscriptions.length,
      monthlyTotal: Math.round(monthlyTotal * 100) / 100,
      annualTotal: Math.round(annualTotal * 100) / 100,
      upcomingBills,
      byCategory,
      displayCurrency, // Incluir la moneda de visualización en la respuesta
    };
  }

  static async getSpendingTrends(userId: string, displayCurrency: string = "CLP", months: number = 6) {
    const trends = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonthDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      // Obtener suscripciones que estaban activas en ese mes
      const subscriptions = await prisma.subscription.findMany({
        where: {
          userId,
          status: "ACTIVE",
          startDate: { lte: nextMonthDate },
          // Opcional: filtrar por fecha de cancelación si la agregas
        },
      });

      // Calcular el gasto mensual de ese período
      const monthlyTotal = subscriptions.reduce((total, sub) => {
        const price = Number(sub.price);
        const convertedPrice = convertCurrency(price, sub.currency, displayCurrency);

        switch (sub.cycle) {
          case "WEEKLY":
            return total + convertedPrice * 4.33;
          case "MONTHLY":
            return total + convertedPrice;
          case "QUARTERLY":
            return total + convertedPrice / 3;
          case "SEMI_ANNUAL":
            return total + convertedPrice / 6;
          case "ANNUAL":
            return total + convertedPrice / 12;
          default:
            return total + convertedPrice;
        }
      }, 0);

      trends.push({
        month: monthDate.toLocaleDateString('es-CL', { month: 'short', year: 'numeric' }),
        monthFull: monthDate.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' }),
        total: Math.round(monthlyTotal * 100) / 100,
        count: subscriptions.length,
      });
    }

    return {
      trends,
      displayCurrency,
    };
  }

  static async getWeeklySpendingTrends(userId: string, displayCurrency: string = "CLP", weeks: number = 8) {
    const trends = [];
    const now = new Date();

    // Empezar desde el lunes de la semana actual
    const startOfCurrentWeek = new Date(now);
    const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1; // lunes = 0
    startOfCurrentWeek.setDate(now.getDate() - dayOfWeek);
    startOfCurrentWeek.setHours(0, 0, 0, 0);

    for (let i = weeks - 1; i >= 0; i--) {
      const weekStart = new Date(startOfCurrentWeek);
      weekStart.setDate(startOfCurrentWeek.getDate() - i * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);

      const subscriptions = await prisma.subscription.findMany({
        where: {
          userId,
          status: "ACTIVE",
          startDate: { lte: weekEnd },
        },
      });

      // Gasto semanal equivalente
      const weeklyTotal = subscriptions.reduce((total, sub) => {
        const price = Number(sub.price);
        const convertedPrice = convertCurrency(price, sub.currency, displayCurrency);

        switch (sub.cycle) {
          case "WEEKLY":
            return total + convertedPrice;
          case "MONTHLY":
            return total + convertedPrice / 4.33;
          case "QUARTERLY":
            return total + convertedPrice / (4.33 * 3);
          case "SEMI_ANNUAL":
            return total + convertedPrice / (4.33 * 6);
          case "ANNUAL":
            return total + convertedPrice / (4.33 * 12);
          default:
            return total + convertedPrice / 4.33;
        }
      }, 0);

      const weekLabel = weekStart.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });
      const weekLabelFull = `Semana del ${weekStart.toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })} al ${new Date(weekEnd.getTime() - 1).toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })}`;

      trends.push({
        month: weekLabel,
        monthFull: weekLabelFull,
        total: Math.round(weeklyTotal * 100) / 100,
        count: subscriptions.length,
      });
    }

    return {
      trends,
      displayCurrency,
    };
  }

  private static calculateNextBilling(
    billingDay: number,
    cycle: string
  ): Date {
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth(), billingDay);

    if (next <= now) {
      switch (cycle) {
        case "WEEKLY":
          next.setDate(next.getDate() + 7);
          break;
        case "MONTHLY":
          next.setMonth(next.getMonth() + 1);
          break;
        case "QUARTERLY":
          next.setMonth(next.getMonth() + 3);
          break;
        case "SEMI_ANNUAL":
          next.setMonth(next.getMonth() + 6);
          break;
        case "ANNUAL":
          next.setFullYear(next.getFullYear() + 1);
          break;
      }
    }

    return next;
  }
}

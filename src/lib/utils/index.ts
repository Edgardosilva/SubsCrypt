import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "CLP"): string {
  // Para CLP, mostrar el número con separadores de miles y "CLP" al final
  if (currency === "CLP") {
    const formatted = new Intl.NumberFormat("es-CL", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
    return `${formatted} CLP`;
  }
  
  // Para USD, mostrar con el símbolo $
  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }
  
  // Para otras monedas, usar el formato estándar
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * Separa un monto formateado en parte principal y decimales
 * Usado para mostrar el precio hero con decimales más pequeños
 */
export function formatCurrencyParts(amount: number, currency: string = "CLP"): { symbol: string; main: string; decimals: string } {
  if (currency === "CLP") {
    const formatted = new Intl.NumberFormat("es-CL", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.round(amount));
    return { symbol: "", main: formatted, decimals: "CLP" };
  }
  
  if (currency === "USD") {
    const parts = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount).split(".");
    return { symbol: "$", main: parts[0], decimals: `.${parts[1]}` };
  }

  const formatted = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency,
  }).format(amount);
  return { symbol: "", main: formatted, decimals: "" };
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function daysUntil(date: Date | string): number {
  const target = new Date(date);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

"use client";

import { useEffect, useState } from "react";
import { formatCurrencyParts } from "@/lib/utils";

export type ViewMode = "monthly" | "yearly";

export interface DashboardStats {
  totalActive: number;
  monthlyTotal: number;
  annualTotal: number;
  upcomingBills: Array<{
    id: string;
    name: string;
    price: string;
    currency: string;
    nextBilling: string;
    logo: string | null;
  }>;
  byCategory: Record<string, { count: number; total: number }>;
  displayCurrency: string;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState("CLP");
  const [viewMode, setViewMode] = useState<ViewMode>("monthly");
  const [currencyOpen, setCurrencyOpen] = useState(false);

  // Restaurar moneda guardada
  useEffect(() => {
    const savedCurrency = localStorage.getItem("dashboardCurrency");
    if (savedCurrency) setSelectedCurrency(savedCurrency);
  }, []);

  // Fetch stats al cambiar moneda
  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const res = await fetch(`/api/dashboard/stats?currency=${selectedCurrency}`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [selectedCurrency]);

  const handleCurrencySelect = (currency: string) => {
    setSelectedCurrency(currency);
    localStorage.setItem("dashboardCurrency", currency);
    setCurrencyOpen(false);
  };

  const displayAmount =
    viewMode === "monthly"
      ? stats?.monthlyTotal ?? 0
      : stats?.annualTotal ?? 0;

  const priceParts = formatCurrencyParts(displayAmount, selectedCurrency);

  return {
    stats,
    loading,
    selectedCurrency,
    viewMode,
    setViewMode,
    currencyOpen,
    setCurrencyOpen,
    handleCurrencySelect,
    displayAmount,
    priceParts,
  };
}

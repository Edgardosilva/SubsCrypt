"use client";

import { useEffect, useState } from "react";

export type TrendPeriod = "monthly" | "weekly";

export interface SpendingTrend {
  month: string;
  monthFull: string;
  total: number;
  count: number;
}

export interface TrendsData {
  trends: SpendingTrend[];
  displayCurrency: string;
}

export function useTrends(selectedCurrency: string) {
  const [trends, setTrends] = useState<TrendsData | null>(null);
  const [trendPeriod, setTrendPeriod] = useState<TrendPeriod>("monthly");

  useEffect(() => {
    async function fetchTrends() {
      try {
        const res = await fetch(
          `/api/dashboard/trends?currency=${selectedCurrency}&period=${trendPeriod}`
        );
        if (res.ok) {
          const data = await res.json();
          setTrends(data);
        }
      } catch (error) {
        console.error("Failed to fetch spending trends:", error);
      }
    }
    fetchTrends();
  }, [trendPeriod, selectedCurrency]);

  return {
    trends,
    trendPeriod,
    setTrendPeriod,
  };
}

"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useDashboardStore } from "@/lib/store/useDashboardStore";
import { HeroSection } from "@/components/dashboard/HeroSection";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { Calendar } from "@/components/dashboard/Calendar";
import { UpcomingBills } from "@/components/dashboard/UpcomingBills";
import { CategoryChart } from "@/components/dashboard/CategoryChart";

export default function DashboardPage() {
  const { data: session } = useSession();
  const statsLoading = useDashboardStore((state) => state.statsLoading);
  const initializeCurrency = useDashboardStore((state) => state.initializeCurrency);
  const fetchStats = useDashboardStore((state) => state.fetchStats);
  const fetchTrends = useDashboardStore((state) => state.fetchTrends);

  // Initialize currency from localStorage and fetch data on mount
  useEffect(() => {
    initializeCurrency();
    fetchStats();
    fetchTrends();
  }, [initializeCurrency, fetchStats, fetchTrends]);

  if (statsLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-500/20 border-t-indigo-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold tracking-tight text-white">
          Hola{session?.user?.name ? `, ${session.user.name}` : ""}
        </h1>
        <p className="mt-1 text-sm text-white/40">Gestiona tus suscripciones en un solo lugar</p>
      </div>
      <HeroSection />
      <div className="grid gap-6 lg:grid-cols-2 min-h-[400px]">
        <TrendChart />
        <Calendar />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <UpcomingBills />
        <CategoryChart />
      </div>
    </div>
  );
}

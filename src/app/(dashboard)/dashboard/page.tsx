"use client";

import { useSession } from "next-auth/react";
import { useDashboardStats } from "@/lib/hooks/useDashboardStats";
import { useTrends } from "@/lib/hooks/useTrends";
import { HeroSection } from "@/components/dashboard/HeroSection";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { Calendar } from "@/components/dashboard/Calendar";
import { UpcomingBills } from "@/components/dashboard/UpcomingBills";
import { CategoryChart } from "@/components/dashboard/CategoryChart";

export default function DashboardPage() {
  const { data: session } = useSession();
  const {
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
  } = useDashboardStats();
  const { trends, trendPeriod, setTrendPeriod } = useTrends(selectedCurrency);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">
          Hola{session?.user?.name ? `, ${session.user.name}` : ""}
        </h1>
        <p className="mt-1 text-white/60">Gestiona tus suscripciones en un solo lugar</p>
      </div>

      {/* Hero Section - Total Spending */}
      <HeroSection
        selectedCurrency={selectedCurrency}
        viewMode={viewMode}
        setViewMode={setViewMode}
        currencyOpen={currencyOpen}
        setCurrencyOpen={setCurrencyOpen}
        handleCurrencySelect={handleCurrencySelect}
        priceParts={priceParts}
        totalActive={stats?.totalActive ?? 0}
        categoriesCount={Object.keys(stats?.byCategory ?? {}).length}
        upcomingBillsCount={stats?.upcomingBills?.length ?? 0}
        annualTotal={stats?.annualTotal ?? 0}
      />
      
      {trends?.trends && trends.trends.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2 min-h-[400px]">
          <TrendChart
            trends={trends}
            trendPeriod={trendPeriod}
            setTrendPeriod={setTrendPeriod}
            selectedCurrency={selectedCurrency}
          />
          <Calendar stats={stats} />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <UpcomingBills stats={stats} />
        <CategoryChart stats={stats} viewMode={viewMode} selectedCurrency={selectedCurrency} />
      </div>
    </div>
  );
}

import { create } from "zustand";
import { formatCurrencyParts } from "@/lib/utils";

export type ViewMode = "monthly" | "yearly";
export type TrendPeriod = "monthly" | "weekly";

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

interface DashboardState {
  // Stats state
  stats: DashboardStats | null;
  statsLoading: boolean;

  // Currency & View
  selectedCurrency: string;
  viewMode: ViewMode;
  currencyOpen: boolean;

  // Trends state
  trends: TrendsData | null;
  trendPeriod: TrendPeriod;

  // Computed values
  displayAmount: number;
  priceParts: ReturnType<typeof formatCurrencyParts>;

  // Actions
  setSelectedCurrency: (currency: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setCurrencyOpen: (open: boolean) => void;
  setTrendPeriod: (period: TrendPeriod) => void;
  handleCurrencySelect: (currency: string) => void;
  fetchStats: () => Promise<void>;
  fetchTrends: () => Promise<void>;
  initializeCurrency: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  // Initial state
  stats: null,
  statsLoading: true,
  selectedCurrency: "CLP",
  viewMode: "monthly",
  currencyOpen: false,
  trends: null,
  trendPeriod: "monthly",
  displayAmount: 0,
  priceParts: { symbol: "$", main: "0", decimals: ".00" },

  // Actions
  initializeCurrency: () => {
    if (typeof window !== "undefined") {
      const savedCurrency = localStorage.getItem("dashboardCurrency");
      if (savedCurrency) {
        set({ selectedCurrency: savedCurrency });
      }
    }
  },

  setSelectedCurrency: (currency: string) => {
    set({ selectedCurrency: currency });
  },

  setViewMode: (mode: ViewMode) => {
    set((state) => {
      const displayAmount =
        mode === "monthly"
          ? state.stats?.monthlyTotal ?? 0
          : state.stats?.annualTotal ?? 0;
      const priceParts = formatCurrencyParts(displayAmount, state.selectedCurrency);
      return { viewMode: mode, displayAmount, priceParts };
    });
  },

  setCurrencyOpen: (open: boolean) => {
    set({ currencyOpen: open });
  },

  setTrendPeriod: (period: TrendPeriod) => {
    set({ trendPeriod: period });
    get().fetchTrends();
  },

  handleCurrencySelect: (currency: string) => {
    set({ selectedCurrency: currency, currencyOpen: false });
    if (typeof window !== "undefined") {
      localStorage.setItem("dashboardCurrency", currency);
    }
    get().fetchStats();
    get().fetchTrends();
  },

  fetchStats: async () => {
    const { selectedCurrency, viewMode } = get();
    set({ statsLoading: true });
    try {
      const res = await fetch(`/api/dashboard/stats?currency=${selectedCurrency}`);
      if (res.ok) {
        const data: DashboardStats = await res.json();
        const displayAmount =
          viewMode === "monthly" ? data.monthlyTotal : data.annualTotal;
        const priceParts = formatCurrencyParts(displayAmount, selectedCurrency);
        set({ stats: data, displayAmount, priceParts });
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      set({ statsLoading: false });
    }
  },

  fetchTrends: async () => {
    const { selectedCurrency, trendPeriod } = get();
    try {
      const res = await fetch(
        `/api/dashboard/trends?currency=${selectedCurrency}&period=${trendPeriod}`
      );
      if (res.ok) {
        const data: TrendsData = await res.json();
        set({ trends: data });
      }
    } catch (error) {
      console.error("Failed to fetch spending trends:", error);
    }
  },
}));

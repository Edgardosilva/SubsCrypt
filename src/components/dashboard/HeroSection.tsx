import { ChevronDown } from "lucide-react";
import { SUPPORTED_CURRENCIES } from "@/lib/utils/currency";
import { formatCurrency } from "@/lib/utils";
import type { ViewMode } from "@/lib/hooks/useDashboardStats";

interface HeroSectionProps {
  selectedCurrency: string;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  currencyOpen: boolean;
  setCurrencyOpen: (open: boolean) => void;
  handleCurrencySelect: (currency: string) => void;
  priceParts: {
    symbol: string;
    main: string;
    decimals: string;
  };
  totalActive: number;
  categoriesCount: number;
  upcomingBillsCount: number;
  annualTotal: number;
}

export function HeroSection({
  selectedCurrency,
  viewMode,
  setViewMode,
  currencyOpen,
  setCurrencyOpen,
  handleCurrencySelect,
  priceParts,
  totalActive,
  categoriesCount,
  upcomingBillsCount,
  annualTotal,
}: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 px-6 py-10 sm:px-10 sm:py-14">
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-0 h-56 w-56 rounded-full bg-purple-500/10 blur-3xl" />

      {/* Currency Selector - Top Right */}
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <div className="relative">
          <button
            onClick={() => setCurrencyOpen(!currencyOpen)}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white"
          >
            <span className="text-xs uppercase tracking-wider text-white/50">Moneda</span>
            <span className="font-semibold text-white">{selectedCurrency}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${currencyOpen ? "rotate-180" : ""}`} />
          </button>
          {currencyOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setCurrencyOpen(false)} />
              <div className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-xl border border-white/10 bg-slate-800 py-1 shadow-2xl backdrop-blur-xl">
                {SUPPORTED_CURRENCIES.map((currency) => (
                  <button
                    key={currency.value}
                    onClick={() => handleCurrencySelect(currency.value)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      selectedCurrency === currency.value
                        ? "bg-indigo-500/20 text-indigo-300"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span className="font-medium">{currency.value}</span>
                    <span className="text-white/40">{currency.label.replace(`${currency.value} `, "")}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Amount */}
      <div className="relative flex flex-col items-center text-center">
        <div className="flex items-baseline justify-center">
          <span className="text-3xl font-light text-white/70 sm:text-4xl">{priceParts.symbol}</span>
          <span className="text-6xl font-extralight tracking-tight text-white sm:text-8xl">
            {priceParts.main}
          </span>
          <span className="ml-1 text-2xl font-light text-white/50 sm:text-3xl">{priceParts.decimals}</span>
        </div>
        <p className="mt-3 text-xs font-medium uppercase tracking-[0.25em] text-white/40">
          {viewMode === "monthly" ? "Gasto Mensual Total" : "Gasto Anual Total"}
        </p>
      </div>

      {/* Toggle Buttons */}
      <div className="mt-8 flex items-center justify-center gap-3">
        <div className="flex rounded-full border border-white/10 bg-white/5 p-1">
          <button
            onClick={() => setViewMode("monthly")}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
              viewMode === "monthly"
                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            Mensual
          </button>
          <button
            onClick={() => setViewMode("yearly")}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
              viewMode === "yearly"
                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            Anual
          </button>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-center backdrop-blur-sm">
          <p className="text-2xl font-semibold text-white">{totalActive}</p>
          <p className="mt-0.5 text-xs text-white/40">Activas</p>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-center backdrop-blur-sm">
          <p className="text-2xl font-semibold text-white">{categoriesCount}</p>
          <p className="mt-0.5 text-xs text-white/40">Categorías</p>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-center backdrop-blur-sm">
          <p className="text-2xl font-semibold text-white">{upcomingBillsCount}</p>
          <p className="mt-0.5 text-xs text-white/40">Próximos pagos</p>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-center backdrop-blur-sm">
          <p className="text-2xl font-semibold text-emerald-400">
            {formatCurrency(annualTotal / 365, selectedCurrency)}
          </p>
          <p className="mt-0.5 text-xs text-white/40">Por día</p>
        </div>
      </div>
    </div>
  );
}

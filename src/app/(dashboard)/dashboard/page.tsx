"use client";

import { useEffect, useState } from "react";
import { formatCurrency, formatCurrencyParts, formatDate, daysUntil } from "@/lib/utils";
import {
  CreditCard,
  TrendingUp,
  ChevronDown,
  ArrowUpRight,
  Receipt,
  Calendar,
  PieChart as PieChartIcon,
  TrendingDown,
} from "lucide-react";
import { SUPPORTED_CURRENCIES } from "@/lib/utils/currency";
import { findKnownLogo } from "@/lib/utils/logos";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

type ViewMode = "monthly" | "yearly";

interface DashboardStats {
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

interface SpendingTrend {
  month: string;
  monthFull: string;
  total: number;
  count: number;
}

interface TrendsData {
  trends: SpendingTrend[];
  displayCurrency: string;
}

// Colores por categoría
const categoryColors: Record<string, string> = {
  STREAMING: "bg-purple-500",
  GAMING: "bg-red-500",
  MUSIC: "bg-pink-500",
  PRODUCTIVITY: "bg-blue-500",
  CLOUD_STORAGE: "bg-cyan-500",
  EDUCATION: "bg-yellow-500",
  FITNESS: "bg-green-500",
  NEWS: "bg-orange-500",
  SOFTWARE: "bg-indigo-500",
  OTHER: "bg-gray-500",
};

// Colores hex para el gráfico circular
const categoryChartColors: Record<string, string> = {
  STREAMING: "#a855f7",
  GAMING: "#ef4444",
  MUSIC: "#ec4899",
  PRODUCTIVITY: "#3b82f6",
  CLOUD_STORAGE: "#06b6d4",
  EDUCATION: "#eab308",
  FITNESS: "#22c55e",
  NEWS: "#f97316",
  SOFTWARE: "#6366f1",
  OTHER: "#6b7280",
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trends, setTrends] = useState<TrendsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState("CLP");
  const [viewMode, setViewMode] = useState<ViewMode>("monthly");
  const [currencyOpen, setCurrencyOpen] = useState(false);

  useEffect(() => {
    const savedCurrency = localStorage.getItem("dashboardCurrency");
    if (savedCurrency) setSelectedCurrency(savedCurrency);
  }, []);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const [statsRes, trendsRes] = await Promise.all([
          fetch(`/api/dashboard/stats?currency=${selectedCurrency}`),
          fetch(`/api/dashboard/trends?currency=${selectedCurrency}&months=6`),
        ]);
        
        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats(data);
        }
        
        if (trendsRes.ok) {
          const trendsData = await trendsRes.json();
          setTrends(trendsData);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section - Total Spending */}
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
            <p className="text-2xl font-semibold text-white">{stats?.totalActive ?? 0}</p>
            <p className="mt-0.5 text-xs text-white/40">Activas</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-center backdrop-blur-sm">
            <p className="text-2xl font-semibold text-white">{Object.keys(stats?.byCategory ?? {}).length}</p>
            <p className="mt-0.5 text-xs text-white/40">Categorías</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-center backdrop-blur-sm">
            <p className="text-2xl font-semibold text-white">{stats?.upcomingBills?.length ?? 0}</p>
            <p className="mt-0.5 text-xs text-white/40">Próximos pagos</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-center backdrop-blur-sm">
            <p className="text-2xl font-semibold text-emerald-400">
              {formatCurrency(
                (stats?.annualTotal ?? 0) / 365,
                selectedCurrency
              )}
            </p>
            <p className="mt-0.5 text-xs text-white/40">Por día</p>
          </div>
        </div>
      </div>

      {/* Spending Trends & Calendar */}
      {trends?.trends && trends.trends.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Tendencia de Gastos */}
          <div className="rounded-2xl border border-white/5 bg-slate-900 p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Tendencia de Gastos</h3>
                <p className="text-xs text-white/40">Últimos 6 meses de historial</p>
              </div>
            </div>
            <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends.trends} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="month" 
                  stroke="rgba(255,255,255,0.4)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.4)"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => formatCurrency(value, selectedCurrency)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "2px solid rgba(99, 102, 241, 0.3)",
                    borderRadius: "0.75rem",
                    color: "#ffffff",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
                    padding: "12px 16px",
                  }}
                  labelStyle={{ 
                    color: "#ffffff", 
                    marginBottom: "8px",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                  itemStyle={{
                    color: "#e2e8f0",
                    fontSize: "13px",
                  }}
                  formatter={(value, _name, props) => [
                    formatCurrency(Number(value), selectedCurrency),
                    `${props.payload.count} ${props.payload.count === 1 ? "suscripción" : "suscripciones"}`,
                  ]}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      return payload[0].payload.monthFull;
                    }
                    return label;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  dot={{ fill: "#6366f1", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: "#818cf8" }}
                  fill="url(#colorTotal)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {/* Trend Insight */}
          {trends.trends.length >= 2 && (
            <div className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-white/5 bg-white/5 px-4 py-2">
              {(() => {
                const lastMonth = trends.trends[trends.trends.length - 1].total;
                const prevMonth = trends.trends[trends.trends.length - 2].total;
                
                // Manejo de casos especiales
                if (prevMonth === 0 && lastMonth === 0) {
                  return (
                    <span className="text-sm text-white/60">
                      Sin gastos
                    </span>
                  );
                }
                
                if (prevMonth === 0) {
                  return (
                    <>
                      <TrendingUp className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-white/60">
                        Nuevo gasto este mes
                      </span>
                    </>
                  );
                }
                
                const change = ((lastMonth - prevMonth) / prevMonth) * 100;
                const isIncrease = change > 0;
                return (
                  <>
                    {isIncrease ? (
                      <TrendingUp className="h-4 w-4 text-red-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-green-400" />
                    )}
                    <span className={`text-sm font-medium ${isIncrease ? "text-red-400" : "text-green-400"}`}>
                      {isIncrease ? "+" : ""}{change.toFixed(1)}%
                    </span>
                    <span className="text-sm text-white/60">
                      vs mes anterior
                    </span>
                  </>
                );
              })()}
            </div>
          )}
          </div>

          {/* Calendario de Cobros */}
          <div className="rounded-2xl border border-white/5 bg-slate-900 p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white capitalize">
                  {new Date().toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
                </h3>
                <p className="text-xs text-white/40">Días de cobro programados</p>
              </div>
            </div>
            
            {/* Calendar Grid */}
            <div>
              {/* Days of week header */}
              <div className="mb-2 grid grid-cols-7 gap-1">
                {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-white/40 py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1">
                {(() => {
                  const today = new Date();
                  const year = today.getFullYear();
                  const month = today.getMonth();
                  const firstDay = new Date(year, month, 1);
                  const lastDay = new Date(year, month + 1, 0);
                  const daysInMonth = lastDay.getDate();
                  const startingDayOfWeek = firstDay.getDay();
                  
                  // Agrupar cobros por día
                  const billsByDay: Record<number, typeof stats.upcomingBills> = {};
                  stats?.upcomingBills?.forEach((bill) => {
                    const billDate = new Date(bill.nextBilling);
                    if (billDate.getMonth() === month && billDate.getFullYear() === year) {
                      const day = billDate.getDate();
                      if (!billsByDay[day]) billsByDay[day] = [];
                      billsByDay[day].push(bill);
                    }
                  });
                  
                  const cells = [];
                  
                  // Empty cells before first day
                  for (let i = 0; i < startingDayOfWeek; i++) {
                    cells.push(
                      <div key={`empty-${i}`} className="aspect-square" />
                    );
                  }
                  
                  // Days of month
                  for (let day = 1; day <= daysInMonth; day++) {
                    const isToday = day === today.getDate();
                    const hasBills = billsByDay[day] && billsByDay[day].length > 0;
                    const bills = billsByDay[day] || [];
                    
                    cells.push(
                      <div
                        key={day}
                        className={`
                          aspect-square relative flex flex-col items-center justify-center rounded-lg text-sm
                          ${isToday 
                            ? "bg-indigo-500 text-white font-bold ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-900" 
                            : hasBills 
                              ? "bg-red-500/20 text-white font-semibold border border-red-500/50" 
                              : "text-white/60 hover:bg-white/5"
                          }
                        `}
                        title={hasBills ? bills.map(b => b.name).join(", ") : undefined}
                      >
                        <span className="text-xs">{day}</span>
                        {hasBills && !isToday && (
                          <div className="absolute bottom-1 flex gap-0.5">
                            {bills.slice(0, 3).map((_, idx) => (
                              <div key={idx} className="h-1 w-1 rounded-full bg-red-400" />
                            ))}
                          </div>
                        )}
                        {hasBills && isToday && (
                          <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold">
                            {bills.length}
                          </div>
                        )}
                      </div>
                    );
                  }
                  
                  return cells;
                })()}
              </div>
              
              {/* Legend */}
              <div className="mt-4 flex items-center justify-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-indigo-500 ring-2 ring-indigo-400" />
                  <span className="text-white/60">Hoy</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-red-500/20 border border-red-500/50" />
                  <span className="text-white/60">Día de cobro</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Bills */}
        <div className="rounded-2xl border border-white/5 bg-slate-900 p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Próximos Pagos</h3>
              <p className="text-xs text-white/40">Próximos 30 días</p>
            </div>
          </div>
          {stats?.upcomingBills && stats.upcomingBills.length > 0 ? (
            <div className="space-y-2">
              {stats.upcomingBills.map((bill) => {
                const days = daysUntil(bill.nextBilling);
                const logoUrl = bill.logo || findKnownLogo(bill.name);
                return (
                  <div
                    key={bill.id}
                    className="group flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4 transition-all hover:border-white/10 hover:bg-white/[0.07]"
                  >
                    <div className="flex items-center gap-3">
                      {logoUrl ? (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 p-1.5">
                          <img
                            src={logoUrl}
                            alt={bill.name}
                            className="h-full w-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.parentElement!.innerHTML = `<span class="text-xs font-bold text-white">${bill.name.substring(0, 2).toUpperCase()}</span>`;
                            }}
                          />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white">
                          {bill.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-white">{bill.name}</p>
                        <p className="text-xs text-white/40">
                          {formatDate(bill.nextBilling)}
                          <span className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            days <= 3
                              ? "bg-red-500/10 text-red-400"
                              : days <= 7
                                ? "bg-amber-500/10 text-amber-400"
                                : "bg-white/5 text-white/50"
                          }`}>
                            {days === 0 ? "Hoy" : days === 1 ? "Mañana" : `${days} días`}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">
                        {formatCurrency(Number(bill.price), bill.currency)}
                      </p>
                      <p className="text-[10px] uppercase text-white/30">{bill.currency}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-white/20">
              <Receipt className="mb-2 h-10 w-10" />
              <p className="text-sm">No hay pagos próximos</p>
            </div>
          )}
        </div>

        {/* Spending by Category */}
        <div className="rounded-2xl border border-white/5 bg-slate-900 p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <PieChartIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Por Categoría</h3>
              <p className="text-xs text-white/40">Distribución de gastos ({viewMode === "monthly" ? "mensual" : "anual"})</p>
            </div>
          </div>
          {stats?.byCategory && Object.keys(stats.byCategory).length > 0 ? (
            <>
              {/* Chart */}
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={Object.entries(stats.byCategory).map(([category, data]) => ({
                        name: category.replace("_", " "),
                        value: viewMode === "yearly" ? data.total * 12 : data.total,
                        count: data.count,
                        category: category,
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={110}
                      innerRadius={82}
                      fill="#8884d8"
                      dataKey="value"
                      animationBegin={0}
                      animationDuration={800}
                      animationEasing="ease-out"
                    >
                      {Object.entries(stats.byCategory).map(([category], index) => (
                        <Cell key={`cell-${index}`} fill={categoryChartColors[category] ?? "#6b7280"} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "2px solid rgba(99, 102, 241, 0.3)",
                        borderRadius: "0.75rem",
                        color: "#ffffff",
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
                        padding: "12px 16px",
                      }}
                      labelStyle={{ 
                        color: "#ffffff", 
                        marginBottom: "8px",
                        fontWeight: "600",
                        fontSize: "14px",
                      }}
                      itemStyle={{
                        color: "#e2e8f0",
                        fontSize: "13px",
                      }}
                      formatter={(value, _name, props) => [
                        formatCurrency(Number(value), selectedCurrency),
                        `${props.payload.count} ${props.payload.count === 1 ? "suscripción" : "suscripciones"}`,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Pills */}
              <div className="mt-6 flex flex-wrap gap-2">
                {Object.entries(stats.byCategory)
                  .sort(([, a], [, b]) => b.total - a.total)
                  .map(([category, data]) => {
                    const displayTotal = viewMode === "yearly" ? data.total * 12 : data.total;
                    return (
                      <div
                        key={category}
                        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 transition-all hover:border-white/20 hover:bg-white/10"
                      >
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: categoryChartColors[category] ?? "#6b7280" }}
                        />
                        <span className="text-xs font-medium text-white">
                          {category.replace("_", " ")}
                        </span>
                        <span className="text-xs font-semibold text-white/80">
                          {formatCurrency(displayTotal, selectedCurrency)}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-white/20">
              <PieChartIcon className="mb-2 h-10 w-10" />
              <p className="text-sm">Aún no hay categorías</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

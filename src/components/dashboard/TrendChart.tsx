import { TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/utils";
import type { TrendPeriod, TrendsData } from "@/lib/hooks/useTrends";

interface TrendChartProps {
  trends: TrendsData;
  trendPeriod: TrendPeriod;
  setTrendPeriod: (period: TrendPeriod) => void;
  selectedCurrency: string;
}

export function TrendChart({ trends, trendPeriod, setTrendPeriod, selectedCurrency }: TrendChartProps) {
  return (
    <div className="flex flex-col rounded-2xl border border-white/5 bg-slate-900 p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
          <TrendingUp className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-white">Tendencia de Gastos</h3>
          <p className="text-xs text-white/40">
            {trendPeriod === "monthly" ? "Últimos 6 meses" : "Últimas 8 semanas"}
          </p>
        </div>
        {/* Botones de período */}
        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
          <button
            onClick={() => setTrendPeriod("monthly")}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              trendPeriod === "monthly"
                ? "bg-indigo-500 text-white"
                : "text-white/50 hover:text-white"
            }`}
          >
            Mensual
          </button>
          <button
            onClick={() => setTrendPeriod("weekly")}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              trendPeriod === "weekly"
                ? "bg-indigo-500 text-white"
                : "text-white/50 hover:text-white"
            }`}
          >
            Semanal
          </button>
        </div>
      </div>
      <div className="min-h-[280px] flex-1 w-full relative">
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
            
            if (prevMonth === 0 && lastMonth === 0) {
              return <span className="text-sm text-white/60">Sin gastos</span>;
            }
            
            if (prevMonth === 0) {
              return (
                <>
                  <TrendingUp className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-white/60">Nuevo gasto este mes</span>
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
                <span className="text-sm text-white/60">vs mes anterior</span>
              </>
            );
          })()} 
        </div>
      )}
    </div>
  );
}

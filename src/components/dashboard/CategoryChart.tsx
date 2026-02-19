import { PieChart as PieChartIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/utils";
import { CATEGORY_CHART_COLORS } from "@/lib/constants/categories";
import type { DashboardStats, ViewMode } from "@/lib/hooks/useDashboardStats";

interface CategoryChartProps {
  stats: DashboardStats | null;
  viewMode: ViewMode;
  selectedCurrency: string;
}

export function CategoryChart({ stats, viewMode, selectedCurrency }: CategoryChartProps) {
  return (
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
                    <Cell key={`cell-${index}`} fill={CATEGORY_CHART_COLORS[category] ?? "#6b7280"} />
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
                      style={{ backgroundColor: CATEGORY_CHART_COLORS[category] ?? "#6b7280" }}
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
  );
}

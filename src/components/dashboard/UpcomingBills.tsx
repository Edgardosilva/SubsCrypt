import { Receipt } from "lucide-react";
import { formatCurrency, formatDate, daysUntil } from "@/lib/utils";
import { findKnownLogo } from "@/lib/utils/logos";
import type { DashboardStats } from "@/lib/hooks/useDashboardStats";

interface UpcomingBillsProps {
  stats: DashboardStats | null;
}

export function UpcomingBills({ stats }: UpcomingBillsProps) {
  return (
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
  );
}

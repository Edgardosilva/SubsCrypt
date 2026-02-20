"use client";

import { Calendar as CalendarIcon } from "lucide-react";
import { useDashboardStore } from "@/lib/store/useDashboardStore";

export function Calendar() {
  const stats = useDashboardStore((state) => state.stats);
  return (
    <div className="flex flex-col rounded-2xl border border-white/5 bg-slate-900 p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
          <CalendarIcon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-white capitalize">
            {new Date().toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
          </h3>
          <p className="text-xs text-white/40">Días de cobro programados</p>
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className="flex-1 flex flex-col">
        {/* Days of week header */}
        <div className="mb-2 grid grid-cols-7 gap-1">
          {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
            <div key={day} className="text-center text-xs font-medium text-white/40 py-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1 flex-1 content-start">
          {(() => {
            const today = new Date();
            const year = today.getFullYear();
            const month = today.getMonth();
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const daysInMonth = lastDay.getDate();
            const startingDayOfWeek = firstDay.getDay();
            
            // Agrupar cobros por día
            const billsByDay: Record<number, Array<{
              id: string;
              name: string;
              price: string;
              currency: string;
              nextBilling: string;
              logo: string | null;
            }>> = {};
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
  );
}

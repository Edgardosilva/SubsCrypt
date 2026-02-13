"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency, formatDate, daysUntil } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, ExternalLink, MoreVertical, Trash2, Edit } from "lucide-react";
import { findKnownLogo } from "@/lib/utils/logos";

interface Subscription {
  id: string;
  name: string;
  logo: string | null;
  price: string;
  currency: string;
  cycle: string;
  nextBilling: string | null;
  category: string;
  status: string;
  color: string | null;
}

const statusColors: Record<string, string> = {
  ACTIVE: "bg-emerald-500/10 text-emerald-400",
  PAUSED: "bg-amber-500/10 text-amber-400",
  CANCELLED: "bg-red-500/10 text-red-400",
  TRIAL: "bg-blue-500/10 text-blue-400",
};

const cycleLabels: Record<string, string> = {
  WEEKLY: "/ week",
  MONTHLY: "/ mo",
  QUARTERLY: "/ 3 mo",
  SEMI_ANNUAL: "/ 6 mo",
  ANNUAL: "/ yr",
};

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  async function fetchSubscriptions() {
    try {
      const res = await fetch("/api/subscriptions");
      if (res.ok) {
        const data = await res.json();
        setSubscriptions(data);
      }
    } catch (error) {
      console.error("Failed to fetch subscriptions:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Estás seguro de que quieres eliminar esta suscripción?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/subscriptions/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSubscriptions((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete subscription:", error);
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Suscripciones</h1>
          <p className="text-sm text-white/40">
            {subscriptions.length} suscripci{subscriptions.length !== 1 ? "ones" : "ón"} en total
          </p>
        </div>
        <Link href="/subscriptions/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Agregar
          </Button>
        </Link>
      </div>

      {subscriptions.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-slate-900 p-12 text-center">
          <CreditCardIcon className="mx-auto mb-4 h-12 w-12 text-white/20" />
          <h3 className="mb-1 text-lg font-medium text-white">No hay suscripciones</h3>
          <p className="mb-4 text-sm text-white/40">
            Comienza a rastrear tus suscripciones agregando una.
          </p>
          <Link href="/subscriptions/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar tu primera suscripción
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subscriptions.map((sub) => {
            const logoUrl = sub.logo || findKnownLogo(sub.name);
            return (
              <div key={sub.id} className="group relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900 p-5 transition-all hover:border-white/10 hover:bg-slate-900/80">
                {sub.color && (
                  <div
                    className="absolute left-0 top-0 h-full w-1 rounded-l-2xl"
                    style={{ backgroundColor: sub.color }}
                  />
                )}
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {logoUrl ? (
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 p-2">
                        <img
                          src={logoUrl}
                          alt={sub.name}
                          className="h-full w-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement!.innerHTML = `<span class="text-sm font-bold text-white">${sub.name.charAt(0)}</span>`;
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white">
                        {sub.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-white">{sub.name}</h3>
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColors[sub.status] ?? "bg-white/5 text-white/50"}`}
                      >
                        {sub.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Link href={`/subscriptions/${sub.id}`}>
                      <button className="rounded-lg p-1.5 text-white/30 hover:bg-white/5 hover:text-white">
                        <Edit className="h-4 w-4" />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(sub.id)}
                      disabled={deletingId === sub.id}
                      className="rounded-lg p-1.5 text-white/30 hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {formatCurrency(Number(sub.price), sub.currency)}
                    </p>
                    <p className="text-xs text-white/40">{cycleLabels[sub.cycle] ?? sub.cycle}</p>
                  </div>
                  {sub.nextBilling && (
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wider text-white/30">Próximo pago</p>
                      <p className="text-sm font-medium text-white/70">
                        {daysUntil(sub.nextBilling) > 0
                          ? `${daysUntil(sub.nextBilling)} días`
                          : "Hoy"}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                  <span className="rounded-md bg-white/5 px-2 py-1 text-xs text-white/50">
                    {sub.category.replace("_", " ")}
                  </span>
                  {sub.nextBilling && (
                    <span className="text-xs text-white/30">{formatDate(sub.nextBilling)}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CreditCardIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
      />
    </svg>
  );
}

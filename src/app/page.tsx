import Link from "next/link";
import { CreditCard, BarChart3, Bell, Shield, ArrowRight, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/footer";

const features = [
  {
    icon: CreditCard,
    title: "Rastrea Todas tus Suscripciones",
    description: "Mantén todas tus suscripciones digitales organizadas en un solo lugar.",
    iconColor: "text-violet-400",
    bgColor: "bg-violet-500/10",
    hoverBorder: "hover:border-violet-500/30",
  },
  {
    icon: BarChart3,
    title: "Análisis de Gastos",
    description: "Ve exactamente cuánto gastas mensual y anualmente en todos tus servicios.",
    iconColor: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    hoverBorder: "hover:border-cyan-500/30",
  },
  {
    icon: Bell,
    title: "Recordatorios de Facturación",
    description: "Nunca más te sorprenda un cargo. Recibe notificaciones antes de cada fecha de pago.",
    iconColor: "text-amber-400",
    bgColor: "bg-amber-500/10",
    hoverBorder: "hover:border-amber-500/30",
  },
  {
    icon: Shield,
    title: "Control Total",
    description: "Pausa, cancela o categoriza suscripciones para optimizar tus gastos.",
    iconColor: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    hoverBorder: "hover:border-emerald-500/30",
  },
];

const brands = [
  "Netflix", "Spotify", "Disney+", "YouTube Premium", "Amazon Prime",
  "Apple TV+", "PlayStation Plus", "Xbox Game Pass", "Adobe CC", "GitHub Pro",
  "Notion", "Figma", "Dropbox", "iCloud", "Duolingo",
];

const mockSubs = [
  { name: "Netflix",          price: "$15.990", due: "Hoy",      dotColor: "bg-red-500"    },
  { name: "Spotify",          price: "$4.990",  due: "3 días",   dotColor: "bg-green-500"  },
  { name: "Adobe CC",         price: "$32.990", due: "12 días",  dotColor: "bg-red-400"    },
  { name: "YouTube Premium",  price: "$6.990",  due: "18 días",  dotColor: "bg-yellow-400" },
];

const barHeights = [35, 55, 45, 70, 60, 90, 72];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#06060a] text-white overflow-hidden">

      {/* ── Background effects ─────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -left-40 w-200 h-200 rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute -bottom-60 -right-40 w-150 h-150 rounded-full bg-violet-600/7 blur-[100px]" />
        <div className="absolute inset-0 dot-grid" />
      </div>

      {/* ── Navbar ─────────────────────────────────────────── */}
      <nav className="z-50 sticky top-0 border-b border-white/6 bg-[#06060a]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
              <CreditCard className="h-4 w-4 text-white" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight">SubsCrypt</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" className="text-white/50 hover:text-white text-sm">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-lg shadow-indigo-500/20 border-0 text-sm gap-1.5">
                Comenzar gratis
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_400px] gap-14 items-center">

          {/* Left: copy */}
          <div className="animate-fade-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-medium text-indigo-300">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Tu dinero, bajo control total
            </div>

            <h1 className="font-display text-5xl font-extrabold leading-[1.07] tracking-tight sm:text-6xl lg:text-7xl">
              El gestor de<br />
              suscripciones<br />
              <span className="bg-linear-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                que faltaba.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/50 sm:text-lg">
              Deja de perder el rastro de lo que pagas cada mes. SubsCrypt centraliza
              Netflix, Spotify, Adobe y todas tus suscripciones en un solo dashboard limpio.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/register">
                <Button size="lg" className="bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-lg shadow-indigo-500/25 border-0 gap-2">
                  Comenzar gratis
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="border-white/10 bg-white/4 text-white/75 hover:bg-white/8 hover:text-white">
                  Iniciar Sesión
                </Button>
              </Link>
            </div>

            {/* Stats row */}
            <div className="mt-10 flex flex-wrap gap-6 border-t border-white/6 pt-8">
              <div>
                <p className="font-display text-2xl font-bold text-white">100%</p>
                <p className="text-xs text-white/35 mt-0.5">Gratuito para empezar</p>
              </div>
              <div className="w-px bg-white/6" />
              <div>
                <p className="font-display text-2xl font-bold text-white">16+</p>
                <p className="text-xs text-white/35 mt-0.5">Categorías de servicios</p>
              </div>
              <div className="w-px bg-white/6" />
              <div>
                <p className="font-display text-2xl font-bold text-white">∞</p>
                <p className="text-xs text-white/35 mt-0.5">Suscripciones a registrar</p>
              </div>
            </div>
          </div>

          {/* Right: mock dashboard widget */}
          <div className="hidden lg:block animate-float">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-indigo-500/20 to-violet-500/20 blur-3xl scale-95" />
              <div className="relative rounded-2xl border border-white/9 bg-[#0d0d17]/90 p-6 shadow-2xl shadow-black/60 backdrop-blur-sm">

                {/* Card header */}
                <div className="mb-5 flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
                      Gasto mensual
                    </p>
                    <p className="mt-1 font-display text-3xl font-bold text-white">$59.960</p>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                    <TrendingDown className="h-3 w-3" />
                    −8%
                  </span>
                </div>

                {/* Mini bar chart */}
                <div className="mb-5 flex items-end gap-1 h-14 rounded-xl bg-white/3 px-3 py-2">
                  {barHeights.map((h, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-sm transition-all ${i === 5 ? "bg-indigo-400" : "bg-indigo-500/20"}`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>

                {/* Subscription list */}
                <div className="space-y-3.5">
                  {mockSubs.map((sub) => (
                    <div key={sub.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`h-2 w-2 rounded-full ${sub.dotColor}`} />
                        <span className="text-sm text-white/65">{sub.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-white">{sub.price}</p>
                        <p className="text-[10px] text-white/25">{sub.due}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Next charge */}
                <div className="mt-5 rounded-xl bg-white/4 px-3.5 py-2.5 flex items-center justify-between border border-white/5">
                  <span className="text-xs text-white/35">Próximo cargo</span>
                  <span className="text-xs font-medium text-amber-400">Netflix · Hoy</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Brand marquee ──────────────────────────────────── */}
      <div className="relative z-10 overflow-hidden border-y border-white/5 bg-white/1.5 py-4">
        <div className="animate-marquee">
          {[...brands, ...brands].map((brand, i) => (
            <span key={i} className="px-6 text-sm font-medium text-white/20 shrink-0">
              {brand}
              <span className="ml-6 text-white/10">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Features ───────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400 mb-3">
            Funcionalidades
          </p>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Todo lo que necesitas para{" "}
            <span className="text-white/40">tomar control de tus gastos.</span>
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`group rounded-xl border border-white/7 bg-white/3 p-6 transition-all duration-300 ${feature.hoverBorder} hover:bg-white/5 hover:-translate-y-0.5`}
            >
              <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${feature.bgColor}`}>
                <feature.icon className={`h-5 w-5 ${feature.iconColor}`} />
              </div>
              <h3 className="mb-2 font-display text-[15px] font-semibold leading-snug text-white">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-white/40">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-4xl px-4 pb-28 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-linear-to-br from-indigo-500/10 via-violet-500/6 to-transparent p-12 text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-62.5 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold sm:text-4xl mb-4">
              Empieza hoy, gratis.
            </h2>
            <p className="text-white/45 max-w-md mx-auto mb-8 text-base leading-relaxed">
              Registra tu primera suscripción en menos de dos minutos.
              Sin tarjeta de crédito, sin compromisos.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-lg shadow-indigo-500/25 border-0 gap-2 px-8">
                Crear cuenta gratis
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}

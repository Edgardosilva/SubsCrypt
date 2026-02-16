import Link from "next/link";
import { CreditCard, BarChart3, Bell, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: CreditCard,
    title: "Rastrea Todas tus Suscripciones",
    description: "Mantén todas tus suscripciones digitales organizadas en un solo lugar.",
  },
  {
    icon: BarChart3,
    title: "Análisis de Gastos",
    description: "Ve exactamente cuánto gastas mensual y anualmente en todos tus servicios.",
  },
  {
    icon: Bell,
    title: "Recordatorios de Facturación",
    description: "Nunca más te sorprenda un cargo. Recibe notificaciones antes de cada fecha de pago.",
  },
  {
    icon: Shield,
    title: "Control Total",
    description: "Pausa, cancela o categoriza suscripciones para optimizar tus gastos.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navbar */}
      <nav className="border-b border-white/10">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500">
              <CreditCard className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white">SubsCrypt</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10">Iniciar Sesión</Button>
            </Link>
            <Link href="/register">
              <Button>Comenzar</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
          Todas tus suscripciones,
          <br />
          <span className="text-indigo-400">un solo dashboard.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60">
          Deja de perder el rastro de lo que pagas. SubsCrypt te ayuda a gestionar Netflix,
          Spotify, PlayStation Plus y todas tus demás suscripciones digitales en un solo lugar.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="text-base">
              Comenzar Gratis
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="text-base border-white/10 bg-white/5 text-white hover:bg-white/10">
              Iniciar Sesión
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-white/10 bg-slate-900 p-6 transition-all hover:border-white/20 hover:bg-slate-800"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/10">
                <feature.icon className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
              <p className="text-sm text-white/60">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-sm text-white/40">
        <p>&copy; {new Date().getFullYear()} Suscript. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

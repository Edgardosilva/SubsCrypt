import { Github, Linkedin, Mail, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className=" border-t border-white/10 bg-slate-900 shadow-2xl">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* About */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">SubsCrypt</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Gestiona todas tus suscripciones en un solo lugar.
            </p>
           <p className="text-sm text-white/60 leading-relaxed">
              Control de gastos mensuales.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">Proyecto</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/Edgardosilva/SubsCrypt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 transition-colors hover:text-indigo-400"
                >
                  Repositorio GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Edgardosilva/SubsCrypt#readme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 transition-colors hover:text-indigo-400"
                >
                  Documentación
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Edgardosilva/SubsCrypt/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 transition-colors hover:text-indigo-400"
                >
                  Reportar un problema
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">Conecta</h3>
            <div className="flex gap-3">
              <a
                href="https://github.com/Edgardosilva"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-white/60 transition-all hover:bg-white/10 hover:text-white"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/edgardo-silva/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-white/60 transition-all hover:bg-white/10 hover:text-white"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:edgardosilva.dev@gmail.com"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-white/60 transition-all hover:bg-white/10 hover:text-white"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 text-sm text-white/40 md:flex-row">
          <p className="flex items-center gap-1">
            Hecho por{" "}
            <a
              href="https://www.linkedin.com/in/edgardo-silva/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 transition-colors hover:text-indigo-300"
            >
              Edgardo Silva
            </a>
          </p>
          <p>© {new Date().getFullYear()} SubsCrypt.</p>
        </div>
      </div>
    </footer>
  );
}

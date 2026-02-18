"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { User, Settings, LogOut, CreditCard } from "lucide-react";
import Link from "next/link";
import { NotificationBell } from "./notification-bell";

export function Navbar() {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/5 bg-slate-950/80 px-6 backdrop-blur-sm">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500">
          <CreditCard className="h-4 w-4 text-white" />
        </div>
        <span className="text-xl font-bold text-white">SubsCrypt</span>
      </div>
      <div className="flex items-center gap-4">
        <NotificationBell />
        
        {/* Avatar Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 transition-all hover:bg-indigo-500/30"
          >
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name ?? "User"}
                className="h-9 w-9 rounded-full"
              />
            ) : (
              <User className="h-5 w-5" />
            )}
          </button>

          {dropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setDropdownOpen(false)} 
              />
              <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-2xl">
                {/* User Info */}
                <div className="border-b border-white/10 px-4 py-3">
                  <p className="text-sm font-medium text-white">
                    {session?.user?.name ?? "Usuario"}
                  </p>
                  <p className="text-xs text-white/40">
                    {session?.user?.email ?? ""}
                  </p>
                </div>
                
                {/* Menu Items */}
                <div className="py-1">
                  <Link
                    href="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Configuración</span>
                  </Link>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      signOut({ callbackUrl: "/login" });
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

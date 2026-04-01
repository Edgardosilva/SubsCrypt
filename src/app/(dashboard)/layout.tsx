"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#06060a] flex flex-col">
      {/* Background subtle glow + dot grid */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-60 -left-40 w-200 h-200 rounded-full bg-indigo-600/8 blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-150 h-150 rounded-full bg-violet-600/5 blur-[120px]" />
        <div className="absolute inset-0 dot-grid" />
      </div>

      {/* Navbar - Full Width */}
      <Navbar onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
      
      {/* Content Area - Sidebar + Main */}
      <div className="relative flex flex-1">
        <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-6 pb-24">{children}</main>
      </div>
      
      {/* Footer - Full Width */}
      <Footer />
    </div>
  );
}

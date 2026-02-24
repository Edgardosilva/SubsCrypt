"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Navbar - Full Width */}
      <Navbar onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
      
      {/* Content Area - Sidebar + Main */}
      <div className="flex flex-1">
        <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-6 pb-24">{children}</main>
      </div>
      
      {/* Footer - Full Width */}
      <Footer />
    </div>
  );
}

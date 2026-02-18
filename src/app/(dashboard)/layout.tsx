import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Navbar - Full Width */}
      <Navbar />
      
      {/* Content Area - Sidebar + Main */}
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 pb-24">{children}</main>
      </div>
      
      {/* Footer - Full Width */}
      <Footer />
    </div>
  );
}

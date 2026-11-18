import Navbar from "@/components/Navbar";
import QuickNav from "@/components/QuickNav";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col" style={{ backgroundColor: 'var(--t-bg)' }}>
      <Navbar />
      <QuickNav />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-4 pb-24">
        {children}
      </main>
    </div>
  );
}

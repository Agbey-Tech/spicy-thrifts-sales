"use client";

import { SalesSidebar, SalesTopbar } from "@/components/layout/SalesNav";
import { useAuth } from "@/hooks/useAuth";

export default function SalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useAuth();
  return (
    <div className="flex flex-col min-h-screen md:flex-row bg-white">
      <SalesSidebar />
      <div className="flex-1 flex flex-col min-h-0">
        <SalesTopbar />
        <main className="flex-1 p-2 md:p-4 max-w-md mx-auto w-full overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

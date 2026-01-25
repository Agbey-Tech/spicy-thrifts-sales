"use client";

import { useState } from "react";
import { SalesSidebar } from "@/components/layout/SalesSidebar";
import { SalesTopbar } from "@/components/layout/SalesTopbar";
import { useAuth } from "@/hooks/useAuth";

export default function SalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SalesSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col">
        <SalesTopbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}

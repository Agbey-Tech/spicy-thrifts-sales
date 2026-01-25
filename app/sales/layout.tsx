"use client";

import { useState } from "react";
import { SalesSidebar } from "@/components/layout/SalesSidebar";
import { SalesTopbar } from "@/components/layout/SalesTopbar";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out");
      router.replace("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SalesSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col">
        <SalesTopbar
          onMenuClick={() => setSidebarOpen(true)}
          onLogout={handleLogout}
        />

        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}

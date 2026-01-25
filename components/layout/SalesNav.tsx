"use client";

import { LogOut, ShoppingCart, List } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUserStore } from "@/lib/auth/userStore";
import { logout } from "@/lib/api/auth";

import toast from "react-hot-toast";

export function SalesTopbar() {
  const user = useUserStore((s) => s.user);
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b bg-blue-600 text-white">
      <div className="text-lg font-bold tracking-wide">Spicy Thrifts POS</div>
      <div className="flex items-center gap-3">
        <span className="font-medium text-sm">{user?.full_name}</span>
        <span className="bg-white text-blue-600 rounded px-2 py-1 text-xs font-bold uppercase">
          {user?.role}
        </span>
      </div>
    </header>
  );
}

export function SalesSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const nav = [
    {
      label: "POS",
      href: "/sales",
      icon: <ShoppingCart className="w-5 h-5" />,
    },
    {
      label: "Orders",
      href: "/sales/orders",
      icon: <List className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 z-50 md:static md:w-48 md:flex-col md:h-full md:border-t-0 md:border-r">
      {nav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded transition-all text-xs font-semibold md:flex-row md:justify-start md:gap-2 md:text-base md:px-6 md:py-3 ${
            pathname === item.href
              ? "bg-blue-100 text-blue-600"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
      <button
        className="flex flex-col items-center gap-1 px-4 py-2 rounded text-xs font-semibold text-red-600 hover:bg-red-50 md:flex-row md:justify-start md:gap-2 md:text-base md:px-6 md:py-3"
        onClick={async () => {
          await logout();
          toast.success("Logged out");
          router.push("/login");
        }}
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </nav>
  );
}

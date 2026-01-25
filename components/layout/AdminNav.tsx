"use client";

import Link from "next/link";
import { useUserStore } from "@/lib/auth/userStore";
import { useRouter, usePathname } from "next/navigation";
import { logout } from "@/lib/api/auth";
import toast from "react-hot-toast";

const navItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Categories", href: "/admin/categories" },
  { label: "Products", href: "/admin/products" },
  { label: "Variants", href: "/admin/variants" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Reports", href: "/admin/reports" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-56 bg-gray-900 text-white flex flex-col h-full">
      <div className="text-2xl font-bold p-6 border-b border-gray-800">
        Spicy Thrifts
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-3 py-2 rounded transition-colors font-medium ${
              pathname === item.href ? "bg-gray-800" : "hover:bg-gray-800"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export function AdminTopbar() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  console.log("User in AdminTopbar:", user);
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out");
      router.replace("/login");
    } catch (e: any) {
      toast.error(e?.message || "Logout failed");
    }
  };
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <div />
      <div className="flex items-center gap-4">
        <span className="font-semibold">{user?.full_name}</span>
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">
          {user?.role}
        </span>
        <button
          onClick={handleLogout}
          className="ml-4 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm font-medium"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

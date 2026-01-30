"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, Receipt, LogOut, X, Store } from "lucide-react";
import { logout } from "@/lib/api/auth";
import toast from "react-hot-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function SalesSidebar({ isOpen, onClose }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const nav = [
    {
      label: "Point of Sale",
      href: "/sales",
      icon: ShoppingCart,
      gradient: "from-blue-500 to-blue-500",
    },
    {
      label: "Orders",
      href: "/sales/orders",
      icon: Receipt,
      gradient: "from-blue-500 to-blue-500",
    },
    {
      label: "Reports",
      href: "/sales/reports",
      icon: Receipt,
      gradient: "from-blue-500 to-blue-500",
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  const SidebarContent = (
    <div className="h-full flex flex-col bg-linear-to-b from-gray-900 via-gray-900 to-gray-800">
      {/* Brand Header */}
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="bg-linear-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl shadow-lg">
            <Store className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Spicy Thrifts</h1>
            <p className="text-xs text-gray-400">Point of Sale</p>
          </div>
        </div>

        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="md:hidden absolute top-6 right-6 p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {nav.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`
                group relative flex items-center gap-4 rounded-xl px-4 py-3.5
                transition-all duration-300 overflow-hidden
                ${
                  isActive
                    ? "bg-linear-to-r " + item.gradient + " shadow-lg scale-105"
                    : "text-gray-300 hover:bg-gray-800/50"
                }
              `}
            >
              {/* Animated background for hover */}
              {!isActive && (
                <div
                  className={`
                  absolute inset-0 bg-linear-to-r ${item.gradient} 
                  opacity-0 group-hover:opacity-10 transition-opacity duration-300
                `}
                />
              )}

              {/* Icon */}
              <div
                className={`
                relative z-10 p-2 rounded-lg transition-transform duration-300
                ${
                  isActive
                    ? "bg-white/20"
                    : "bg-gray-800 group-hover:bg-gray-700"
                }
                ${isActive ? "scale-110" : "group-hover:scale-110"}
              `}
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-400 group-hover:text-white"}`}
                />
              </div>

              {/* Label */}
              <span
                className={`
                relative z-10 font-semibold text-sm
                ${isActive ? "text-white" : "text-gray-300 group-hover:text-white"}
              `}
              >
                {item.label}
              </span>

              {/* Active indicator */}
              {isActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700/50">
        <button
          onClick={handleLogout}
          className="group w-full flex items-center gap-4 rounded-xl px-4 py-3.5 
                     text-gray-300 hover:bg-red-500/10 hover:text-red-400
                     transition-all duration-300 relative overflow-hidden"
        >
          {/* Hover effect */}
          <div className="absolute inset-0 bg-linear-to-r from-red-500 to-pink-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

          <div className="relative z-10 p-2 rounded-lg bg-gray-800 group-hover:bg-red-500/20 transition-all duration-300">
            <LogOut className="w-5 h-5" />
          </div>

          <span className="relative z-10 font-semibold text-sm">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar - Compact */}
      <aside className="hidden md:flex w-72 h-screen flex-col shadow-2xl">
        {SidebarContent}
      </aside>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          h-screen w-80
          flex flex-col
          shadow-2xl
          transform transition-transform duration-300 ease-out
          md:hidden
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {SidebarContent}
      </aside>
    </>
  );
}

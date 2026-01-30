"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingCart,
  Receipt,
  LogOut,
  X,
  Store,
  BarChart3,
} from "lucide-react";
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
      color: "#7c377f",
    },
    {
      label: "Orders",
      href: "/sales/orders",
      icon: Receipt,
      color: "#7c377f",
    },
    {
      label: "Reports",
      href: "/sales/reports",
      icon: BarChart3,
      color: "#7c377f",
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
    <div className="h-full flex flex-col bg-[#7c377f]">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#fadadd]">
        <div className="flex items-center gap-3">
          <div className="bg-[#fadadd] p-2.5 rounded-xl shadow-lg">
            <Store className="w-6 h-6 text-[#7c377f]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Spicy Thrifts</h1>
            <p className="text-xs text-[#fadadd]">Point of Sale</p>
          </div>
        </div>

        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="md:hidden absolute top-6 right-6 p-2 hover:bg-[#fadadd] rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-[#7c377f]" />
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
                    ? "bg-[#fadadd] shadow-lg scale-105"
                    : "text-white hover:bg-[#fadadd] hover:text-[#7c377f]"
                }
              `}
            >
              {/* Icon */}
              <div
                className={`
                relative z-10 p-2 rounded-lg transition-transform duration-300
                ${
                  isActive
                    ? "bg-white/20"
                    : "bg-[#7c377f] group-hover:bg-[#fadadd]"
                }
                ${isActive ? "scale-110" : "group-hover:scale-110"}
              `}
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? "text-[#7c377f]" : "text-white group-hover:text-[#7c377f]"}`}
                />
              </div>

              {/* Label */}
              <span
                className={`
                relative z-10 font-semibold text-sm
                ${isActive ? "text-[#7c377f]" : "text-white group-hover:text-[#7c377f]"}
              `}
              >
                {item.label}
              </span>

              {/* Active indicator */}
              {isActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#7c377f] rounded-l-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-[#fadadd]">
        <button
          onClick={handleLogout}
          className="group w-full flex items-center gap-4 rounded-xl px-4 py-3.5 
                     text-white hover:bg-[#fadadd] hover:text-[#7c377f]
                     transition-all duration-300 relative overflow-hidden"
        >
          <div className="relative z-10 p-2 rounded-lg bg-[#7c377f] group-hover:bg-[#fadadd] transition-all duration-300">
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

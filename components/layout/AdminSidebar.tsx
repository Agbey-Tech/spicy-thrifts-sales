"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/components/shared/navItems";
import { Shield, X } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  // Group navigation items by category if needed
  const getItemGradient = (index: number) => {
    const gradients = [
      "from-blue-500 to-cyan-600",
      "from-blue-500 to-cyan-600",
      "from-purple-500 to-pink-600",
      "from-green-500 to-emerald-600",
      "from-orange-500 to-red-600",
      "from-indigo-500 to-purple-600",
      "from-pink-500 to-rose-600",
      "from-teal-500 to-cyan-600",
      "from-amber-500 to-orange-600",
    ];
    return gradients[index % gradients.length];
  };

  const SidebarContent = (
    <div className="h-full flex flex-col bg-linear-to-b from-gray-900 via-gray-900 to-gray-800">
      {/* Brand Header */}
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="bg-linear-to-br from-purple-500 to-pink-600 p-2.5 rounded-xl shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Spicy Thrifts</h1>
            <p className="text-xs text-gray-400">Admin Panel</p>
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
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          const gradient = getItemGradient(index);

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
                    ? "bg-linear-to-r " + gradient + " shadow-lg scale-105"
                    : "text-gray-300 hover:bg-gray-800/50"
                }
              `}
            >
              {/* Animated background for hover */}
              {!isActive && (
                <div
                  className={`
                  absolute inset-0 bg-linear-to-r ${gradient} 
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

      {/* Footer */}
      <div className="border-t border-gray-700/50 p-4">
        <div className="bg-gray-800/50 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-400">© 2024 Spicy Thrifts</p>
          <p className="text-xs text-gray-500 mt-1">Admin Dashboard</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
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

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </>
  );
}

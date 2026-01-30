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
  // All gradients and accents use the new color scheme
  const getItemGradient = () => {
    return "from-[#7c377f] to-[#fadadd]";
  };

  const SidebarContent = (
    <div className="h-full flex flex-col bg-linear-to-b from-[#7c377f] via-[#7c377f] to-[#fadadd]">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#fadadd]">
        <div className="flex items-center gap-3">
          <div className="bg-linear-to-br from-[#7c377f] to-[#fadadd] p-2.5 rounded-xl shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Spicy Thrifts</h1>
            <p className="text-xs text-[#fadadd]">Admin Panel</p>
          </div>
        </div>

        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="md:hidden absolute top-6 right-6 p-2 hover:bg-[#fadadd] rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          const gradient = getItemGradient();

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
                    ? "bg-linear-to-r " +
                      gradient +
                      " shadow-lg scale-105 text-black"
                    : "text-black hover:bg-[#7c377f]/30 hover:text-white"
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
                    ? "bg-[#fadadd]/40"
                    : "bg-[#7c377f] group-hover:bg-[#fadadd]/30"
                }
                ${isActive ? "scale-110" : "group-hover:scale-110"}
              `}
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? "text-black" : "text-white group-hover:text-[#fadadd]"}`}
                />
              </div>

              {/* Label */}
              <span
                className={`
                relative z-10 font-semibold text-sm
                ${isActive ? "text-black" : "text-white group-hover:text-[#fadadd]"}
              `}
              >
                {item.label}
              </span>

              {/* Active indicator */}
              {isActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-black rounded-l-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-[#fadadd] p-4">
        <div className="bg-[#fadadd]/30 rounded-xl p-3 text-center">
          <p className="text-xs text-black">© 2024 Spicy Thrifts</p>
          <p className="text-xs text-black mt-1">Admin Dashboard</p>
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

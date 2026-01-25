"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/components/shared/navItems";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const SidebarContent = (
    <>
      {/* Brand */}
      <div className="px-6 py-4 text-lg font-bold border-b border-gray-800">
        Spicy Thrifts
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`block rounded-md px-3 py-2 text-sm font-medium transition
                ${
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-gray-800 p-4 text-xs text-gray-400">
        © Admin Panel
      </div>
    </>
  );

  return (
    <>
      {/* ===== Desktop Sidebar ===== */}
      <aside className="hidden md:flex w-64 h-screen bg-gray-900 text-gray-100 flex-col">
        {SidebarContent}
      </aside>

      {/* ===== Mobile Drawer ===== */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      <aside
        className={`
          fixed z-50 top-0 left-0
          h-screen w-64 bg-gray-900 text-gray-100
          flex flex-col
          transform transition-transform duration-300
          md:hidden
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {SidebarContent}
      </aside>
    </>
  );
}

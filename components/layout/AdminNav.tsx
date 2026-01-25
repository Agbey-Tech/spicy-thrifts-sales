"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/components/shared/navItems";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay (mobile) */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      <aside
        className={`
          fixed md:static z-50
          h-screen w-64
          bg-gray-900 text-gray-100
          flex flex-col
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Brand */}
        <div className="px-6 py-4 text-lg font-bold border-b border-gray-800">
          Spicy Thrifts
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  block rounded-md px-3 py-2 text-sm font-medium
                  transition-colors
                  ${
                    isActive
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }
                `}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout pinned bottom */}
        <div className="border-t border-gray-800 p-4">
          <p className="text-xs text-gray-400">© Admin Panel</p>
        </div>
      </aside>
    </>
  );
}

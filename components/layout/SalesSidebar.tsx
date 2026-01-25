"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, List, LogOut } from "lucide-react";
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

  const SidebarContent = (
    <>
      {/* Brand */}
      <div className="px-6 py-4 text-lg font-bold border-b border-gray-800">
        Spicy Thrifts POS
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
                ${
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout bottom */}
      <div className="border-t border-gray-800 p-4">
        <button
          onClick={async () => {
            await logout();
            toast.success("Logged out");
            router.push("/login");
          }}
          className="flex items-center gap-3 w-full rounded-md px-3 py-2 text-sm font-medium text-red-400 hover:bg-gray-800 hover:text-red-300 transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex w-64 h-screen bg-gray-900 text-gray-100 flex-col">
        {SidebarContent}
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          h-screen w-64
          bg-gray-900 text-gray-100
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

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
      <div className="px-6 py-4 font-bold text-lg border-b">
        Spicy Thrifts POS
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`flex items-center gap-3 px-6 py-3 font-medium transition
              ${
                pathname === item.href
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Logout bottom */}
      <div className="border-t p-4">
        <button
          onClick={async () => {
            await logout();
            toast.success("Logged out");
            router.push("/login");
          }}
          className="flex items-center gap-3 text-red-600 font-medium w-full px-2 py-2 hover:bg-red-50 rounded"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* ===== Desktop Sidebar ===== */}
      <aside className="hidden md:flex w-56 h-screen bg-white border-r flex-col">
        {SidebarContent}
      </aside>

      {/* ===== Mobile Overlay ===== */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* ===== Mobile Drawer ===== */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          h-screen w-64 bg-white
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

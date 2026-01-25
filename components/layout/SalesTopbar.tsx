"use client";

import { useUserStore } from "@/lib/auth/userStore";

interface Props {
  onMenuClick: () => void;
  onLogout: () => void;
}

export function SalesTopbar({ onMenuClick, onLogout }: Props) {
  const user = useUserStore((s) => s.user);

  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 md:px-6 text-gray-100">
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Hamburger (mobile only) */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded hover:bg-gray-800"
        >
          ☰
        </button>

        <span className="font-semibold hidden md:block">Sales Dashboard</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <span className="hidden sm:block text-sm font-medium text-gray-200">
          {user?.full_name}
        </span>

        <span className="bg-gray-800 text-gray-100 px-2 py-1 rounded text-xs font-bold uppercase">
          {user?.role}
        </span>

        {/* Avatar + dropdown */}
        <div className="relative group">
          <div className="h-9 w-9 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-700 cursor-pointer">
            {user?.full_name?.[0] ?? "A"}
          </div>

          <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 border rounded shadow-md opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto">
            <button
              onClick={onLogout}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

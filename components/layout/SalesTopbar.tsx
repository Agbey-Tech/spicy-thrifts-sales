"use client";

import { useUserStore } from "@/lib/auth/userStore";

interface Props {
  onMenuClick: () => void;
}

export function SalesTopbar({ onMenuClick }: Props) {
  const user = useUserStore((s) => s.user);

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b bg-blue-600 text-white">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded hover:bg-blue-500"
        >
          ☰
        </button>

        <span className="text-lg font-bold tracking-wide">
          Spicy Thrifts POS
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <span className="hidden sm:block font-medium text-sm">
          {user?.full_name}
        </span>
        <span className="bg-white text-blue-600 rounded px-2 py-1 text-xs font-bold uppercase">
          {user?.role}
        </span>
      </div>
    </header>
  );
}

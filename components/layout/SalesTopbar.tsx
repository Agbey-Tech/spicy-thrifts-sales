"use client";

import { useUserStore } from "@/lib/auth/userStore";
import { Menu, LogOut, User, ChevronDown } from "lucide-react";
import { useState } from "react";

interface Props {
  onMenuClick: () => void;
  onLogout: () => void;
}

export function SalesTopbar({ onMenuClick, onLogout }: Props) {
  const user = useUserStore((s) => s.user);
  const [showDropdown, setShowDropdown] = useState(false);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-gradient-to-r from-purple-500 to-pink-600 text-white";
      case "SALES":
        return "bg-gradient-to-r from-blue-500 to-indigo-600 text-white";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-4 md:px-6 relative z-30">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2.5 hover:bg-gray-100 rounded-xl transition-colors active:scale-95"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>

        {/* Page Title - Hidden on mobile, shown on desktop */}
        <div className="hidden md:block">
          <h2 className="text-lg font-bold text-gray-800">Sales Dashboard</h2>
          <p className="text-xs text-gray-500">Manage your sales and orders</p>
        </div>

        {/* Mobile Logo */}
        <div className="md:hidden">
          <h2 className="text-lg font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Spicy Thrifts
          </h2>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* User Info - Hidden on small mobile */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800">
              {user?.full_name}
            </p>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${getRoleColor(user?.role || "")}`}
              >
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* User Avatar Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-xl transition-all duration-200 active:scale-95 group"
          >
            {/* Avatar */}
            <div className="relative">
              <div className="h-10 w-10 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg group-hover:shadow-xl transition-shadow">
                {getInitials(user?.full_name || "")}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>

            {/* Chevron - Desktop only */}
            <ChevronDown
              className={`hidden md:block w-4 h-4 text-gray-500 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <>
              {/* Backdrop for mobile */}
              <div
                className="md:hidden fixed inset-0 z-40"
                onClick={() => setShowDropdown(false)}
              />

              {/* Dropdown Content */}
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                {/* User Info Header */}
                <div className="bg-linear-to-r from-blue-500 to-indigo-600 p-4 text-white">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-lg">
                      {getInitials(user?.full_name || "")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">
                        {user?.full_name}
                      </p>
                      <p className="text-xs text-blue-100">{user?.role}</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-2">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors group"
                  >
                    <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                      <LogOut className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-sm">Logout</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Mobile Role Badge */}
        <div className="sm:hidden">
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full ${getRoleColor(user?.role || "")}`}
          >
            {user?.role}
          </span>
        </div>
      </div>
    </header>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProducts } from "@/lib/api/products";
import { getVariants } from "@/lib/api/variants";
import { getSalesSummary, getLowStockVariants } from "@/lib/api/reports";
import {
  Package,
  Layers,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  ShoppingCart,
  Users,
  ListChecks,
  ArrowUp,
  ArrowDown,
  Activity,
  BarChart3,
  Zap,
} from "lucide-react";

function getTodayRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start);
  end.setDate(start.getDate() + 1);
  return {
    from: start.toISOString(),
    to: end.toISOString(),
  };
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<{
    totalProducts: number;
    totalVariants: number;
    todaysSales: number;
    lowStockCount: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const router = useRouter();
  useEffect(() => {
    async function fetchMetrics() {
      try {
        setLoading(true);
        setError("");
        const [products, variants, lowStock] = await Promise.all([
          getProducts(),
          getVariants(),
          getLowStockVariants(),
        ]);
        const { from, to } = getTodayRange();
        const salesSummary = await getSalesSummary(from, to);
        setMetrics({
          totalProducts: products.length,
          totalVariants: variants.length,
          todaysSales: salesSummary.totalSales,
          lowStockCount: lowStock.length,
        });
      } catch (e: any) {
        setError(e?.message || "Failed to load metrics");
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <Activity className="w-6 h-6 text-purple-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-gray-600 font-medium mt-4">
              Loading dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-red-800 mb-2">
              Error Loading Dashboard
            </h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-linear-to-br from-purple-500 to-pink-600 p-3 rounded-xl shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                Dashboard Overview
              </h1>
              <p className="text-sm text-gray-600">
                Real-time business metrics and insights
              </p>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <MetricCard
            label="Total Products"
            value={metrics.totalProducts}
            icon={<Package className="w-6 h-6" />}
            gradient="from-blue-500 to-cyan-600"
            trend={{ value: 12, isPositive: true }}
          />
          <MetricCard
            label="Total Variants"
            value={metrics.totalVariants}
            icon={<Layers className="w-6 h-6" />}
            gradient="from-green-500 to-emerald-600"
            trend={{ value: 8, isPositive: true }}
          />
          <MetricCard
            label="Today's Sales"
            value={metrics.todaysSales}
            prefix="$"
            icon={<DollarSign className="w-6 h-6" />}
            gradient="from-amber-500 to-orange-600"
            trend={{ value: 15, isPositive: true }}
          />
          <MetricCard
            label="Low Stock Items"
            value={metrics.lowStockCount}
            icon={<AlertTriangle className="w-6 h-6" />}
            gradient="from-red-500 to-pink-600"
            trend={{ value: 3, isPositive: false }}
          />
        </div>

        {/* Quick Actions Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-800">Quick Actions</h2>
          </div>
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
            onClick={() => router.push("/admin/orders")}
          >
            <ActivityCard
              icon={<ShoppingCart className="w-6 h-6" />}
              title="Recent Orders"
              desc="View and manage all recent sales and order activity"
              gradient="from-purple-500 to-indigo-600"
            />
            <ActivityCard
              icon={<Users className="w-6 h-6" />}
              title="Sales Staff"
              desc="Track performance and manage your sales team"
              gradient="from-pink-500 to-rose-600"
            />
          </div>
        </div>

        {/* Analytics Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-800">
              Analytics & Reports
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <ActivityCard
              icon={<ListChecks className="w-6 h-6" />}
              title="Inventory Health"
              desc="Monitor stock levels and inventory status across all products"
              gradient="from-teal-500 to-cyan-600"
            />
            <ActivityCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Sales Trends"
              desc="Visualize sales performance and identify growth opportunities"
              gradient="from-blue-500 to-indigo-600"
            />
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center py-4 text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  prefix,
  icon,
  gradient,
  trend,
}: {
  label: string;
  value: number;
  prefix?: string;
  icon: React.ReactNode;
  gradient: string;
  trend?: { value: number; isPositive: boolean };
}) {
  return (
    <div className="group bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300">
      {/* Icon Header */}
      <div className="flex items-center justify-between mb-4">
        <div
          className={`bg-linear-to-br ${gradient} p-3 rounded-xl shadow-md group-hover:shadow-lg transition-shadow`}
        >
          <div className="text-white">{icon}</div>
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
              trend.isPositive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {trend.isPositive ? (
              <ArrowUp className="w-3 h-3" />
            ) : (
              <ArrowDown className="w-3 h-3" />
            )}
            {trend.value}%
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mb-2">
        <div className="text-4xl font-bold text-gray-800 mb-1">
          {prefix}
          {value.toLocaleString()}
        </div>
        <div className="text-sm font-semibold text-gray-600">{label}</div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full bg-linear-to-r ${gradient} rounded-full transition-all duration-1000`}
          style={{ width: "75%" }}
        ></div>
      </div>
    </div>
  );
}

function ActivityCard({
  icon,
  title,
  desc,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  gradient: string;
}) {
  return (
    <div className="group relative bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden">
      {/* Gradient Background on Hover */}
      <div
        className={`absolute inset-0 bg-linear-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
      />

      {/* Content */}
      <div className="relative z-10 flex items-start gap-4">
        {/* Icon */}
        <div
          className={`shrink-0 bg-linear-to-br ${gradient} p-4 rounded-xl shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}
        >
          <div className="text-white">{icon}</div>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
        </div>

        {/* Arrow Icon */}
        <div className="shrink-0 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300">
          <ArrowUp className="w-5 h-5 rotate-45" />
        </div>
      </div>

      {/* Bottom Accent Line */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />
    </div>
  );
}

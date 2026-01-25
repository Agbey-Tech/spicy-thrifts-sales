"use client";

import { useEffect, useState } from "react";
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

  if (loading) return <div>Loading metrics...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!metrics) return null;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <TrendingUp className="w-8 h-8 text-blue-600" /> Admin Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <MetricCard
          label="Total Products"
          value={metrics.totalProducts}
          icon={<Package className="w-7 h-7 text-blue-500" />}
        />
        <MetricCard
          label="Total Variants"
          value={metrics.totalVariants}
          icon={<Layers className="w-7 h-7 text-green-500" />}
        />
        <MetricCard
          label="Today's Sales"
          value={metrics.todaysSales}
          prefix="$"
          icon={<DollarSign className="w-7 h-7 text-yellow-500" />}
        />
        <MetricCard
          label="Low Stock"
          value={metrics.lowStockCount}
          icon={<AlertTriangle className="w-7 h-7 text-red-500" />}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ActivityCard
          icon={<ShoppingCart className="w-6 h-6 text-purple-600" />}
          title="Recent Orders"
          desc="See all recent sales and order activity."
        />
        <ActivityCard
          icon={<Users className="w-6 h-6 text-pink-600" />}
          title="Top Sales Staff"
          desc="Track your best performing sales people."
        />
        <ActivityCard
          icon={<ListChecks className="w-6 h-6 text-indigo-600" />}
          title="Inventory Health"
          desc="Monitor stock levels and low inventory."
        />
        <ActivityCard
          icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
          title="Sales Trends"
          desc="Visualize sales trends and performance."
        />
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  prefix,
  icon,
}: {
  label: string;
  value: number;
  prefix?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded shadow p-6 flex flex-col items-center border border-gray-100">
      <div className="mb-2">{icon}</div>
      <div className="text-3xl font-bold mb-1">
        {prefix}
        {value}
      </div>
      <div className="text-gray-600 text-sm font-medium">{label}</div>
    </div>
  );
}

function ActivityCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white rounded shadow p-6 flex items-center gap-4 border border-gray-100">
      <div>{icon}</div>
      <div>
        <div className="font-semibold text-lg mb-1">{title}</div>
        <div className="text-gray-500 text-sm">{desc}</div>
      </div>
    </div>
  );
}

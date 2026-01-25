"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/lib/api/products";
import { getVariants } from "@/lib/api/variants";
import { getSalesSummary, getLowStockVariants } from "@/lib/api/reports";

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
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard label="Total Products" value={metrics.totalProducts} />
        <MetricCard label="Total Variants" value={metrics.totalVariants} />
        <MetricCard
          label="Today's Sales"
          value={metrics.todaysSales}
          prefix="$"
        />
        <MetricCard label="Low Stock" value={metrics.lowStockCount} />
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  prefix,
}: {
  label: string;
  value: number;
  prefix?: string;
}) {
  return (
    <div className="bg-white rounded shadow p-6 flex flex-col items-center">
      <div className="text-3xl font-bold mb-2">
        {prefix}
        {value}
      </div>
      <div className="text-gray-600 text-sm font-medium">{label}</div>
    </div>
  );
}

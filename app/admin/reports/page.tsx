"use client";

import { useState } from "react";
import useSWR from "swr";
import toast from "react-hot-toast";
import { getSalesSummary, getLowStockVariants } from "@/lib/api/reports";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function ReportsPage() {
  // Sales summary state
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [threshold, setThreshold] = useState(3);

  // Sales summary fetch
  const {
    data: sales,
    isLoading: salesLoading,
    error: salesError,
    mutate: mutateSales,
  } = useSWR(from && to ? ["/api/reports/sales-summary", from, to] : null, () =>
    getSalesSummary(from, to),
  );

  // Low stock fetch
  const {
    data: lowStock,
    isLoading: lowStockLoading,
    error: lowStockError,
    mutate: mutateLowStock,
  } = useSWR(["/api/reports/low-stock", threshold], () =>
    getLowStockVariants(threshold),
  );

  const isOffline = typeof navigator !== "undefined" && !navigator.onLine;

  // Chart data (simulate daily sales if possible)
  let chartData = null;
  let dailyRows = null;
  //   TODO: fix later...
  if (sales && sales.orders) {
    // Group orders by date
    const dailyMap = new Map();
    for (const o of sales.orders) {
      const date = o.created_at.slice(0, 10);
      if (!dailyMap.has(date)) dailyMap.set(date, 0);
      dailyMap.set(date, dailyMap.get(date) + Number(o.total_amount));
    }
    const dailyArr = Array.from(dailyMap.entries()).map(([date, total]) => ({
      date,
      total,
    }));
    dailyArr.sort((a, b) => a.date.localeCompare(b.date));
    chartData = {
      labels: dailyArr.map((d) => d.date),
      datasets: [
        {
          label: "Sales",
          data: dailyArr.map((d) => d.total),
          backgroundColor: "#2563eb",
        },
      ],
    };
    dailyRows = dailyArr;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Sales Summary */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Sales Summary</h2>
          <form
            className="flex flex-wrap gap-2 mb-4"
            onSubmit={(e) => {
              e.preventDefault();
              mutateSales();
            }}
          >
            <label className="flex flex-col">
              <span className="text-sm">From</span>
              <input
                type="date"
                className="border px-2 py-1 rounded"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                required
              />
            </label>
            <label className="flex flex-col">
              <span className="text-sm">To</span>
              <input
                type="date"
                className="border px-2 py-1 rounded"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                required
              />
            </label>
            <button
              type="submit"
              className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={!from || !to}
            >
              View
            </button>
          </form>
          {salesLoading && <div>Loading...</div>}
          {(salesError || isOffline) && (
            <div className="mb-3 text-sm text-yellow-600">
              You’re offline or having network issues. Showing last saved data.
            </div>
          )}
          {sales && (
            <>
              <div className="mb-4">
                <div className="font-semibold">
                  Total Sales: ${sales.totalSales ?? 0}
                </div>
                <div className="font-semibold">
                  Total Orders: {sales.orderCount ?? 0}
                </div>
              </div>
              {chartData && (
                <Bar
                  data={chartData}
                  options={{ plugins: { legend: { display: false } } }}
                  height={200}
                />
              )}
              {dailyRows && (
                <table className="w-full text-left mt-4">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-2">Date</th>
                      <th className="py-2 px-2">Sales</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyRows.map((d: any) => (
                      <tr key={d.date} className="border-b">
                        <td className="py-2 px-2">{d.date}</td>
                        <td className="py-2 px-2">${d.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
        {/* Low Stock */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Low Stock</h2>
          <form
            className="flex gap-2 mb-4"
            onSubmit={(e) => {
              e.preventDefault();
              mutateLowStock();
            }}
          >
            <label className="flex items-center gap-1">
              <span className="text-sm">Threshold</span>
              <input
                type="number"
                className="border px-2 py-1 rounded w-20"
                value={threshold}
                min={1}
                onChange={(e) => setThreshold(Number(e.target.value))}
              />
            </label>
            <button
              type="submit"
              className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Refresh
            </button>
          </form>
          {lowStockLoading && <div>Loading...</div>}
          {(lowStockError || isOffline) && (
            <div className="mb-3 text-sm text-yellow-600">
              You’re offline or having network issues. Showing last saved data.
            </div>
          )}
          {lowStock && (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-2">SKU</th>
                  <th className="py-2 px-2">Product</th>
                  <th className="py-2 px-2">Stock</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.map((v: any) => (
                  <tr key={v.id} className="border-b">
                    <td className="py-2 px-2">{v.sku}</td>
                    <td className="py-2 px-2">{v.products?.name || "-"}</td>
                    <td className="py-2 px-2">{v.stock_quantity}</td>
                  </tr>
                ))}
                {!lowStock.length && (
                  <tr>
                    <td colSpan={3} className="text-center py-6 text-gray-500">
                      No low stock variants
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

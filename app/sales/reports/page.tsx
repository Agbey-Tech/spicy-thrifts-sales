"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { getSalesSummary, getLowStockProducts } from "@/lib/api/reports";
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
import {
  BarChart3,
  AlertTriangle,
  Calendar,
  DollarSign,
  ShoppingCart,
  Package,
  RefreshCw,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

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
    data: allSales,
    isLoading: salesLoading,
    error: salesError,
    mutate: mutateSales,
  } = useSWR(from && to ? ["/api/reports/sales-summary", from, to] : null, () =>
    getSalesSummary(from, to),
  );

  const sales = useMemo(() => allSales, [allSales]);

  const isOffline = typeof navigator !== "undefined" && !navigator.onLine;

  // Chart data (simulate daily sales if possible)
  let chartData = null;
  let dailyRows = null;
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
          backgroundColor: "rgba(59, 130, 246, 0.8)",
          borderColor: "rgb(59, 130, 246)",
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    };
    dailyRows = dailyArr;
  }

  const handleSalesSubmit = () => {
    if (from && to) {
      mutateSales();
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-linear-to-br from-blue-500 to-cyan-600 p-3 rounded-xl shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
              <p className="text-sm text-gray-600">
                Sales analytics and inventory insights
              </p>
            </div>
          </div>
        </div>

        {/* Offline/Error Banner */}
        {isOffline && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg flex items-start gap-3 mb-6">
            <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-yellow-800">
                Network Issue
              </p>
              <p className="text-sm text-yellow-700">
                You're offline. Showing last saved data.
              </p>
            </div>
          </div>
        )}

        {/* Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Summary Card */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
            {/* Card Header */}
            <div className="bg-linear-to-r from-blue-500 to-cyan-600 text-white px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold">Sales Summary</h2>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6 space-y-6">
              {/* Date Range Inputs */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      From Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      To Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSalesSubmit}
                  className="w-full px-4 py-3 rounded-xl bg-linear-to-r from-blue-500 to-cyan-600 text-white font-semibold hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!from || !to || salesLoading}
                >
                  {salesLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Loading...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      View Report
                    </span>
                  )}
                </button>
              </div>

              {/* Error State */}
              {salesError && !isOffline && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">
                    Failed to load sales data. Please try again.
                  </p>
                </div>
              )}

              {/* Sales Summary Results */}
              {sales && (
                <div className="space-y-6">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-linear-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-green-500 p-2 rounded-lg">
                          <DollarSign className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-xs font-semibold text-gray-600 uppercase">
                          Total Sales
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">
                        ${sales.totalSales ?? 0}
                      </p>
                    </div>

                    <div className="bg-linear-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-blue-500 p-2 rounded-lg">
                          <ShoppingCart className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-xs font-semibold text-gray-600 uppercase">
                          Total Orders
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">
                        {sales.orderCount ?? 0}
                      </p>
                    </div>
                  </div>

                  {/* Chart */}
                  {chartData && (
                    <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                      <h3 className="text-sm font-bold text-gray-700 mb-4">
                        Daily Sales Trend
                      </h3>
                      <Bar
                        data={chartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: true,
                          plugins: {
                            legend: { display: false },
                            tooltip: {
                              backgroundColor: "rgba(0, 0, 0, 0.8)",
                              padding: 12,
                              cornerRadius: 8,
                              titleFont: { size: 14, weight: "bold" },
                              bodyFont: { size: 13 },
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              grid: { color: "rgba(0, 0, 0, 0.05)" },
                              ticks: {
                                callback: (value) => "$" + value,
                              },
                            },
                            x: {
                              grid: { display: false },
                            },
                          },
                        }}
                        height={200}
                      />
                    </div>
                  )}

                  {/* Daily Breakdown Table */}
                  {dailyRows && (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-linear-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                            <th className="py-3 px-4 text-left text-sm font-bold text-gray-700">
                              Date
                            </th>
                            <th className="py-3 px-4 text-right text-sm font-bold text-gray-700">
                              Sales
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {dailyRows.map((d: any) => (
                            <tr
                              key={d.date}
                              className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                            >
                              <td className="py-3 px-4 text-sm text-gray-700">
                                {new Date(d.date).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                                  <DollarSign className="w-3 h-3" />
                                  {d.total.toFixed(2)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Empty State */}
              {!sales && !salesLoading && from && to && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-linear-to-br from-gray-100 to-gray-200 rounded-full p-6 mb-4">
                    <BarChart3 className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">
                    No sales data available for selected period
                  </p>
                </div>
              )}

              {!from && !to && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-linear-to-br from-gray-100 to-gray-200 rounded-full p-6 mb-4">
                    <Calendar className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    Select date range to view sales report
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

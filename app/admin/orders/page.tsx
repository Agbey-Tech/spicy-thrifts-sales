"use client";

import useSWR from "swr";
import { useState, useMemo } from "react";
import {
  Printer,
  Eye,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  X,
  AlertCircle,
  User,
  Phone,
  MapPin,
  Truck,
  CreditCard,
  Calendar,
  DollarSign,
  FileText,
  Package,
  Grid3x3,
  List,
} from "lucide-react";
import toast from "react-hot-toast";
import { getOrders } from "@/lib/api/orders";
import type { Order } from "@/app/types/database";

const PAGE_SIZE = 10;

export default function OrdersPage() {
  const { data: orders, isLoading, error } = useSWR("/api/orders", getOrders);
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const isOffline = typeof navigator !== "undefined" && !navigator.onLine;

  // Pagination logic (client-side)
  const paginatedOrders = useMemo(() => {
    if (!orders) return [];
    const start = (page - 1) * PAGE_SIZE;
    return orders.slice(start, start + PAGE_SIZE);
  }, [orders, page]);

  const totalPages = orders ? Math.ceil(orders.length / PAGE_SIZE) : 1;

  // Overlay close
  const closeOverlay = () => setSelectedOrder(null);

  // Print logic (stub)
  const handlePrint = (order: Order) => {
    toast.success("Preparing invoice: " + order.invoice_number);
    // TODO: Implement PDF generation/print
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-xl shadow-lg">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
                <p className="text-sm text-gray-600">
                  {orders?.length || 0} total orders
                </p>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex gap-2 bg-white rounded-xl p-1.5 shadow-sm border-2 border-gray-200">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-orange-500 text-white shadow-md"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-orange-500 text-white shadow-md"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
          {isLoading && !orders ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
              <p className="text-gray-500 font-medium">Loading orders...</p>
            </div>
          ) : (
            <>
              {/* Offline/Error Banner */}
              {(error || isOffline) && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 m-4 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-yellow-800">
                      Network Issue
                    </p>
                    <p className="text-sm text-yellow-700">
                      You're offline or having network issues. Showing last
                      saved data.
                    </p>
                  </div>
                </div>
              )}

              {/* Grid View */}
              {viewMode === "grid" && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paginatedOrders.map((order: Order) => (
                      <div
                        key={order.id}
                        className="group relative bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-5 hover:border-orange-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
                        onClick={() => setSelectedOrder(order)}
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-lg shadow-md group-hover:scale-110 transition-transform duration-300">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex gap-1">
                            <button
                              className="p-2 hover:bg-orange-50 rounded-lg transition-colors text-gray-400 hover:text-orange-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrder(order);
                              }}
                              title="View details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 hover:bg-orange-50 rounded-lg transition-colors text-gray-400 hover:text-orange-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePrint(order);
                              }}
                              title="Print invoice"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-3">
                          <div>
                            <span className="font-mono text-sm font-bold text-gray-800 bg-gray-100 px-3 py-1 rounded-lg inline-block">
                              {order.invoice_number}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {new Date(order.created_at).toLocaleDateString()}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                            <div className="flex items-center gap-1.5">
                              <DollarSign className="w-4 h-4 text-gray-400" />
                              <span className="text-lg font-bold text-gray-800">
                                ${order.total_amount.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                              <CreditCard className="w-3 h-3" />
                              {order.payment_method}
                            </span>
                            <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                              <Package className="w-3 h-3" />
                              {order.order_type}
                            </span>
                            {order.delivery_status && (
                              <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                                <Truck className="w-3 h-3" />
                                {order.delivery_status}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {!paginatedOrders.length && (
                      <div className="col-span-full flex flex-col items-center justify-center py-16">
                        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full p-8 mb-4">
                          <ShoppingCart className="w-16 h-16 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          No orders yet
                        </h3>
                        <p className="text-sm text-gray-500">
                          Orders will appear here once created
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* List View */}
              {viewMode === "list" && (
                <>
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                          <th className="py-4 px-6 text-left text-sm font-bold text-gray-700">
                            Invoice #
                          </th>
                          <th className="py-4 px-6 text-left text-sm font-bold text-gray-700">
                            Date
                          </th>
                          <th className="py-4 px-6 text-center text-sm font-bold text-gray-700">
                            Total
                          </th>
                          <th className="py-4 px-6 text-center text-sm font-bold text-gray-700">
                            Payment
                          </th>
                          <th className="py-4 px-6 text-center text-sm font-bold text-gray-700">
                            Type
                          </th>
                          <th className="py-4 px-6 text-center text-sm font-bold text-gray-700">
                            Sales Person
                          </th>
                          <th className="py-4 px-6 text-center text-sm font-bold text-gray-700 w-32">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedOrders.map((order: Order) => (
                          <tr
                            key={order.id}
                            className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-200 cursor-pointer group"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <td className="py-4 px-6">
                              <span className="font-mono text-sm font-bold text-gray-800 bg-gray-100 px-3 py-1 rounded-lg inline-block">
                                {order.invoice_number}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-700">
                                  {new Date(order.created_at).toLocaleString()}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-sm font-bold">
                                <DollarSign className="w-3.5 h-3.5" />
                                {order.total_amount.toFixed(2)}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                                <CreditCard className="w-3 h-3" />
                                {order.payment_method}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                                <Package className="w-3 h-3" />
                                {order.order_type}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <span className="text-sm text-gray-700 font-medium">
                                {order.sales_person_id}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  className="p-2 hover:bg-orange-100 rounded-lg transition-colors text-gray-600 hover:text-orange-600"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedOrder(order);
                                  }}
                                  title="View details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  className="p-2 hover:bg-orange-100 rounded-lg transition-colors text-gray-600 hover:text-orange-600"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePrint(order);
                                  }}
                                  title="Print invoice"
                                >
                                  <Printer className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}

                        {!paginatedOrders.length && (
                          <tr>
                            <td colSpan={7} className="py-16">
                              <div className="flex flex-col items-center justify-center text-center">
                                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full p-8 mb-4">
                                  <ShoppingCart className="w-16 h-16 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                  No orders yet
                                </h3>
                                <p className="text-sm text-gray-500">
                                  Orders will appear here once created
                                </p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile List */}
                  <div className="md:hidden p-4 space-y-3">
                    {paginatedOrders.map((order: Order) => (
                      <div
                        key={order.id}
                        className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-4 hover:border-orange-300 hover:shadow-md transition-all duration-300 cursor-pointer"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-mono text-sm font-bold text-gray-800 bg-gray-100 px-2 py-1 rounded">
                                {order.invoice_number}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              {new Date(order.created_at).toLocaleString()}
                            </div>
                            <div className="flex items-center gap-1.5 mb-3">
                              <DollarSign className="w-5 h-5 text-gray-400" />
                              <span className="text-xl font-bold text-gray-800">
                                ${order.total_amount.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                                <CreditCard className="w-3 h-3" />
                                {order.payment_method}
                              </span>
                              <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                                <Package className="w-3 h-3" />
                                {order.order_type}
                              </span>
                              {order.delivery_status && (
                                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                                  <Truck className="w-3 h-3" />
                                  {order.delivery_status}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1 ml-2 flex-shrink-0">
                            <button
                              className="p-2 hover:bg-orange-50 rounded-lg transition-colors text-gray-400 hover:text-orange-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrder(order);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 hover:bg-orange-50 rounded-lg transition-colors text-gray-400 hover:text-orange-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePrint(order);
                              }}
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {!paginatedOrders.length && (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full p-8 mb-4">
                          <ShoppingCart className="w-16 h-16 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          No orders yet
                        </h3>
                        <p className="text-sm text-gray-500">
                          Orders will appear here once created
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="border-t-2 border-gray-100 p-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-600">
                      Showing{" "}
                      <span className="font-semibold text-gray-800">
                        {(page - 1) * PAGE_SIZE + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-semibold text-gray-800">
                        {Math.min(page * PAGE_SIZE, orders?.length || 0)}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-gray-800">
                        {orders?.length || 0}
                      </span>{" "}
                      orders
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 hover:border-orange-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Previous</span>
                      </button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter(
                            (p) =>
                              p === 1 ||
                              p === totalPages ||
                              (p >= page - 1 && p <= page + 1),
                          )
                          .map((p, idx, arr) => (
                            <>
                              {idx > 0 && arr[idx - 1] !== p - 1 && (
                                <span
                                  key={`ellipsis-${p}`}
                                  className="px-2 text-gray-400"
                                >
                                  ...
                                </span>
                              )}
                              <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                                  page === p
                                    ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md"
                                    : "bg-white border-2 border-gray-200 text-gray-700 hover:border-orange-300"
                                }`}
                              >
                                {p}
                              </button>
                            </>
                          ))}
                      </div>
                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 hover:border-orange-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={page === totalPages}
                      >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Overlay for order details */}
      {selectedOrder && (
        <OrderOverlay
          order={selectedOrder}
          onClose={closeOverlay}
          onPrint={handlePrint}
        />
      )}
    </div>
  );
}

function OrderOverlay({
  order,
  onClose,
  onPrint,
}: {
  order: Order;
  onClose: () => void;
  onPrint: (order: Order) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">Order Details</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Invoice Number */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase mb-1">
                  Invoice Number
                </p>
                <p className="font-mono text-2xl font-bold text-gray-800">
                  {order.invoice_number}
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-xl">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Order Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-xs font-semibold text-gray-600 uppercase">
                  Date
                </p>
              </div>
              <p className="text-sm font-semibold text-gray-800">
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <DollarSign className="w-4 h-4 text-orange-600" />
                </div>
                <p className="text-xs font-semibold text-gray-600 uppercase">
                  Total Amount
                </p>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                ${order.total_amount.toFixed(2)}
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <CreditCard className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-xs font-semibold text-gray-600 uppercase">
                  Payment Method
                </p>
              </div>
              <p className="text-sm font-semibold text-gray-800">
                {order.payment_method}
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Package className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-xs font-semibold text-gray-600 uppercase">
                  Order Type
                </p>
              </div>
              <p className="text-sm font-semibold text-gray-800">
                {order.order_type}
              </p>
            </div>
          </div>

          {/* Sales Person */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <User className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-xs font-semibold text-gray-600 uppercase">
                Sales Person
              </p>
            </div>
            <p className="text-sm font-semibold text-gray-800">
              {order.sales_person_id}
            </p>
          </div>

          {/* Customer Details */}
          {(order.customer_name || order.customer_phone) && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5">
              <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Customer Information
              </h3>
              <div className="space-y-3">
                {order.customer_name && (
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Name</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {order.customer_name}
                      </p>
                    </div>
                  </div>
                )}
                {order.customer_phone && (
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg">
                      <Phone className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Phone</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {order.customer_phone}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Delivery Details */}
          {(order.delivery_address || order.delivery_status) && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-5">
              <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-green-600" />
                Delivery Information
              </h3>
              <div className="space-y-3">
                {order.delivery_address && (
                  <div className="flex items-start gap-3">
                    <div className="bg-white p-2 rounded-lg flex-shrink-0">
                      <MapPin className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 mb-1">Address</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {order.delivery_address}
                      </p>
                    </div>
                  </div>
                )}
                {order.delivery_status && (
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg">
                      <Truck className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Status</p>
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold mt-1">
                        {order.delivery_status}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              className="flex-1 px-4 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => onPrint(order)}
              className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
            >
              <Printer className="w-5 h-5" />
              Print Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

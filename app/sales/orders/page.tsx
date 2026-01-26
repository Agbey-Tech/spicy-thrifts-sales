"use client";

import useSWR from "swr";
import { useUserStore } from "@/lib/auth/userStore";
import { getOrders } from "@/lib/api/orders";
import { useState, useMemo } from "react";
import {
  Printer,
  Eye,
  ChevronLeft,
  ChevronRight,
  Receipt,
  AlertCircle,
  Package,
  Filter,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";
import type { Order } from "@/app/types/database";
import { SalesOrderInvoiceOverlay } from "@/app/sales/orders/SalesOrderInvoiceOverlay";

const PAGE_SIZE = 10;

export default function SalesOrdersPage() {
  const user = useUserStore((s) => s.user);
  const { data: orders, isLoading, error } = useSWR("/api/orders", getOrders);
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPayment, setFilterPayment] = useState("");
  const isOffline = typeof navigator !== "undefined" && !navigator.onLine;

  // Only show orders for current sales user
  const userOrders = useMemo(() => {
    if (!orders || !user) return [];
    return orders.filter((o: Order) => o.sales_person_id === user.id);
  }, [orders, user]);

  // Apply search and filters
  const filteredOrders = useMemo(() => {
    if (!userOrders) return [];
    return userOrders.filter((order: Order) => {
      const matchesSearch =
        !searchTerm ||
        order.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_phone?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPayment =
        !filterPayment || order.payment_method === filterPayment;

      return matchesSearch && matchesPayment;
    });
  }, [userOrders, searchTerm, filterPayment]);

  const paginatedOrders = useMemo(() => {
    if (!filteredOrders) return [];
    const start = (page - 1) * PAGE_SIZE;
    return filteredOrders.slice(start, start + PAGE_SIZE);
  }, [filteredOrders, page]);

  const totalPages = filteredOrders
    ? Math.ceil(filteredOrders.length / PAGE_SIZE)
    : 1;

  const closeOverlay = () => setSelectedOrder(null);

  const handlePrint = (order: Order) => {
    toast.success("Preparing invoice for printing...");
    // TODO: Implement PDF generation/print
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case "CASH":
        return "bg-green-100 text-green-700 border-green-200";
      case "MOMO":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "TRANSFER":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getOrderTypeColor = (type: string) => {
    switch (type) {
      case "IN_STORE":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "PHONE_ORDER":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
              <Receipt className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
              <p className="text-sm text-gray-600">
                Manage and track your sales orders
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Search by invoice, customer name, or phone..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
              />
            </div>

            {/* Payment Filter */}
            <div className="md:w-64 relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <select
                value={filterPayment}
                onChange={(e) => {
                  setFilterPayment(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-12 pr-10 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none appearance-none cursor-pointer bg-white"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.75rem center",
                  backgroundSize: "1.5em 1.5em",
                }}
              >
                <option value="">All Payments</option>
                <option value="CASH">Cash</option>
                <option value="MOMO">Mobile Money</option>
                <option value="TRANSFER">Transfer</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {paginatedOrders.length} of {filteredOrders.length} orders
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {isLoading && !orders ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-gray-500 font-medium">Loading orders...</p>
            </div>
          ) : (
            <>
              {(error || isOffline) && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 m-4 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
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

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-linear-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                      <th className="py-4 px-6 text-left text-sm font-bold text-gray-700">
                        Invoice #
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-bold text-gray-700">
                        Date & Time
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-bold text-gray-700">
                        Customer
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-bold text-gray-700">
                        Type
                      </th>
                      <th className="py-4 px-6 text-right text-sm font-bold text-gray-700">
                        Total
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-bold text-gray-700">
                        Payment
                      </th>
                      <th className="py-4 px-6 text-center text-sm font-bold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrders.map((order: Order) => (
                      <tr
                        key={order.id}
                        className="border-b border-gray-100 hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 cursor-pointer group"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <td className="py-4 px-6">
                          <span className="font-mono font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded-lg group-hover:bg-white transition-colors">
                            {order.invoice_number}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm">
                            <div className="font-semibold text-gray-800">
                              {new Date(order.created_at).toLocaleDateString()}
                            </div>
                            <div className="text-gray-500">
                              {new Date(order.created_at).toLocaleTimeString()}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm">
                            <div className="font-semibold text-gray-800">
                              {order.customer_name || "Walk-in"}
                            </div>
                            {order.customer_phone && (
                              <div className="text-gray-500">
                                {order.customer_phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getOrderTypeColor(order.order_type)}`}
                          >
                            {order.order_type.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span className="text-lg font-bold text-blue-600">
                            ${order.total_amount.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getPaymentMethodColor(order.payment_method)}`}
                          >
                            {order.payment_method}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              className="p-2 hover:bg-blue-100 rounded-lg transition-colors group/btn"
                              title="View Details"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrder(order);
                              }}
                            >
                              <Eye className="w-4 h-4 text-gray-600 group-hover/btn:text-blue-600" />
                            </button>
                            <button
                              className="p-2 hover:bg-green-100 rounded-lg transition-colors group/btn"
                              title="Print Invoice"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePrint(order);
                              }}
                            >
                              <Printer className="w-4 h-4 text-gray-600 group-hover/btn:text-green-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {!paginatedOrders.length && (
                      <tr>
                        <td colSpan={7} className="py-16">
                          <div className="flex flex-col items-center justify-center text-center">
                            <div className="bg-linear-to-br from-gray-100 to-gray-200 rounded-full p-8 mb-4">
                              <Package className="w-16 h-16 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                              No orders found
                            </h3>
                            <p className="text-sm text-gray-500">
                              {searchTerm || filterPayment
                                ? "Try adjusting your filters"
                                : "Orders will appear here once created"}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile/Tablet Card View */}
              <div className="lg:hidden p-4 space-y-4">
                {paginatedOrders.map((order: Order) => (
                  <div
                    key={order.id}
                    className="bg-linear-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="font-mono font-bold text-sm bg-gray-100 px-3 py-1 rounded-lg">
                          {order.invoice_number}
                        </span>
                      </div>
                      <span className="text-xl font-bold text-blue-600">
                        ${order.total_amount.toFixed(2)}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-semibold text-gray-800">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-semibold text-gray-800">
                          {new Date(order.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                      {order.customer_name && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Customer:</span>
                          <span className="font-semibold text-gray-800">
                            {order.customer_name}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getOrderTypeColor(order.order_type)}`}
                      >
                        {order.order_type.replace("_", " ")}
                      </span>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getPaymentMethodColor(order.payment_method)}`}
                      >
                        {order.payment_method}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t border-gray-200">
                      <button
                        className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(order);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button
                        className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrint(order);
                        }}
                      >
                        <Printer className="w-4 h-4" />
                        Print
                      </button>
                    </div>
                  </div>
                ))}

                {!paginatedOrders.length && (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="bg-linear-to-br from-gray-100 to-gray-200 rounded-full p-8 mb-4">
                      <Package className="w-16 h-16 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      No orders found
                    </h3>
                    <p className="text-sm text-gray-500">
                      {searchTerm || filterPayment
                        ? "Try adjusting your filters"
                        : "Orders will appear here once created"}
                    </p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-linear-to-r from-gray-50 to-gray-100 border-t-2 border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <button
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white font-semibold text-gray-700"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Previous</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-700">
                        Page {page} of {totalPages}
                      </span>
                    </div>

                    <button
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white font-semibold text-gray-700"
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
              )}
            </>
          )}
        </div>
      </div>

      {/* Overlay for order details */}
      {selectedOrder && (
        <SalesOrderInvoiceOverlay
          orderId={selectedOrder.id}
          onClose={closeOverlay}
          onPrint={handlePrint}
        />
      )}
    </div>
  );
}

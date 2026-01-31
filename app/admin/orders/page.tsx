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

export default function AdminOrdersPage() {
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
    return orders.filter((o: Order) => true);
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

  // Use distinct colors for payment status
  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case "CASH":
        return "bg-green-100 text-green-700 border-green-300";
      case "MOMO":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "TRANSFER":
        return "bg-blue-100 text-blue-700 border-blue-300";
      default:
        return "bg-[#fadadd] text-[#7c377f] border-[#7c377f]";
    }
  };

  // Use distinct colors for order type status
  const getOrderTypeColor = (type: string) => {
    switch (type) {
      case "IN_STORE":
        return "bg-[#7c377f] text-white border-[#7c377f]";
      case "PHONE_ORDER":
        return "bg-[#fadadd] text-[#7c377f] border-[#7c377f]";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#fadadd] p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#7c377f] p-3 rounded-xl shadow-lg">
              <Receipt className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#7c377f]">Orders</h1>
              <p className="text-sm text-black/60">
                Manage and track your sales orders
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-[#fadadd] p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7c377f] group-focus-within:text-[#7c377f] transition-colors" />
              <input
                type="text"
                placeholder="Search by invoice, customer name, or phone..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-[#fadadd] focus:border-[#7c377f] focus:ring-4 focus:ring-[#fadadd] transition-all outline-none text-[#7c377f]"
              />
            </div>

            {/* Payment Filter */}
            <div className="md:w-64 relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7c377f] pointer-events-none" />
              <select
                value={filterPayment}
                onChange={(e) => {
                  setFilterPayment(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-12 pr-10 py-3 rounded-xl border-2 border-[#fadadd] focus:border-[#7c377f] focus:ring-4 focus:ring-[#fadadd] transition-all outline-none appearance-none cursor-pointer bg-white text-[#7c377f]"
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
          <div className="mt-4 text-sm text-[#7c377f]">
            Showing {paginatedOrders.length} of {filteredOrders.length} orders
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-[#fadadd] overflow-hidden">
          {isLoading && !orders ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-12 h-12 border-4 border-[#fadadd] border-t-[#7c377f] rounded-full animate-spin"></div>
              <p className="text-[#7c377f] font-medium">Loading orders...</p>
            </div>
          ) : (
            <>
              {(error || isOffline) && (
                <div className="bg-[#fadadd] border-l-4 border-[#7c377f] p-4 m-4 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#7c377f] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-[#7c377f]">
                      Network Issue
                    </p>
                    <p className="text-sm text-black/60">
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
                    <tr className="bg-[#fadadd] border-b-2 border-[#7c377f]">
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
                        className="border-b border-[#fadadd] hover:bg-[#fadadd] transition-all duration-200 cursor-pointer group"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <td className="py-4 px-6">
                          <span className="font-mono font-semibold text-[#7c377f] bg-[#fadadd] px-3 py-1 rounded-lg group-hover:bg-white transition-colors">
                            {order.invoice_number}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm">
                            <div className="font-semibold text-[#7c377f]">
                              {new Date(order.created_at).toLocaleDateString()}
                            </div>
                            <div className="text-black/60">
                              {new Date(order.created_at).toLocaleTimeString()}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm">
                            <div className="font-semibold text-[#7c377f]">
                              {order.customer_name || "Walk-in"}
                            </div>
                            {order.customer_phone && (
                              <div className="text-black/60">
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
                          <span className="text-lg font-bold text-[#7c377f]">
                            GH₵{order.total_amount.toFixed(2)}
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
                              className="p-2 hover:bg-[#fadadd] rounded-lg transition-colors group/btn"
                              title="View Details"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrder(order);
                              }}
                            >
                              <Eye className="w-4 h-4 text-[#7c377f] group-hover/btn:text-[#7c377f]" />
                            </button>
                            <button
                              className="p-2 hover:bg-[#fadadd] rounded-lg transition-colors group/btn"
                              title="Print Invoice"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrder(order);
                              }}
                            >
                              <Printer className="w-4 h-4 text-[#7c377f] group-hover/btn:text-[#7c377f]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {!paginatedOrders.length && (
                      <tr>
                        <td colSpan={7} className="py-16">
                          <div className="flex flex-col items-center justify-center text-center">
                            <div className="bg-[#fadadd] rounded-full p-8 mb-4">
                              <Package className="w-16 h-16 text-[#7c377f]" />
                            </div>
                            <h3 className="text-lg font-semibold text-[#7c377f] mb-2">
                              No orders found
                            </h3>
                            <p className="text-sm text-black/60">
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
                    className="bg-white border-2 border-[#fadadd] rounded-xl p-4 hover:border-[#7c377f] hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="font-mono font-bold text-sm bg-[#fadadd] text-[#7c377f] px-3 py-1 rounded-lg">
                          {order.invoice_number}
                        </span>
                      </div>
                      <span className="text-xl font-bold text-[#7c377f]">
                        GH₵{order.total_amount.toFixed(2)}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#7c377f]">Date:</span>
                        <span className="font-semibold text-[#7c377f]">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#7c377f]">Time:</span>
                        <span className="font-semibold text-[#7c377f]">
                          {new Date(order.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                      {order.customer_name && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#7c377f]">Customer:</span>
                          <span className="font-semibold text-[#7c377f]">
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
                    <div className="flex gap-2 pt-3 border-t-2 border-[#fadadd]">
                      <button
                        className="flex-1 py-2 px-4 bg-[#7c377f] text-white rounded-lg font-semibold hover:bg-[#fadadd] hover:text-[#7c377f] transition-colors flex items-center justify-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(order);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button
                        className="flex-1 py-2 px-4 bg-[#7c377f] text-white rounded-lg font-semibold hover:bg-[#fadadd] hover:text-[#7c377f] transition-colors flex items-center justify-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(order);
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
                    <div className="bg-[#fadadd] rounded-full p-8 mb-4">
                      <Package className="w-16 h-16 text-[#7c377f]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#7c377f] mb-2">
                      No orders found
                    </h3>
                    <p className="text-sm text-black/60">
                      {searchTerm || filterPayment
                        ? "Try adjusting your filters"
                        : "Orders will appear here once created"}
                    </p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-[#fadadd] border-t-2 border-[#7c377f] p-6">
                  <div className="flex items-center justify-between">
                    <button
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border-2 border-[#7c377f] hover:bg-[#fadadd] hover:text-[#7c377f] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-[#7c377f]"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Previous</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#7c377f]">
                        Page {page} of {totalPages}
                      </span>
                    </div>

                    <button
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border-2 border-[#7c377f] hover:bg-[#fadadd] hover:text-[#7c377f] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-[#7c377f]"
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
        />
      )}
    </div>
  );
}

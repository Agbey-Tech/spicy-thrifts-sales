"use client";

import useSWR from "swr";
import { useUserStore } from "@/lib/auth/userStore";
import { getOrders } from "@/lib/api/orders";
import { useState, useMemo } from "react";
import { Printer, Eye } from "lucide-react";
import toast from "react-hot-toast";
import type { Order } from "@/app/types/database";
import { SalesOrderInvoiceOverlay } from "@/app/sales/orders/SalesOrderInvoiceOverlay";

const PAGE_SIZE = 10;

export default function SalesOrdersPage() {
  const user = useUserStore((s) => s.user);
  const { data: orders, isLoading, error } = useSWR("/api/orders", getOrders);
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const isOffline = typeof navigator !== "undefined" && !navigator.onLine;

  // Only show orders for current sales user
  const userOrders = useMemo(() => {
    if (!orders || !user) return [];
    return orders.filter((o: Order) => o.sales_person_id === user.id);
  }, [orders, user]);

  const paginatedOrders = useMemo(() => {
    if (!userOrders) return [];
    const start = (page - 1) * PAGE_SIZE;
    return userOrders.slice(start, start + PAGE_SIZE);
  }, [userOrders, page]);

  const totalPages = userOrders ? Math.ceil(userOrders.length / PAGE_SIZE) : 1;

  const closeOverlay = () => setSelectedOrder(null);

  const handlePrint = (order: Order) => {
    toast("Print invoice: " + order.invoice_number);
    // TODO: Implement PDF generation/print
  };

  return (
    <div className="w-full max-w-none">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>
      <div className="bg-white rounded shadow p-4 overflow-x-auto">
        {isLoading && !orders ? (
          <div>Loading...</div>
        ) : (
          <>
            {(error || isOffline) && (
              <div className="mb-3 text-sm text-yellow-600">
                You’re offline or having network issues. Showing last saved
                data.
              </div>
            )}
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-2">Invoice #</th>
                  <th className="py-2 px-2">Date</th>
                  <th className="py-2 px-2">Total</th>
                  <th className="py-2 px-2">Payment</th>
                  <th className="py-2 px-2">Sales Person</th>
                  <th className="py-2 px-2 w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order: Order) => (
                  <tr
                    key={order.id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="py-2 px-2 font-mono">
                      {order.invoice_number}
                    </td>
                    <td className="py-2 px-2">
                      {new Date(order.created_at).toLocaleString()}
                    </td>
                    <td className="py-2 px-2">
                      ${order.total_amount.toFixed(2)}
                    </td>
                    <td className="py-2 px-2">{order.payment_method}</td>
                    <td className="py-2 px-2">{order.sales_person_id}</td>
                    <td className="py-2 px-2 flex gap-2">
                      <button
                        className="p-1 hover:bg-gray-200 rounded"
                        title="View"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(order);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1 hover:bg-gray-200 rounded"
                        title="Print"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrint(order);
                        }}
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {!paginatedOrders.length && (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-500">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4 gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Prev
                </button>
                <span className="px-2 py-1">
                  Page {page} of {totalPages}
                </span>
                <button
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
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

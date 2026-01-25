"use client";

import useSWR from "swr";
import { useState, useMemo } from "react";
import { Printer, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { getOrders } from "@/lib/api/orders";
import type { Order } from "@/app/types/database";

const PAGE_SIZE = 10;

export default function OrdersPage() {
  const { data: orders, isLoading, error } = useSWR("/api/orders", getOrders);
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
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
    toast("Print invoice: " + order.invoice_number);
    // TODO: Implement PDF generation/print
  };

  return (
    <div>
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
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-8 w-full max-w-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">Order Details</h2>
        <div className="mb-2">
          <b>Invoice #:</b>{" "}
          <span className="font-mono">{order.invoice_number}</span>
        </div>
        <div className="mb-2">
          <b>Date:</b> {new Date(order.created_at).toLocaleString()}
        </div>
        <div className="mb-2">
          <b>Total:</b> ${order.total_amount.toFixed(2)}
        </div>
        <div className="mb-2">
          <b>Payment Method:</b> {order.payment_method}
        </div>
        <div className="mb-2">
          <b>Sales Person:</b> {order.sales_person_id}
        </div>
        {/* Add more details as needed */}
        <div className="mb-2">
          <b>Order Type:</b> {order.order_type}
        </div>
        {order.customer_name && (
          <div className="mb-2">
            <b>Customer Name:</b> {order.customer_name}
          </div>
        )}
        {order.customer_phone && (
          <div className="mb-2">
            <b>Customer Phone:</b> {order.customer_phone}
          </div>
        )}
        {order.delivery_address && (
          <div className="mb-2">
            <b>Delivery Address:</b> {order.delivery_address}
          </div>
        )}
        {order.delivery_status && (
          <div className="mb-2">
            <b>Delivery Status:</b> {order.delivery_status}
          </div>
        )}
        <div className="flex justify-end mt-6 gap-2">
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-semibold"
            onClick={() => onPrint(order)}
          >
            <Printer className="w-4 h-4 inline mr-1" /> Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
}

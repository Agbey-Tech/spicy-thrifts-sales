import useSWR from "swr";
import { getOrder } from "@/lib/api/orders";
import { Printer } from "lucide-react";
import type { Order } from "@/app/types/database";

interface SalesOrderInvoiceOverlayProps {
  orderId: string;
  onClose: () => void;
  onPrint: (order: Order) => void;
}

export function SalesOrderInvoiceOverlay({
  orderId,
  onClose,
  onPrint,
}: SalesOrderInvoiceOverlayProps) {
  const {
    data: order,
    isLoading,
    error,
  } = useSWR(orderId ? ["order", orderId] : null, () => getOrder(orderId));

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded shadow-lg p-8 w-full max-w-lg relative">
          <div>Loading...</div>
        </div>
      </div>
    );
  }
  if (error || !order) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded shadow-lg p-8 w-full max-w-lg relative">
          <div className="mb-4 text-red-600">Failed to load order.</div>
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }

  // Items: order.order_items (array)
  // Each: name, qty, unit price, line total
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-8 w-full max-w-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">Invoice</h2>
        <div className="mb-2">
          <b>Store:</b> Spicy Thrifts
        </div>
        <div className="mb-2">
          <b>Invoice #:</b>{" "}
          <span className="font-mono">{order.invoice_number}</span>
        </div>
        <div className="mb-2">
          <b>Date:</b> {new Date(order.created_at).toLocaleString()}
        </div>
        <div className="mb-2">
          <b>Payment Method:</b> {order.payment_method}
        </div>
        <div className="mb-2">
          <b>Order Type:</b> {order.order_type}
        </div>
        <div className="mb-2">
          <b>Sales Person:</b> {order.sales_person_id}
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
        <div className="my-4">
          <table className="w-full text-sm border">
            <thead>
              <tr className="border-b">
                <th className="py-1 px-2 text-left">Item</th>
                <th className="py-1 px-2 text-right">Qty</th>
                <th className="py-1 px-2 text-right">Unit Price</th>
                <th className="py-1 px-2 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody>
              {order.order_items?.map((item: any) => (
                <tr key={item.id} className="border-b">
                  <td className="py-1 px-2">{item.product_variant_id}</td>
                  <td className="py-1 px-2 text-right">{item.quantity}</td>
                  <td className="py-1 px-2 text-right">
                    ${item.unit_price.toFixed(2)}
                  </td>
                  <td className="py-1 px-2 text-right">
                    ${item.subtotal.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mb-2 text-right font-bold text-lg">
          Grand Total: ${order.total_amount.toFixed(2)}
        </div>
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

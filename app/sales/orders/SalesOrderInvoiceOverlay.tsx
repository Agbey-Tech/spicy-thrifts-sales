import useSWR from "swr";
import { getOrder } from "@/lib/api/orders";
import {
  Printer,
  X,
  Package,
  Calendar,
  CreditCard,
  User,
  Phone,
  MapPin,
  ShoppingBag,
  Receipt,
} from "lucide-react";
import type { Order } from "@/app/types/database";
import { useUserStore } from "@/lib/auth/userStore";

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

  const user = useUserStore((state) => state.user);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium">Loading invoice...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl animate-in zoom-in-95 duration-200">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Error Loading Invoice
            </h3>
            <p className="text-gray-600">
              Failed to load order details. Please try again.
            </p>
          </div>
          <button
            className="w-full py-3 rounded-xl bg-gray-800 text-white font-semibold hover:bg-gray-900 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Invoice Details</h2>
              <p className="text-blue-100 text-sm">Spicy Thrifts</p>
            </div>
          </div>
          <button
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Invoice Info Card */}
          <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                  <Receipt className="w-4 h-4" />
                  Invoice Number
                </div>
                <div className="font-mono font-bold text-xl text-gray-800 bg-white px-3 py-2 rounded-lg inline-block">
                  {order.invoice_number}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date & Time
                </div>
                <div className="font-semibold text-gray-800">
                  <div>{new Date(order.created_at).toLocaleDateString()}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment & Order Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
              <div className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Payment Method
              </div>
              <span
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold border-2 ${getPaymentMethodColor(order.payment_method)}`}
              >
                {order.payment_method}
              </span>
            </div>
            <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
              <div className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                Order Type
              </div>
              <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold border-2 bg-purple-100 text-purple-700 border-purple-200">
                {order.order_type.replace("_", " ")}
              </span>
            </div>
          </div>

          {/* Customer Information */}
          {(order.customer_name ||
            order.customer_phone ||
            order.delivery_address) && (
            <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Customer Information
              </h3>
              <div className="space-y-3">
                {order.customer_name && (
                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-gray-600 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-600">Name</div>
                      <div className="font-semibold text-gray-800">
                        {order.customer_name}
                      </div>
                    </div>
                  </div>
                )}
                {order.customer_phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-gray-600 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-600">Phone</div>
                      <div className="font-semibold text-gray-800">
                        {order.customer_phone}
                      </div>
                    </div>
                  </div>
                )}
                {order.delivery_address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-gray-600 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-600">
                        Delivery Address
                      </div>
                      <div className="font-semibold text-gray-800">
                        {order.delivery_address}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sales Person */}
          <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
            <div className="text-sm text-gray-600 mb-1 flex items-center gap-2">
              <User className="w-4 h-4" />
              Sales Person
            </div>
            <div className="font-semibold text-gray-800">
              {order.sales_person_id} <br></br>
              {order.sales_person_id === user?.id && user?.full_name}
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
            <div className="bg-linear-to-r from-gray-800 to-gray-900 text-white px-4 py-3">
              <h3 className="font-bold flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Items
              </h3>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b-2 border-gray-200">
                    <th className="py-3 px-4 text-left text-sm font-bold text-gray-700">
                      Item
                    </th>
                    <th className="py-3 px-4 text-center text-sm font-bold text-gray-700">
                      Quantity
                    </th>
                    <th className="py-3 px-4 text-right text-sm font-bold text-gray-700">
                      Unit Price
                    </th>
                    <th className="py-3 px-4 text-right text-sm font-bold text-gray-700">
                      Line Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.order_items?.map((item: any) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          {item.product_variant_id}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-lg font-semibold">
                          {item.quantity}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-700">
                        ${item.unit_price.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-blue-600">
                        ${item.subtotal.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-200">
              {order.order_items?.map((item: any) => (
                <div key={item.id} className="p-4 space-y-2">
                  <div className="font-mono text-sm bg-gray-100 px-3 py-1 rounded inline-block">
                    {item.product_variant_id}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Quantity:</span>
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-lg font-semibold text-sm">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Unit Price:</span>
                    <span className="font-semibold text-gray-700">
                      ${item.unit_price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-sm font-semibold text-gray-700">
                      Line Total:
                    </span>
                    <span className="font-bold text-blue-600">
                      ${item.subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grand Total */}
          <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Grand Total</span>
              <span className="text-3xl font-bold">
                ${order.total_amount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t-2 border-gray-200 bg-linear-to-r from-gray-50 to-gray-100 p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              className="flex-1 py-3 px-6 rounded-xl bg-linear-to-r from-green-600 to-emerald-600 text-white font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
              onClick={() => onPrint(order)}
            >
              <Printer className="w-5 h-5" />
              Print Invoice
            </button>
            <button
              className="flex-1 py-3 px-6 rounded-xl bg-white border-2 border-gray-300 text-gray-700 font-bold hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 active:scale-95"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

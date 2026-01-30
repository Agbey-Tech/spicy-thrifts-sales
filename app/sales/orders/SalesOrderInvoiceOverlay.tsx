import useSWR from "swr";
import { getOrder } from "@/lib/api/orders";
import { getProducts } from "@/lib/api/products";
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
import type { Order, Product } from "@/app/types/database";
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

  // Fetch all products for name lookup
  const { data: products } = useSWR("products-for-invoice", getProducts, {
    revalidateOnFocus: false,
  });

  const user = useUserStore((state) => state.user);

  const handlePrint = () => {
    if (order) {
      onPrint(order);
      window.print();
    }
  };

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

  return (
    <>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          
          #print-content,
          #print-content * {
            visibility: visible;
          }
          
          #print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 80mm;
            background: white;
          }
          
          .no-print {
            display: none !important;
          }
          
          @page {
            size: 80mm auto;
            margin: 0;
          }
        }
      `}</style>

      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Invoice Preview</h2>
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
          <div className="flex-1 overflow-y-auto p-6">
            <div
              id="print-content"
              className="max-w-[80mm] mx-auto bg-white p-4"
            >
              {/* Receipt Header */}
              <div className="text-center border-b-2 border-black pb-3 mb-3">
                <h1 className="text-2xl font-bold tracking-tight mb-1">
                  SPICY THRIFTS
                </h1>
                <p className="text-xs">Fashion & Accessories</p>
                <p className="text-xs">Accra, Ghana</p>
                <p className="text-xs">Tel: +233 XX XXX XXXX</p>
              </div>

              {/* Invoice Details */}
              <div className="text-xs space-y-1 mb-3 border-b border-dashed border-black pb-3">
                <div className="flex justify-between">
                  <span className="font-semibold">INVOICE:</span>
                  <span className="font-mono">{order.invoice_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">DATE:</span>
                  <span>{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">TIME:</span>
                  <span>{new Date(order.created_at).toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">CASHIER:</span>
                  <span>{user?.full_name || order.sales_person_id}</span>
                </div>
              </div>

              {/* Customer Information */}
              {(order.customer_name ||
                order.customer_phone ||
                order.delivery_address) && (
                <div className="text-xs space-y-1 mb-3 border-b border-dashed border-black pb-3">
                  <div className="font-semibold mb-1">CUSTOMER DETAILS:</div>
                  {order.customer_name && (
                    <div className="flex justify-between">
                      <span>Name:</span>
                      <span className="text-right">{order.customer_name}</span>
                    </div>
                  )}
                  {order.customer_phone && (
                    <div className="flex justify-between">
                      <span>Phone:</span>
                      <span>{order.customer_phone}</span>
                    </div>
                  )}
                  {order.delivery_address && (
                    <div>
                      <span className="font-semibold">Address:</span>
                      <div className="text-right">{order.delivery_address}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Items Table */}
              <div className="mb-3">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b-2 border-black">
                      <th className="text-left py-1 font-semibold">ITEM</th>
                      <th className="text-center py-1 font-semibold">QTY</th>
                      <th className="text-right py-1 font-semibold">PRICE</th>
                      <th className="text-right py-1 font-semibold">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.order_items?.map((item: any) => {
                      const product = products?.find(
                        (p: Product) => p.id === item.product_id,
                      );
                      return (
                        <tr
                          key={item.id}
                          className="border-b border-dashed border-gray-400"
                        >
                          <td className="py-2 pr-1">
                            {product ? product.name : item.product_id}
                          </td>
                          <td className="text-center py-2">{item.quantity}</td>
                          <td className="text-right py-2">
                            ₵{item.unit_price.toFixed(2)}
                          </td>
                          <td className="text-right py-2 font-semibold">
                            ₵{item.subtotal.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="border-t-2 border-black pt-2 mb-3">
                <div className="flex justify-between text-lg font-bold mb-2">
                  <span>TOTAL:</span>
                  <span>₵{order.total_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Payment Method:</span>
                  <span className="font-semibold">{order.payment_method}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Order Type:</span>
                  <span className="font-semibold">
                    {order.order_type.replace("_", " ")}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-xs border-t border-dashed border-black pt-3 space-y-1">
                <p className="font-semibold">THANK YOU FOR YOUR PATRONAGE!</p>
                <p>Please keep this receipt for returns & exchanges</p>
                <p className="text-[10px] mt-2">
                  Goods sold are not returnable
                </p>
                <div className="mt-3 pt-2 border-t border-dashed border-black">
                  <p className="text-[10px]">Powered by Spicy Thrifts POS</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t-2 border-gray-200 bg-linear-to-r from-gray-50 to-gray-100 p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className="flex-1 py-3 px-6 rounded-xl bg-linear-to-r from-green-600 to-emerald-600 text-white font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
                onClick={handlePrint}
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
    </>
  );
}

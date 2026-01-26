"use client";

import { useState } from "react";
import { ProductSearchPanel } from "@/components/pos/ProductSearchPanel";
import { CartPanel, CartItem } from "@/components/pos/CartPanel";
import { CheckoutPanel } from "@/components/pos/CheckoutPanel";
import toast from "react-hot-toast";
import { ProductVariant } from "@/app/types/database";
import { ShoppingCart, X, CheckCircle, ArrowLeft } from "lucide-react";

export default function SalesPOSPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [refreshKey, setRefreshKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  const [showMobileCart, setShowMobileCart] = useState(false);

  const handleAddToCart = (variant: ProductVariant) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.variant.id === variant.id);
      if (existing) {
        if (existing.quantity < variant.stock_quantity) {
          toast.success("Quantity updated", { duration: 2000 });
          return prev.map((i) =>
            i.variant.id === variant.id
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          );
        }
        toast.error("Cannot add more than available stock");
        return prev;
      }
      toast.success("Added to cart", { duration: 2000 });
      return [...prev, { variant, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (variantId: string, quantity: number) => {
    setCart((prev) =>
      prev.map((i) => (i.variant.id === variantId ? { ...i, quantity } : i)),
    );
  };

  const handleRemove = (variantId: string) => {
    setCart((prev) => prev.filter((i) => i.variant.id !== variantId));
    toast.success("Removed from cart", { duration: 2000 });
  };

  const handleOrderSuccess = (orderId: string) => {
    setShowInvoice(true);
    setInvoiceId(orderId);
    setCart([]);
    setRefreshKey(Date.now().toString());
    setShowMobileCart(false);
  };

  const handleNewSale = () => {
    setShowInvoice(false);
    setInvoiceId(null);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-linear-to-br from-gray-50 to-gray-100">
      {!showInvoice ? (
        <div className="h-full">
          {/* Desktop Layout */}
          <div className="hidden h-screen lg:grid lg:grid-cols-[1fr_420px] gap-6 p-6 overflow-auto mb-30">
            {/* LEFT — PRODUCT BROWSER */}
            <div className="h-full overflow-y-auto pr-2 mb-64">
              <ProductSearchPanel
                onAddToCart={handleAddToCart}
                refreshKey={refreshKey}
              />
            </div>

            {/* RIGHT — CART + CHECKOUT */}
            <div className="h-full overflow-hidden">
              <div className="h-full flex flex-col gap-6 sticky top-6 overflow-y-auto">
                <div className="flex-1">
                  <CartPanel
                    items={cart}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemove}
                    onCheckout={() => {}}
                  />
                </div>
                {cart.length > 0 && (
                  <div className="animate-in slide-in-from-bottom duration-300 mb-10">
                    <CheckoutPanel
                      items={cart}
                      onOrderSuccess={handleOrderSuccess}
                      loading={loading}
                      setLoading={setLoading}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile/Tablet Layout */}
          <div className="lg:hidden p-4 pb-24">
            <ProductSearchPanel
              onAddToCart={handleAddToCart}
              refreshKey={refreshKey}
            />
          </div>

          {/* Mobile Floating Cart Button */}
          {cart.length > 0 && (
            <button
              onClick={() => setShowMobileCart(true)}
              className="lg:hidden fixed bottom-6 right-6 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-full p-4 shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 active:scale-95 z-40 group"
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6" />
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {totalItems}
                </div>
              </div>
            </button>
          )}

          {/* Mobile Cart Drawer */}
          {showMobileCart && (
            <div className="lg:hidden fixed inset-0 z-50 animate-in fade-in duration-200">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setShowMobileCart(false)}
              />

              {/* Drawer */}
              <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-linear-to-r from-gray-50 to-gray-100 rounded-t-3xl">
                  <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-blue-600" />
                    Your Cart
                  </h2>
                  <button
                    onClick={() => setShowMobileCart(false)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Cart Content */}
                <div className="flex-1 overflow-y-auto p-4">
                  <CartPanel
                    items={cart}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemove}
                    onCheckout={() => {}}
                  />
                </div>

                {/* Checkout Section */}
                {cart.length > 0 && (
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <CheckoutPanel
                      items={cart}
                      onOrderSuccess={handleOrderSuccess}
                      loading={loading}
                      setLoading={setLoading}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Success Header */}
            <div className="bg-linear-to-r from-green-500 to-emerald-500 p-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 animate-in zoom-in duration-500">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Order Complete!
              </h2>
              <p className="text-green-50">
                Your order has been successfully processed
              </p>
            </div>

            {/* Order Details */}
            <div className="p-8 space-y-6">
              <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Order ID</div>
                <div className="font-mono font-bold text-lg text-gray-800">
                  {invoiceId}
                </div>
              </div>

              <button
                onClick={handleNewSale}
                className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Start New Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

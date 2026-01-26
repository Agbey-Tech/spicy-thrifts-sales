"use client";

import { useState } from "react";
import { ProductSearchPanel } from "@/components/pos/ProductSearchPanel";
import { CartPanel, CartItem } from "@/components/pos/CartPanel";
import { CheckoutPanel } from "@/components/pos/CheckoutPanel";
import toast from "react-hot-toast";
import { ProductVariant } from "@/app/types/database";

export default function SalesPOSPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [refreshKey, setRefreshKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);

  const handleAddToCart = (variant: ProductVariant) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.variant.id === variant.id);
      if (existing) {
        if (existing.quantity < variant.stock_quantity) {
          return prev.map((item) =>
            item.variant.id === variant.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        } else {
          toast.error("Cannot add more than available stock");
          return prev;
        }
      }
      return [...prev, { variant, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (variantId: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.variant.id === variantId ? { ...item, quantity } : item,
      ),
    );
  };

  const handleRemove = (variantId: string) => {
    setCart((prev) => prev.filter((item) => item.variant.id !== variantId));
  };

  const handleOrderSuccess = (orderId: string) => {
    setShowInvoice(true);
    setInvoiceId(orderId);
    setCart([]);
    setRefreshKey(Date.now().toString());
  };

  const handleCheckout = () => {
    setShowInvoice(false);
    setInvoiceId(null);
  };

  return (
    <div className="flex flex-col gap-4">
      {!showInvoice ? (
        <>
          <ProductSearchPanel
            onAddToCart={handleAddToCart}
            refreshKey={refreshKey}
          />
          <CartPanel
            items={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemove}
            onCheckout={() => setShowInvoice(false)}
          />
          <CheckoutPanel
            items={cart}
            onOrderSuccess={handleOrderSuccess}
            loading={loading}
            setLoading={setLoading}
          />
        </>
      ) : (
        <div className="p-4 border rounded bg-white">
          <h2 className="font-bold text-lg mb-2">Order Complete</h2>
          <div>Order ID: {invoiceId}</div>
          <button className="btn btn-primary mt-4" onClick={handleCheckout}>
            New Sale
          </button>
        </div>
      )}
    </div>
  );
}

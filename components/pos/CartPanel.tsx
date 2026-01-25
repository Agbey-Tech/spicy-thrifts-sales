"use client";

import { ProductVariant } from "@/app/types/database";
import { Trash2 } from "lucide-react";

interface CartItem {
  variant: ProductVariant;
  quantity: number;
}

interface CartPanelProps {
  items: CartItem[];
  onUpdateQuantity: (variantId: string, quantity: number) => void;
  onRemove: (variantId: string) => void;
  onCheckout: () => void;
}

export function CartPanel({
  items,
  onUpdateQuantity,
  onRemove,
  onCheckout,
}: CartPanelProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.variant.price * item.quantity,
    0,
  );

  return (
    <section
      className="
        bg-gray-900 text-gray-100
        rounded-xl border border-gray-800
        p-4 sm:p-5 md:p-6
        space-y-4
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Cart</h2>
        <span className="text-xs text-gray-400">
          {items.length} item{items.length !== 1 && "s"}
        </span>
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-sm text-gray-400 text-center py-8">
          Cart is empty
        </div>
      )}

      {/* Items */}
      {items.length > 0 && (
        <>
          <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-1">
            {items.map(({ variant, quantity }) => (
              <div
                key={variant.id}
                className="
                  bg-gray-800 border border-gray-700
                  rounded-lg p-3
                  flex items-center gap-3
                "
              >
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">
                    {variant.sku}
                  </div>
                  <div className="text-xs text-gray-400">
                    {variant.size || "-"} / {variant.primary_color || "-"}
                  </div>
                  <div className="text-xs text-gray-500">
                    Stock: {variant.stock_quantity}
                  </div>
                </div>

                {/* Quantity */}
                <input
                  type="number"
                  min={1}
                  max={variant.stock_quantity}
                  value={quantity}
                  onChange={(e) => {
                    let val = Number(e.target.value);
                    if (val > variant.stock_quantity)
                      val = variant.stock_quantity;
                    if (val < 1) val = 1;
                    onUpdateQuantity(variant.id, val);
                  }}
                  className="
                    w-16 rounded-md
                    bg-gray-900 border border-gray-700
                    px-2 py-1 text-sm
                    focus:outline-none focus:ring-2 focus:ring-gray-600
                  "
                />

                {/* Price */}
                <div className="text-sm font-semibold whitespace-nowrap">
                  ${(variant.price * quantity).toFixed(2)}
                </div>

                {/* Remove */}
                <button
                  onClick={() => onRemove(variant.id)}
                  className="p-2 rounded hover:bg-gray-700 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="border-t border-gray-800 pt-4 space-y-3">
            <div className="flex justify-between text-sm font-medium">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {/* 
            <button
              onClick={onCheckout}
              className="
                w-full rounded-lg
                bg-gray-100 text-gray-900
                py-3 font-semibold
                transition hover:bg-white
              "
            >
              Checkout
            </button> */}
          </div>
        </>
      )}
    </section>
  );
}

export type { CartItem };

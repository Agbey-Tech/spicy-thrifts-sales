import { useState } from "react";
import { ProductVariant } from "@/app/types/database";

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
    <section className="mb-4">
      <h2 className="font-bold mb-2">Cart</h2>
      {items.length === 0 ? (
        <div className="text-gray-500">Cart is empty</div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map(({ variant, quantity }) => (
            <div
              key={variant.id}
              className="flex items-center gap-2 border p-2 rounded"
            >
              <div className="flex-1">
                <div className="font-semibold text-sm">{variant.sku}</div>
                <div className="text-xs text-gray-500">
                  {variant.size || "-"} / {variant.primary_color || "-"}
                </div>
                <div className="text-xs">Stock: {variant.stock_quantity}</div>
              </div>
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
                className="input input-sm w-16"
              />
              <div className="font-bold text-blue-600">
                ${(variant.price * quantity).toFixed(2)}
              </div>
              <button
                className="btn btn-sm btn-error"
                onClick={() => onRemove(variant.id)}
              >
                Remove
              </button>
            </div>
          ))}
          <div className="font-bold text-right mt-2">
            Subtotal: ${subtotal.toFixed(2)}
          </div>
          <button className="btn btn-primary w-full mt-2" onClick={onCheckout}>
            Checkout
          </button>
        </div>
      )}
    </section>
  );
}

export type { CartItem };

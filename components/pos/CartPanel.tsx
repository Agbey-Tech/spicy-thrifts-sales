"use client";

import { Product, Sp } from "@/app/types/database";
import { Trash2, ShoppingBag, Plus, Minus, Package } from "lucide-react";

// New CartItem type
type CartItem = {
  product: Product;
  sp: Sp;
  quantity: number;
};

interface CartPanelProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export function CartPanel({
  items,
  onUpdateQuantity,
  onRemove,
}: CartPanelProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.sp.base_price * item.quantity,
    0,
  );
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <section className="bg-white rounded-2xl shadow-lg border-2 border-[#fadadd] overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="bg-[#7c377f] text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#fadadd] p-2 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-[#7c377f]" />
            </div>
            <h2 className="text-lg font-bold">Shopping Cart</h2>
          </div>
          <div className="bg-[#fadadd] px-3 py-1 rounded-full">
            <span className="text-sm font-semibold text-[#7c377f]">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </span>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="bg-[#fadadd] rounded-full p-8 mb-4">
            <ShoppingBag className="w-16 h-16 text-[#7c377f]" />
          </div>
          <h3 className="text-lg font-semibold text-[#7c377f] mb-2">
            Your cart is empty
          </h3>
          <p className="text-sm text-black/60">Add products to get started</p>
        </div>
      )}

      {/* Items */}
      {items.length > 0 && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.map(({ product, sp, quantity }) => (
              <div
                key={product.id}
                className="bg-white border-2 border-[#fadadd] rounded-xl p-4 hover:border-[#7c377f] hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="w-20 h-20 shrink-0 bg-[#fadadd] rounded-lg border-2 border-[#fadadd] overflow-hidden flex items-center justify-center">
                    <Package className="w-8 h-8 text-[#7c377f]" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[#7c377f] mb-1 truncate">
                      {product.name}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-[#fadadd] px-2 py-1 rounded-md text-[#7c377f]">
                        SP: {sp.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className={`inline-flex items-center gap-1 text-[#7c377f]`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            product.stock_quantity > 10
                              ? "bg-green-500"
                              : product.stock_quantity > 0
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                        ></div>
                        Stock: {product.stock_quantity}
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemove(product.id)}
                    className="self-start p-2 rounded-lg hover:bg-[#fadadd] text-[#7c377f] hover:text-red-500 transition-colors"
                    title="Remove from cart"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Quantity and Price Row */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t-2 border-[#fadadd]">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const newQty = quantity - 1;
                        if (newQty >= 1) {
                          onUpdateQuantity(product.id, newQty);
                        }
                      }}
                      disabled={quantity <= 1}
                      className="w-8 h-8 rounded-lg bg-[#fadadd] hover:bg-[#7c377f] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <input
                      type="number"
                      min={1}
                      max={product.stock_quantity}
                      value={quantity}
                      onChange={(e) => {
                        let val = Number(e.target.value);
                        if (val > product.stock_quantity)
                          val = product.stock_quantity;
                        if (val < 1) val = 1;
                        onUpdateQuantity(product.id, val);
                      }}
                      className="w-16 text-center rounded-lg bg-white border-2 border-[#fadadd] px-2 py-1.5 font-semibold text-[#7c377f] focus:outline-none focus:ring-2 focus:ring-[#fadadd] focus:border-[#7c377f]"
                    />

                    <button
                      onClick={() => {
                        const newQty = quantity + 1;
                        if (newQty <= product.stock_quantity) {
                          onUpdateQuantity(product.id, newQty);
                        }
                      }}
                      disabled={quantity >= product.stock_quantity}
                      className="w-8 h-8 rounded-lg bg-[#fadadd] hover:bg-[#7c377f] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <div className="text-xs text-black/70">
                      GH₵{sp.base_price.toLocaleString()} × {quantity}
                    </div>
                    <div className="text-lg font-bold text-[#7c377f]">
                      GH₵{(sp.base_price * quantity).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="border-t-2 border-[#fadadd] bg-[#fadadd] p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[#7c377f]">
                <span className="text-sm">Items</span>
                <span className="font-semibold">{totalItems}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-[#7c377f]">
                  Subtotal
                </span>
                <span className="text-2xl font-bold text-[#7c377f]">
                  GH₵{subtotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

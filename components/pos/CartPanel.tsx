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
    <section className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="bg-lnear-to-r from-gray-800 to-gray-900 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold">Shopping Cart</h2>
          </div>
          <div className="bg-white/20 px-3 py-1 rounded-full">
            <span className="text-sm font-semibold">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </span>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="bg-linear-to-br from-gray-100 to-gray-200 rounded-full p-8 mb-4">
            <ShoppingBag className="w-16 h-16 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Your cart is empty
          </h3>
          <p className="text-sm text-gray-500">Add products to get started</p>
        </div>
      )}

      {/* Items */}
      {items.length > 0 && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.map(({ product, sp, quantity }) => (
              <div
                key={product.id}
                className="bg-linear-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="w-20 h-20 shrink-0 bg-white rounded-lg border-2 border-gray-200 overflow-hidden flex items-center justify-center">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-800 mb-1 truncate">
                      {product.name}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-600">
                        SP: {sp.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className={`inline-flex items-center gap-1 ${
                          product.stock_quantity > 10
                            ? "text-green-600"
                            : product.stock_quantity > 0
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
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
                    className="self-start p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                    title="Remove from cart"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Quantity and Price Row */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
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
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
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
                      className="w-16 text-center rounded-lg bg-white border-2 border-gray-200 px-2 py-1.5 font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />

                    <button
                      onClick={() => {
                        const newQty = quantity + 1;
                        if (newQty <= product.stock_quantity) {
                          onUpdateQuantity(product.id, newQty);
                        }
                      }}
                      disabled={quantity >= product.stock_quantity}
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <div className="text-xs text-gray-500">
                      GH₵{sp.base_price.toLocaleString()} × {quantity}
                    </div>
                    <div className="text-lg font-bold text-blue-600">
                      GH₵{(sp.base_price * quantity).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="border-t-2 border-gray-200 bg-linear-to-r from-gray-50 to-gray-100 p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-gray-600">
                <span className="text-sm">Items</span>
                <span className="font-semibold">{totalItems}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-800">
                  Subtotal
                </span>
                <span className="text-2xl font-bold text-blue-600">
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

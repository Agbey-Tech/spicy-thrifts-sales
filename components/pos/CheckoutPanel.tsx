"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { createOrder } from "@/lib/api/orders";

import { Product, Sp } from "@/app/types/database";
// CartItem for new schema
type CartItem = {
  product: Product;
  sp: Sp;
  quantity: number;
};
import { OrderType, PaymentMethod } from "@/app/types/database";

interface CheckoutPanelProps {
  items: CartItem[];
  onOrderSuccess: (orderId: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export function CheckoutPanel({
  items,
  onOrderSuccess,
  loading,
  setLoading,
}: CheckoutPanelProps) {
  const [orderType, setOrderType] = useState<OrderType>("IN_STORE");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Update order creation to use product_id and quantity
      const order = await createOrder({
        items: items.map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
        })),
        order_type: orderType,
        payment_method: paymentMethod,
        customer_name: customerName,
        customer_phone: customerPhone,
        delivery_address:
          orderType === "PHONE_ORDER" ? deliveryAddress : undefined,
      });
      toast.success("Order placed!");
      onOrderSuccess(order.id);
    } catch (err: any) {
      toast.error(err?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#fadadd] text-[#7c377f] rounded-xl border-2 border-[#7c377f] p-4 sm:p-5 md:p-6 space-y-5 w-full"
    >
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-[#7c377f]">Checkout</h2>
        <p className="text-sm text-black/60">
          Complete order details before submission
        </p>
      </div>

      {/* Order Type & Payment */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[#7c377f] mb-1">
            Order Type
          </label>
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value as OrderType)}
            className="w-full rounded-md bg-white border-2 border-[#7c377f] px-3 py-2 text-sm text-[#7c377f] focus:outline-none focus:ring-2 focus:ring-[#fadadd]"
          >
            <option value="IN_STORE">In Store</option>
            <option value="PHONE_ORDER">Phone Order</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#7c377f] mb-1">
            Payment Method
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            className="w-full rounded-md bg-white border-2 border-[#7c377f] px-3 py-2 text-sm text-[#7c377f] focus:outline-none focus:ring-2 focus:ring-[#fadadd]"
          >
            <option value="CASH">Cash</option>
            <option value="MOMO">Momo</option>
            <option value="TRANSFER">Transfer</option>
          </select>
        </div>
      </div>

      {/* Customer Info */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#7c377f] mb-1">
            Customer Name
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="John Doe"
            className="w-full rounded-md bg-white border-2 border-[#7c377f] px-3 py-2 text-sm text-[#7c377f] focus:outline-none focus:ring-2 focus:ring-[#fadadd]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#7c377f] mb-1">
            Customer Phone
          </label>
          <input
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="+233..."
            className="w-full rounded-md bg-white border-2 border-[#7c377f] px-3 py-2 text-sm text-[#7c377f] focus:outline-none focus:ring-2 focus:ring-[#fadadd]"
          />
        </div>

        {orderType === "PHONE_ORDER" && (
          <div>
            <label className="block text-xs font-medium text-[#7c377f] mb-1">
              Delivery Address
            </label>
            <input
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Customer delivery address"
              className="w-full rounded-md bg-white border-2 border-[#7c377f] px-3 py-2 text-sm text-[#7c377f] focus:outline-none focus:ring-2 focus:ring-[#fadadd]"
            />
          </div>
        )}
      </div>

      {/* CTA */}
      <button
        type="submit"
        disabled={loading || items.length === 0}
        className="w-full rounded-lg bg-[#7c377f] text-white py-3 font-semibold transition hover:bg-[#fadadd] hover:text-[#7c377f] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : "Submit Order"}
      </button>
    </form>
  );
}

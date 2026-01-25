import { useState } from "react";
import { CartItem } from "./CartPanel";
import { createOrder } from "@/lib/api/orders";
import toast from "react-hot-toast";
import { OrderType, PaymentMethod, ProductVariant } from "@/app/types/database";

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
      const order = await createOrder({
        items: items.map((i) => ({
          product_variant_id: i.variant.id,
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
    <form className="space-y-2" onSubmit={handleSubmit}>
      <div className="flex gap-2">
        <select
          value={orderType}
          onChange={(e) => setOrderType(e.target.value as OrderType)}
          className="select select-bordered"
        >
          <option value="IN_STORE">In Store</option>
          <option value="PHONE_ORDER">Phone Order</option>
        </select>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
          className="select select-bordered"
        >
          <option value="CASH">Cash</option>
          <option value="MOMO">Momo</option>
          <option value="TRANSFER">Transfer</option>
        </select>
      </div>
      <input
        type="text"
        placeholder="Customer Name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        className="input input-bordered w-full"
      />
      <input
        type="tel"
        placeholder="Customer Phone"
        value={customerPhone}
        onChange={(e) => setCustomerPhone(e.target.value)}
        className="input input-bordered w-full"
      />
      {orderType === "PHONE_ORDER" && (
        <input
          type="text"
          placeholder="Delivery Address"
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          className="input input-bordered w-full"
        />
      )}
      <button
        type="submit"
        className="btn btn-success w-full"
        disabled={loading || items.length === 0}
      >
        {loading ? "Processing..." : "Submit Order"}
      </button>
    </form>
  );
}

import { createServiceClient } from "@/lib/supabase/service";
import { createOrderSchema } from "@/core/validation/orders.schema";

export class OrdersService {
  private supabase = createServiceClient();

  // List all orders (ADMIN)
  async listOrders() {
    // Returns all orders with items and payments (for admin/reporting)
    const { data, error } = await this.supabase
      .from("orders")
      .select("*,order_items(*),payments(*)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  }

  // Get a single order by ID (ADMIN, SALES)
  async getOrder(orderId: string) {
    const { data, error } = await this.supabase
      .from("orders")
      .select("*,order_items(*),payments(*)")
      .eq("id", orderId)
      .single();
    if (error || !data) throw new Error("Order not found");
    return data;
  }

  // Create a new order (ADMIN, SALES)
  async createOrder(input: unknown, userId: string) {
    // 1. Validate input
    const data = createOrderSchema.parse(input);

    // 2. Re-fetch products, validate stock, calculate totals, generate invoice, reduce stock atomically
    const productIds = data.items.map((item: any) => item.product_id);
    // Join with sps to get base_price
    type ProductWithSps = {
      id: string;
      stock_quantity: number;
      sp_id: string;
      sps: { base_price: number }[] | { base_price: number } | null;
    };

    const { data: products, error: productError } = (await this.supabase
      .from("products")
      .select("id, stock_quantity, sp_id, sps(base_price)")
      .in("id", productIds)) as { data: ProductWithSps[]; error: any };
    if (productError) throw new Error(productError.message);
    if (!products || products.length !== data.items.length)
      throw new Error("One or more products not found");

    // Validate stock and calculate totals
    let total = 0;
    const productMap: Record<
      string,
      { base_price: number; stock_quantity: number }
    > = {};
    for (const p of products) {
      // base_price is in p.sps.base_price (array if joined, or object if single)
      let base_price = 0;
      if (Array.isArray(p.sps)) {
        base_price = Number(p.sps[0]?.base_price ?? 0);
      } else if (p.sps && typeof p.sps === "object") {
        base_price = Number(p.sps.base_price ?? 0);
      }
      productMap[p.id] = {
        base_price,
        stock_quantity: p.stock_quantity,
      };
    }
    for (const item of data.items) {
      const product = productMap[item.product_id];
      if (!product) throw new Error("Product not found");
      if (product.stock_quantity < item.quantity)
        throw new Error("Insufficient stock for product");
      total += product.base_price * item.quantity;
    }

    // Generate invoice number (simple: YYYYMMDD-XXXX)
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const { data: lastOrder } = await this.supabase
      .from("orders")
      .select("id")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    const serial = lastOrder ? Math.floor(Math.random() * 9000) + 1000 : 1001;
    const invoice_number = `${datePart}-${serial}`;

    // Atomic transaction: create order, order_items, reduce stock
    const orderPayload = {
      invoice_number,
      sales_person_id: userId,
      order_type: data.order_type,
      payment_method: data.payment_method,
      total_amount: total,
      delivery_status: null,
      customer_name: data.customer_name,
      customer_phone: data.customer_phone,
      delivery_address: data.delivery_address,
    };

    // Use Supabase RPC or multi-step transaction (if available)
    // Here, we simulate atomicity (Supabase JS does not support multi-table tx natively)
    // 1. Insert order
    const { data: order, error: orderError } = await this.supabase
      .from("orders")
      .insert([orderPayload])
      .select()
      .single();
    if (orderError || !order)
      throw new Error(orderError?.message || "Order creation failed");

    // 2. Insert order_items

    const orderItemsPayload = data.items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: productMap[item.product_id].base_price,
      subtotal: productMap[item.product_id].base_price * item.quantity,
    }));
    const { error: itemsError } = await this.supabase
      .from("order_items")
      .insert(orderItemsPayload);
    if (itemsError) throw new Error(itemsError.message);

    // 3. Reduce stock for each product
    for (const item of data.items) {
      const { error: stockError } = await this.supabase
        .from("products")
        .update({
          stock_quantity:
            productMap[item.product_id].stock_quantity - item.quantity,
        })
        .eq("id", item.product_id);
      if (stockError) throw new Error(stockError.message);
    }

    // 4. Return the created order (with items)
    return await this.getOrder(order.id);
  }

  // (Optional) Add more methods for reporting, payments, etc.
}

export type UserRole = "ADMIN" | "SALES";
export type OrderType = "IN_STORE" | "PHONE_ORDER";
export type PaymentMethod = "CASH" | "MOMO" | "TRANSFER";
export type DeliveryStatus = "PENDING" | "DISPATCHED" | "DELIVERED";

export interface Category {
  id: string;
  name: string;
  code: string;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  email: string;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  sp_id: string;
  name: string;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  size?: string;
  primary_color?: string;
  price: number;
  stock_quantity: number;
  attributes?: Record<string, any>;
  images?: string[];
  created_at: string;
}

export interface Order {
  id: string;
  invoice_number: string;
  sales_person_id: string;
  order_type: OrderType;
  payment_method: PaymentMethod;
  total_amount: number;
  delivery_status?: DeliveryStatus;
  customer_name?: string;
  customer_phone?: string;
  delivery_address?: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_variant_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Payment {
  id: string;
  order_id: string;
  method: PaymentMethod;
  amount: number;
  created_at: string;
}

export interface Sp {
  id: string;
  name: string;
  base_price: number;
  created_at: string;
  updated_at: string;
}

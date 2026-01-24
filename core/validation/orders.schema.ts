import { z } from "zod";

export const createOrderSchema = z.object({
  order_type: z.enum(["IN_STORE", "PHONE_ORDER"]),
  payment_method: z.enum(["CASH", "MOMO", "TRANSFER"]),
  customer_name: z.string().optional(),
  customer_phone: z.string().optional(),
  delivery_address: z.string().optional(),
  items: z
    .array(
      z.object({
        product_variant_id: z.string().uuid(),
        quantity: z.number().int().min(1),
      }),
    )
    .min(1),
});

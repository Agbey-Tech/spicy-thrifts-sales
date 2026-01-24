import { z } from "zod";

export const createVariantSchema = z.object({
  product_id: z.string().uuid(),
  sku: z.string().min(3),
  size: z.string().optional(),
  primary_color: z.string().optional(),
  price: z.number().positive(),
  stock_quantity: z.number().int().min(0),
  attributes: z.record(z.any(), z.any()).optional(),
});

export const updateVariantSchema = z.object({
  price: z.number().positive().optional(),
  stock_quantity: z.number().int().min(0).optional(),
  attributes: z.record(z.any(), z.any()).optional(),
});

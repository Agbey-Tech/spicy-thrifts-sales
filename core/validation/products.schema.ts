import { z } from "zod";

export const createProductSchema = z.object({
  category_id: z.string().uuid(),
  sp_id: z.string().uuid(),
  stock_quantity: z.number().int().min(0),
});

export const updateProductSchema = z.object({
  category_id: z.string().uuid().optional(),
  sp_id: z.string().uuid().optional(),
  stock_quantity: z.number().int().min(0).optional(),
});

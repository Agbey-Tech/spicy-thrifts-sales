import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2),
  category_id: z.string().uuid(),
  description: z.string().optional(),
  base_price: z.number().positive().optional(),
  is_unique: z.boolean(),
  images: z.array(z.string().url()).optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  base_price: z.number().positive().optional(),
  images: z.array(z.string().url()).optional(),
});

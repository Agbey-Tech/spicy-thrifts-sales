import { z } from "zod";

export const createSpSchema = z.object({
  name: z.string().min(2),
  base_price: z.number().positive(),
});

export const updateSpSchema = z.object({
  name: z.string().min(2).optional(),
  base_price: z.number().positive().optional(),
});

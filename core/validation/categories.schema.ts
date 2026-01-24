import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2).max(5),
});

export const updateCategorySchema = z.object({
  name: z.string().min(2).optional(),
  code: z.string().min(2).max(5).optional(),
});

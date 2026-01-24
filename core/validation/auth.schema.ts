import { z } from "zod";

export const updateUserSchema = z.object({
  full_name: z.string().min(2).optional(),
  role: z.enum(["ADMIN", "SALES"]).optional(),
  is_active: z.boolean().optional(),
});


export const createUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    full_name: z.string().min(2),
    role: z.enum(["ADMIN", "SALES"]),
});
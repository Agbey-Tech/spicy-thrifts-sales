import { z } from "zod";

export const createPaymentSchema = z.object({
  order_id: z.string().uuid(),
  method: z.enum(["CASH", "MOMO", "TRANSFER"]),
  amount: z.number().positive(),
});

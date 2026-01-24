import { z } from "zod";

export const salesReportQuerySchema = z.object({
  from: z.string(),
  to: z.string(),
});

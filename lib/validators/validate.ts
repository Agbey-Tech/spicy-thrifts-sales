import { ZodSchema } from "zod";

export function validate<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.issues.map((e) => e.message).join(", "));
  }
  return result.data;
}

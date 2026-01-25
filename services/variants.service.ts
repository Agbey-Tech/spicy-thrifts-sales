import { createServiceClient } from "@/lib/supabase/service";
import {
  updateVariantSchema,
  createVariantSchema,
} from "@/core/validation/variants.schema";

export class VariantsService {
  private supabase = createServiceClient();

  // 1. Validate product existence
  async validateProduct(productId: string) {
    const { data, error } = await this.supabase
      .from("products")
      .select("id, is_unique")
      .eq("id", productId)
      .single();
    if (error || !data) throw new Error("Product does not exist");
    return data;
  }

  // 2. Enforce SKU uniqueness
  async checkSkuUnique(sku: string) {
    const { data, error } = await this.supabase
      .from("product_variants")
      .select("id")
      .eq("sku", sku)
      .single();
    if (error && error.details?.includes("0 rows")) return true;
    if (data) throw new Error("SKU must be unique");
    return true;
  }

  // 3. Enforce unique-product stock rule
  async enforceUniqueProductStockRule(productId: string, stock: number) {
    const product = await this.validateProduct(productId);
    if (product.is_unique && stock > 1) {
      throw new Error("Unique products cannot have stock greater than 1");
    }
    return true;
  }

  // 4. Control field updates based on role
  async updateVariant(
    variantId: string,
    input: unknown,
    role: "ADMIN" | "SALES" | any,
  ) {
    const data = updateVariantSchema.parse(input);
    // SALES can only update stock_quantity and price
    if (role === "SALES") {
      const allowed: any = {};
      if ("stock_quantity" in data)
        allowed.stock_quantity = data.stock_quantity;
      if ("price" in data) allowed.price = data.price;
      if (Object.keys(allowed).length === 0)
        throw new Error("SALES can only update stock_quantity or price");
      const { error, data: updated } = await this.supabase
        .from("product_variants")
        .update(allowed)
        .eq("id", variantId)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return updated;
    }
    // ADMIN can update all editable fields
    const { error, data: updated } = await this.supabase
      .from("product_variants")
      .update(data)
      .eq("id", variantId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return updated;
  }

  // 5. Fetch variants for POS
  async listVariants(filters?: Record<string, unknown>) {
    let query = this.supabase.from("product_variants").select("*,product(*)");
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
  }

  // Create variant
  async createVariant(input: unknown) {
    const data = createVariantSchema.parse(input);
    await this.validateProduct(data.product_id);
    await this.checkSkuUnique(data.sku);
    await this.enforceUniqueProductStockRule(
      data.product_id,
      data.stock_quantity,
    );
    if (data.stock_quantity < 0) throw new Error("Stock can never be negative");
    const { error, data: created } = await this.supabase
      .from("product_variants")
      .insert([data])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return created;
  }
}

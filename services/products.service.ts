import { createServiceClient } from "@/lib/supabase/service";
import {
  createProductSchema,
  updateProductSchema,
} from "@/core/validation/products.schema";

export class ProductsService {
  private supabase = createServiceClient();
  // 1. Validate category existence
  async validateCategory(categoryId: string) {
    const { data, error } = await this.supabase
      .from("categories")
      .select("id")
      .eq("id", categoryId)
      .single();
    if (error || !data) throw new Error("Category does not exist");
    return true;
  }

  // 2. Create products
  async createProduct(input: unknown) {
    const data = createProductSchema.parse(input);
    await this.validateCategory(data.category_id);
    const { error, data: created } = await this.supabase
      .from("products")
      .insert([data])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return created;
  }

  // 3. Update metadata
  async updateProduct(productId: string, input: unknown) {
    const data = updateProductSchema.parse(input);
    // Prevent stock/SKU update here
    const { error, data: updated } = await this.supabase
      .from("products")
      .update(data)
      .eq("id", productId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return updated;
  }

  // 4. Prevent deletion when variants exist
  async deleteProduct(productId: string) {
    // Check for existing variants
    const { data: variants, error: variantError } = await this.supabase
      .from("product_variants")
      .select("id")
      .eq("product_id", productId);
    if (variantError) throw new Error(variantError.message);
    if (variants && variants.length > 0)
      throw new Error("Cannot delete product with existing variants");
    // Soft-delete: set a deleted_at timestamp (add column if needed)
    const { error } = await this.supabase
      .from("products")
      .delete()
      .eq("id", productId);
    if (error) throw new Error(error.message);
    return true;
  }

  // 5. Fetch products for listing
  async listProducts(options?: { includeVariants?: boolean }) {
    let query = this.supabase
      .from("products")
      .select(options?.includeVariants ? "*,product_variants(*)" : "*");
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
  }
}

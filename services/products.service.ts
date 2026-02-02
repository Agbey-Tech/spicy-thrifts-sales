import { createServiceClient } from "@/lib/supabase/service";
import {
  createProductSchema,
  updateProductSchema,
} from "@/core/validation/products.schema";

export class ProductsService {
  private supabase = createServiceClient();

  // 1. Validate category and sp existence
  async validateCategory(categoryId: string) {
    const { data, error } = await this.supabase
      .from("categories")
      .select("id, name")
      .eq("id", categoryId)
      .single();
    if (error || !data) throw new Error("Category does not exist");
    return data;
  }

  async validateSp(spId: string) {
    const { data, error } = await this.supabase
      .from("sps")
      .select("id, name, base_price")
      .eq("id", spId)
      .single();
    if (error || !data) throw new Error("SP does not exist");
    return data;
  }

  // 2. Create product (auto-generate name, set base_price from sp, is_unique always false)
  async createProduct(input: unknown) {
    const data = createProductSchema.parse(input);
    const category = await this.validateCategory(data.category_id);
    const sp = await this.validateSp(data.sp_id);
    // Auto-generate name: "{category.name} - {sp.name}"
    const name = `${category.name} - ${sp.name}`;
    // Insert product
    const { error, data: created } = await this.supabase
      .from("products")
      .insert([
        {
          ...data,
          name,
          sp_id: sp.id,
        },
      ])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return created;
  }

  // 3. Update product (auto-update name and base_price if sp/category changes)
  async updateProduct(productId: string, input: unknown) {
    const data = updateProductSchema.parse(input);
    let updateData: any = { ...data };
    // If category or sp is being updated, fetch their info and update name/base_price
    if (data.category_id || data.sp_id) {
      // Get current product
      const { data: current, error: curErr } = await this.supabase
        .from("products")
        .select("category_id, sp_id")
        .eq("id", productId)
        .single();
      if (curErr || !current) throw new Error("Product not found");
      const categoryId = data.category_id || current.category_id;
      const spId = data.sp_id || current.sp_id;
      const category = await this.validateCategory(categoryId);
      const sp = await this.validateSp(spId);
      updateData.name = `${category.name} - ${sp.name}`;
      updateData.updated_at = new Date().toISOString();
    }
    const { error, data: updated } = await this.supabase
      .from("products")
      .update(updateData)
      .eq("id", productId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return updated;
  }

  // 4. Delete product (no variant check needed)
  async deleteProduct(productId: string) {
    const { error } = await this.supabase
      .from("products")
      .delete()
      .eq("id", productId);
    if (error) {
      const msg = error.message?.toLowerCase() || "";

      if (
        msg.includes("duplicate") ||
        msg.includes("pk") ||
        msg.includes("primary key")
      ) {
        throw new Error(
          "Deleting this product will delete all orders with this reference. Hence, product cannot be deleted.",
        );
      }
      throw new Error(error.message);
    }
    return true;
  }

  // 5. Fetch products for listing (no variants)
  async listProducts() {
    const { data, error } = await this.supabase.from("products").select("*");
    if (error) throw new Error(error.message);
    return data;
  }
}

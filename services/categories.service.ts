import { createServiceClient } from "@/lib/supabase/service";
import {
  createCategorySchema,
  updateCategorySchema,
} from "@/core/validation/categories.schema";

export class CategoriesService {
  private supabase = createServiceClient();

  // List all categories
  async listCategories() {
    const { data, error } = await this.supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });
    if (error) throw new Error(error.message);
    return data;
  }

  // Create a new category
  async createCategory(input: unknown) {
    const data = createCategorySchema.parse(input);
    const { data: created, error } = await this.supabase
      .from("categories")
      .insert([data])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return created;
  }

  // Update a category
  async updateCategory(categoryId: string, input: unknown) {
    const data = updateCategorySchema.parse(input);
    const { data: updated, error } = await this.supabase
      .from("categories")
      .update(data)
      .eq("id", categoryId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return updated;
  }
}

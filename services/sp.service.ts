import { createServiceClient } from "@/lib/supabase/service";
import { createSpSchema, updateSpSchema } from "@/core/validation/sp.schema";

export class SpService {
  private supabase = createServiceClient();

  // Create SP
  async createSp(input: unknown) {
    const data = createSpSchema.parse(input);
    const { error, data: created } = await this.supabase
      .from("sps")
      .insert([data])
      .select()
      .single();
    if (error) {
      // Check for duplicate error (Postgres unique_violation is '23505')
      if (
        error.code === "23505" ||
        error.message.toLowerCase().includes("duplicate")
      ) {
        throw new Error("SP with the provided unique fields already exists.");
      }
      throw new Error(error.message);
    }
    return created;
  }

  // Update SP
  async updateSp(spId: string, input: unknown) {
    const data = updateSpSchema.parse(input);
    const { error, data: updated } = await this.supabase
      .from("sps")
      .update(data)
      .eq("id", spId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return updated;
  }

  // Delete SP
  async deleteSp(spId: string) {
    const { error } = await this.supabase.from("sps").delete().eq("id", spId);
    if (error) throw new Error(error.message);
    return true;
  }

  // List all SPs
  async listSps() {
    const { data, error } = await this.supabase.from("sps").select("*");
    if (error) throw new Error(error.message);
    return data;
  }
}

import { createServiceClient } from "@/lib/supabase/service";

export class AuthService {
  private supabase = createServiceClient();

  async getProfile(userId: string) {
    // Fetch user profile from Supabase (role, full_name, is_active)
    const { data, error } = await this.supabase
      .from("profiles")
      .select("role, full_name, is_active")
      .eq("id", userId)
      .single();
    if (error || !data) throw new Error("Profile not found");
    return data;
  }

  async updateUser(
    userId: string,
    updates: { full_name?: string; role?: string; is_active?: boolean },
  ) {
    // Only allow updating full_name, role, is_active
    const { data, error } = await this.supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select("id, full_name, role, is_active")
      .single();
    if (error || !data) throw new Error("Failed to update user");
    return data;
  }

  async listUsers() {
    // List all users with profile info (id, email, role, full_name, is_active)
    // Implementation to be completed as per Supabase setup
    throw new Error("Not implemented");
  }

  async createUser(input: {
    email: string;
    password: string;
    full_name: string;
    role: string;
  }) {
    // Create a new user and profile (admin only)
    // Implementation to be completed as per Supabase setup
    throw new Error("Not implemented");
  }

  async logout() {
    // No-op for backend, handled by Supabase client on frontend
    return true;
  }
}

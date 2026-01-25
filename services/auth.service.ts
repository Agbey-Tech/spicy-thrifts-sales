import { createServiceClient } from "@/lib/supabase/service";
import { SignInInput, SignUpInput } from "@/core/validation/auth.schema";
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
    role: string;
    full_name: string;
  }) {
    // Sign up user in Supabase auth and create profile
    const { email, password, role, full_name } = input;

    // Create user in Supabase Auth (no email verification)
    const { data: userData, error: userError } =
      await this.supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { role: role },
      });

    if (userError || !userData?.user?.id) {
      throw new Error(userError?.message || "Failed to create user");
    }

    const userId = userData.user.id;

    // Create profile in 'profiles' table
    const { error: profileError } = await this.supabase
      .from("profiles")
      .insert([
        {
          id: userId,
          full_name,
          role,
          is_active: true,
          created_at: new Date().toISOString(),
        },
      ]);

    if (profileError) {
      // Optionally: rollback user creation in auth
      throw new Error(profileError.message || "Failed to create profile");
    }

    return { id: userId, email, full_name, role, is_active: true };
  }

  async signUp(input: SignUpInput) {
    const { secret_key, ...create_input } = input;
    const SIGNUP_SECRET = process.env.SIGNUP_SECRET;
    console.log("Secret Key: ", SIGNUP_SECRET);

    if (secret_key !== SIGNUP_SECRET) {
      throw new Error("Unauthorized");
    }

    return this.createUser(create_input);
  }

  async logout() {
    // No-op for backend, handled by Supabase client on frontend
    return true;
  }

  async login(input: SignInInput) {
    //this is also handled in the frontend
  }
}

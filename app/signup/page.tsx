"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp, getProfile } from "@/lib/api/auth";
import { useUserStore } from "@/lib/auth/userStore";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const setUser = useUserStore((s) => s.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"ADMIN" | "SALES">("SALES");
  const [secretKey, setSecretKey] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signUp({
        email,
        password,
        full_name: fullName,
        role,
        secret_key: secretKey,
      });

      toast.success("Account created successfully");

      router.replace("/login");
    } catch (err: any) {
      setError(err?.message || "Signup failed");
      toast.error(err?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          Spicy Thrifts POS Signup
        </h1>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Full Name</label>
          <input
            className="w-full border px-3 py-2 rounded"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Role</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={role}
            onChange={(e) => setRole(e.target.value as "ADMIN" | "SALES")}
            disabled={loading}
          >
            <option value="SALES">Sales</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Secret Key</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {error && (
          <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
        )}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded font-semibold disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}

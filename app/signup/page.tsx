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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      </div>

      {/* Signup Container */}
      <div className="relative z-10 w-full max-w-md px-6 py-8">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-10 border border-gray-200/50">
          {/* Brand Logo/Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">
              Spicy Thrifts
            </h1>
            <p className="text-sm text-gray-600 uppercase tracking-widest">
              Create Your Account
            </p>
          </div>

          <div className="space-y-5">
            {/* Full Name Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Full Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none transition-colors bg-white text-gray-900 placeholder:text-gray-400"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                required
                autoFocus
                disabled={loading}
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none transition-colors bg-white text-gray-900 placeholder:text-gray-400"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                required
                disabled={loading}
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none transition-colors bg-white text-gray-900 placeholder:text-gray-400"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                required
                disabled={loading}
              />
            </div>

            {/* Role Select */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Role
              </label>
              <select
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none transition-colors bg-white text-gray-900 appearance-none cursor-pointer"
                value={role}
                onChange={(e) => setRole(e.target.value as "ADMIN" | "SALES")}
                disabled={loading}
              >
                <option value="SALES">Sales Associate</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>

            {/* Secret Key Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Secret Key
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none transition-colors bg-white text-gray-900 placeholder:text-gray-400"
                placeholder="Enter secret key"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                required
                disabled={loading}
              />
              <p className="mt-1 text-xs text-gray-500">
                Required for account creation
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-lg uppercase tracking-widest text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => router.push("/login")}
                className="text-gray-900 font-semibold hover:underline"
                disabled={loading}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

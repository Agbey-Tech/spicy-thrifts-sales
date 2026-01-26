import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Background Image with Overlay - Fixed position */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/65 backdrop-blur-sm"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl px-6 py-12">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-12 border border-gray-200/50">
          {/* Brand Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-3">
              Spicy Thrifts
            </h1>
            <p className="text-lg text-gray-600 uppercase tracking-widest mb-2">
              Point of Sale System
            </p>
            <div className="w-24 h-1 bg-gray-900 mx-auto mt-4"></div>
          </div>

          {/* Description */}
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Welcome to the Spicy Thrifts POS management system. This platform
              is designed exclusively for internal staff to manage sales,
              inventory, and operations.
            </p>
            <p className="text-gray-600 text-base">
              Sign in to access your dashboard or create a new staff account
              with the proper authorization.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/login"
              className="flex items-center justify-center px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-lg uppercase tracking-widest text-sm transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Sign In to Dashboard
            </Link>
            <Link
              href="/signup"
              className="flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-bold rounded-lg uppercase tracking-widest text-sm transition-all duration-200 border-2 border-gray-900 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Create Staff Account
            </Link>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-300 my-8"></div>

          {/* Contact Section */}
          <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Need Technical Support?
            </h2>
            <p className="text-gray-600 text-center mb-6">
              If you're experiencing issues or need assistance with the system,
              please contact our developer.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="mailto:ziglacity@gmail.com"
                className="flex items-center gap-3 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-all duration-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Email Developer
              </a>

              <a
                href="tel:+233592194480"
                className="flex items-center gap-3 px-6 py-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-lg border-2 border-gray-900 transition-all duration-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                Call Support
              </a>
            </div>

            <p className="text-sm text-gray-500 text-center mt-4">
              Response time: Within 24 hours
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-300 text-center">
            <p className="text-sm text-gray-500">
              © 2026 Spicy Thrifts. Internal Use Only.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              For main website, visit{" "}
              <a
                href="https://spicythrifts.com"
                className="text-gray-900 hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                spicythrifts.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

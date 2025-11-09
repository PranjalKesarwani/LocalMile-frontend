import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, handleLogin } from "../../configs/apiClient";
import { BASE_COLORS } from "../../constant";

interface LoginForm {
  mobile: string;
  email: string;
  password: string;
}

const AdminAuthPage = () => {
  const [form, setForm] = useState<LoginForm>({
    mobile: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post("/admin/login", form);

      if (response.status === 200) {
        // Store tokens and user info
        handleLogin(response);

        // Navigate to admin dashboard
        navigate("/admin-dashboard");
      }
    } catch (err: any) {
      if (err.response) {
        if (err.response.status === 401) {
          setError(
            "Invalid credentials. Please check your email and password."
          );
        } else if (err.response.status === 404) {
          setError("Admin account not found. Please contact support.");
        } else if (err.response.status === 403) {
          setError("Access denied. Only admins can login here.");
        } else if (err.response.status === 500) {
          setError("Internal server error. Please try again later.");
        } else {
          setError(
            err.response.data?.message || "An error occurred. Please try again."
          );
        }
      } else {
        setError("Network error. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  return (
    <div
      className="w-screen h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${BASE_COLORS.primary}15 0%, ${BASE_COLORS.primary}05 50%, ${BASE_COLORS.white} 100%)`,
      }}
    >
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 animate-pulse"
          style={{ backgroundColor: BASE_COLORS.primary }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-20 animate-pulse"
          style={{
            backgroundColor: BASE_COLORS.primary,
            animationDelay: "1s",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1
            className="text-6xl md:text-7xl font-bold tracking-tight mb-3 animate-fade-in"
            style={{
              color: BASE_COLORS.primary,
              textShadow: `0 4px 20px ${BASE_COLORS.primary}40`,
            }}
          >
            LocalMile
          </h1>
          <p
            className="text-xl font-medium"
            style={{ color: BASE_COLORS.darkText }}
          >
            Admin Login
          </p>
          <div
            className="w-20 h-1 rounded-full mx-auto mt-3"
            style={{ backgroundColor: BASE_COLORS.primary }}
          />
        </div>

        {/* Login Card */}
        <div
          className="rounded-2xl shadow-2xl p-8 backdrop-blur-sm animate-fade-in"
          style={{
            backgroundColor: `${BASE_COLORS.white}E6`,
            border: `2px solid ${BASE_COLORS.primary}20`,
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mobile Input */}
            <div className="space-y-2">
              <label
                htmlFor="mobile"
                className="block text-sm font-semibold"
                style={{ color: BASE_COLORS.darkText }}
              >
                Mobile Number
              </label>
              <div className="relative">
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  autoComplete="tel"
                  placeholder="Enter 10-digit mobile number"
                  value={form.mobile}
                  onChange={handleInputChange}
                  pattern="[0-9]{10}"
                  maxLength={10}
                  minLength={10}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: BASE_COLORS.white,
                    borderColor: error
                      ? BASE_COLORS.error
                      : `${BASE_COLORS.primary}30`,
                    color: BASE_COLORS.darkText,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = BASE_COLORS.primary;
                    e.target.style.boxShadow = `0 0 0 3px ${BASE_COLORS.primary}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = `${BASE_COLORS.primary}30`;
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold"
                style={{ color: BASE_COLORS.darkText }}
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email address"
                  value={form.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: BASE_COLORS.white,
                    borderColor: error
                      ? BASE_COLORS.error
                      : `${BASE_COLORS.primary}30`,
                    color: BASE_COLORS.darkText,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = BASE_COLORS.primary;
                    e.target.style.boxShadow = `0 0 0 3px ${BASE_COLORS.primary}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = `${BASE_COLORS.primary}30`;
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold"
                style={{ color: BASE_COLORS.darkText }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 pr-12 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: BASE_COLORS.white,
                    borderColor: error
                      ? BASE_COLORS.error
                      : `${BASE_COLORS.primary}30`,
                    color: BASE_COLORS.darkText,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = BASE_COLORS.primary;
                    e.target.style.boxShadow = `0 0 0 3px ${BASE_COLORS.primary}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = `${BASE_COLORS.primary}30`;
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-opacity-10 transition-colors"
                  style={{ color: BASE_COLORS.gray }}
                >
                  {showPassword ? (
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
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div
                className="p-3 rounded-lg animate-fade-in"
                style={{
                  backgroundColor: `${BASE_COLORS.error}15`,
                  border: `1px solid ${BASE_COLORS.error}40`,
                }}
              >
                <p className="text-sm" style={{ color: BASE_COLORS.error }}>
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{
                backgroundColor: loading
                  ? BASE_COLORS.gray
                  : BASE_COLORS.primary,
                color: BASE_COLORS.white,
                boxShadow: loading
                  ? "none"
                  : `0 4px 15px ${BASE_COLORS.primary}40`,
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Log In"
              )}
            </button>
          </form>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-base font-medium transition-colors hover:underline"
            style={{ color: BASE_COLORS.primary }}
          >
            ← Go Back
          </Link>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AdminAuthPage;

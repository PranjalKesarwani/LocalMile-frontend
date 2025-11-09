import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, tokenStorage } from "../configs/apiClient";
import { BASE_COLORS } from "../constant";

interface UserInfo {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  [key: string]: any;
}

const WaitForUserAuth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Fetch user info using API client
    const fetchUserInfo = async () => {
      console.log("fetchUserInfo");
      try {
        setLoading(true);
        // Check if token exists in localStorage
        const token = tokenStorage.getToken();
        const storedUserInfo = tokenStorage.getUserInfo();

        // If user info is already stored, use it
        if (storedUserInfo && token) {
          setUserInfo(storedUserInfo);
          if (storedUserInfo.role) {
            setTimeout(() => {
              navigateBasedOnRole(storedUserInfo.role);
            }, 2000);
          } else {
            navigate("/admin-auth");
          }
          setLoading(false);
          return;
        }

        // Fetch from API using the new API client
        const response = await api.get("/admin/get-admin-info");

        if (response.status === 200 && response.data) {
          setUserInfo(response.data);
          tokenStorage.setUserInfo(response.data.adminInfo);

          // If user is authenticated, navigate based on role
          if (response.data.role) {
            setTimeout(() => {
              navigateBasedOnRole(response.data.role);
            }, 2000);
          } else {
            navigate("/admin-auth");
          }
        }
      } catch (err: any) {
        // If user is not authenticated, navigate to auth page
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError("Not authenticated");
          tokenStorage.clearAll();
          setTimeout(() => {
            navigate("/admin-auth");
          }, 2000);
        } else {
          setError("Unable to verify authentication");
          setTimeout(() => {
            navigate("/admin-auth");
          }, 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    // Helper function to navigate based on role
    const navigateBasedOnRole = (role: string) => {
      if (role === "superadmin") {
        navigate("/admin-dashboard");
      } else if (role === "seller") {
        navigate("/seller-dashboard");
      } else if (role === "buyer") {
        navigate("/buyer-landing");
      } else if (role === "delivery") {
        navigate("/delivery-dashboard");
      } else {
        navigate("/admin-auth");
      }
    };

    fetchUserInfo();

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 80);

    return () => clearInterval(progressInterval);
  }, [navigate]);

  return (
    <div
      className="w-screen h-screen flex flex-col items-center justify-center relative overflow-hidden"
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
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10"
          style={{ backgroundColor: BASE_COLORS.primary }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-8 px-6">
        {/* Logo/Brand */}
        <div className="flex flex-col items-center gap-4">
          <div
            className="text-8xl md:text-9xl font-bold tracking-tight mb-2 animate-fade-in"
            style={{
              color: BASE_COLORS.primary,
              textShadow: `0 4px 20px ${BASE_COLORS.primary}40`,
            }}
          >
            LocalMile
          </div>
          <div
            className="w-24 h-1 rounded-full"
            style={{ backgroundColor: BASE_COLORS.primary }}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center gap-6 mt-8">
            <div className="relative">
              {/* Spinner */}
              <div
                className="w-16 h-16 border-4 rounded-full animate-spin"
                style={{
                  borderColor: `${BASE_COLORS.primary}30`,
                  borderTopColor: BASE_COLORS.primary,
                }}
              />
            </div>
            <p
              className="text-xl md:text-2xl font-medium animate-pulse"
              style={{ color: BASE_COLORS.darkText }}
            >
              Please wait...
            </p>
          </div>
        )}

        {/* User Info Display */}
        {userInfo && !loading && (
          <div
            className="mt-6 p-6 rounded-2xl shadow-lg backdrop-blur-sm animate-fade-in"
            style={{
              backgroundColor: `${BASE_COLORS.white}E6`,
              border: `2px solid ${BASE_COLORS.primary}30`,
            }}
          >
            <p
              className="text-lg font-semibold mb-2"
              style={{ color: BASE_COLORS.darkText }}
            >
              Welcome back!
            </p>
            {userInfo.name && (
              <p className="text-base" style={{ color: BASE_COLORS.gray }}>
                {userInfo.name}
              </p>
            )}
            {userInfo.email && (
              <p className="text-sm" style={{ color: BASE_COLORS.gray }}>
                {userInfo.email}
              </p>
            )}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div
            className="mt-6 p-4 rounded-xl animate-fade-in"
            style={{
              backgroundColor: `${BASE_COLORS.error}15`,
              border: `1px solid ${BASE_COLORS.error}40`,
            }}
          >
            <p className="text-base" style={{ color: BASE_COLORS.error }}>
              {error}
            </p>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mt-8 w-64 md:w-80">
          <div
            className="h-1 rounded-full overflow-hidden"
            style={{ backgroundColor: `${BASE_COLORS.primary}20` }}
          >
            <div
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
                backgroundColor: BASE_COLORS.primary,
                boxShadow: `0 0 10px ${BASE_COLORS.primary}60`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Add custom animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
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

export default WaitForUserAuth;

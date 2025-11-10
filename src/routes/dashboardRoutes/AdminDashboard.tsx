import NavAdmin from "../../components/admin/NavAdmin";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import AnalyticsAdmin from "../../components/admin/AnalyticsAdmin";
import DeliveryAdmin from "../../components/admin/DeliveryAdmin";
import RequestsAdmin from "../../components/admin/RequestsAdmin";
import AllSellersAdmin from "../../components/admin/AllSellersAdmin";
import ShopCategoriesForm from "../../components/admin/shopCategoriesForm.tsx/ShopCategoriesForm";
import { BASE_COLORS } from "../../constant";
import { useState } from "react";

const AdminDashboard = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const menuItems = [
    {
      path: "/admin-dashboard",
      label: "Analytics",
      icon: (
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      path: "/admin-dashboard/delivery-manager",
      label: "Delivery Manager",
      icon: (
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
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
          />
        </svg>
      ),
    },
    {
      path: "/admin-dashboard/shop-category-manager",
      label: "Shop Categories",
      icon: (
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
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
    },
    {
      path: "/admin-dashboard/all-requests",
      label: "All Requests",
      icon: (
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      path: "/admin-dashboard/all-sellers",
      label: "All Sellers",
      icon: (
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
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
  ];

  const isActive = (path: string) => {
    if (path === "/admin-dashboard") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div
      className="w-screen h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: BASE_COLORS.background }}
    >
      <NavAdmin />
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div
          className={`h-full overflow-y-auto transition-all duration-300 ${
            isCollapsed ? "w-20" : "w-64"
          }`}
          style={{ backgroundColor: BASE_COLORS.white }}
        >
          <div className={`p-4 ${isCollapsed ? "px-2" : ""}`}>
            <div className={`mb-6 ${isCollapsed ? "flex justify-center" : ""}`}>
              {!isCollapsed && (
                <h2
                  className="text-lg font-bold mb-1"
                  style={{ color: BASE_COLORS.darkText }}
                >
                  Navigation
                </h2>
              )}
              <div className="flex items-center justify-between">
                {!isCollapsed && (
                  <div
                    className="h-0.5 w-12 rounded-full"
                    style={{ backgroundColor: BASE_COLORS.primary }}
                  />
                )}
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="p-2 rounded-lg hover:opacity-80 transition-all duration-200"
                  style={{
                    backgroundColor: isCollapsed
                      ? `${BASE_COLORS.primary}15`
                      : "transparent",
                    color: BASE_COLORS.primary,
                  }}
                  title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {isCollapsed ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center ${
                      isCollapsed ? "justify-center px-2" : "gap-3 px-4"
                    } py-3 rounded-lg transition-all duration-200 ${
                      active ? "font-semibold" : "font-medium"
                    }`}
                    style={{
                      backgroundColor: active
                        ? `${BASE_COLORS.primary}15`
                        : "transparent",
                      color: active
                        ? BASE_COLORS.primary
                        : BASE_COLORS.darkText,
                      position: "relative",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = `${BASE_COLORS.primary}08`;
                      }
                      if (isCollapsed) {
                        setHoveredItem(item.path);
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                      setHoveredItem(null);
                    }}
                    title={isCollapsed ? item.label : ""}
                  >
                    <span
                      style={{
                        color: active
                          ? BASE_COLORS.primary
                          : BASE_COLORS.gray,
                        minWidth: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        {active && (
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: BASE_COLORS.primary }}
                          />
                        )}
                      </>
                    )}
                    {/* Tooltip when collapsed */}
                    {isCollapsed && hoveredItem === item.path && (
                      <div
                        style={{
                          position: "absolute",
                          left: "100%",
                          marginLeft: "8px",
                          padding: "6px 12px",
                          backgroundColor: BASE_COLORS.white,
                          color: BASE_COLORS.darkText,
                          borderRadius: "6px",
                          fontSize: "14px",
                          whiteSpace: "nowrap",
                          zIndex: 1000,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                          pointerEvents: "none",
                        }}
                      >
                        {item.label}
                      </div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<AnalyticsAdmin />} />
            <Route
              path="/shop-category-manager"
              element={<ShopCategoriesForm />}
            />
            <Route path="/delivery-manager" element={<DeliveryAdmin />} />
            <Route path="/all-requests" element={<RequestsAdmin />} />
            <Route path="/all-sellers" element={<AllSellersAdmin />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

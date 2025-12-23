import { useEffect, useState } from "react";
import { BASE_COLORS } from "../../constant";
import { toast } from "react-toastify";
import { api } from "../../configs/apiClient";

interface Seller {
  _id: string;
  adminApproval: boolean;
  sellerName: string;
  shopName: string;
  basicAddress: string;
  mobile: string;
  profilePic: string;
  createdAt: string;
  email: string;
  upiId: string;
  // optional, backend may provide a status or isActive/blocked flags
  status?: "active" | "inactive" | "pending";
  // legacy/alternate fields we may map from
  phone?: string;
  name?: string;
  joinDate?: string;
}

interface DashboardStats {
  totalSellers: number;
  activeSellers: number;
  pendingSellers: number;
  sellersWithoutShop: number;
  sellersWithShopNoProduct: number;
}

const AllSellersAdmin = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [filter, setFilter] = useState<
    "all" | "active" | "inactive" | "pending"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(20);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalSellers: 0,
    activeSellers: 0,
    pendingSellers: 0,
    sellersWithoutShop: 0,
    sellersWithShopNoProduct: 0,
  });
  // map backend seller object to our Seller interface safely
  const normalizeSeller = (r: any): Seller => {
    const mobile = r.mobile || r.phone || "";
    const sellerName = r.sellerName || r.name || "";
    const basicAddress = r.basicAddress || r.shopAddress || "";
    const createdAt = r.createdAt || r.joinDate || new Date().toISOString();

    // derive status if backend doesn't provide it explicitly
    const status =
      r.status ||
      (typeof r.adminApproval === "boolean"
        ? r.adminApproval
          ? "active"
          : "pending"
        : r.isActive === false
        ? "inactive"
        : undefined);

    return {
      _id: r._id || r.id,
      adminApproval: Boolean(r.adminApproval),
      sellerName,
      shopName: r.shopName || r.shop || "",
      basicAddress,
      mobile,
      profilePic: r.profilePic || r.pic || "",
      createdAt,
      email: r.email || "",
      upiId: r.upiId || "",
      status,
      // keep legacy fields for safety
      phone: r.phone,
      name: r.name,
      joinDate: r.joinDate,
    };
  };

  const getAllSellers = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get("/admin/get-all-sellers", {
        params: { page, limit },
      });

      if (res.status === 200 && Array.isArray(res.data?.sellers)) {
        setSellers(res.data.sellers.map(normalizeSeller));
        setTotalPages(res.data.pagination.totalPages);
        setCurrentPage(res.data.pagination.currentPage);
      } else {
        toast.error("Unexpected response from server");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch sellers");
    } finally {
      setLoading(false);
    }
  };

  const getDashboardOverview = async () => {
    try {
      const res = await api.get("/admin/dashboard/overview");

      if (res.status === 200 && res.data?.data) {
        setDashboardStats(res.data.data);
      } else {
        toast.error("Failed to load dashboard stats");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Dashboard stats fetch failed"
      );
    }
  };

  useEffect(() => {
    getAllSellers(currentPage);
  }, [currentPage]);

  useEffect(() => {
    getDashboardOverview();
  }, []);
  // safe access helpers for filtering/search
  const getDisplayName = (seller: Seller) =>
    seller.sellerName || seller.name || "";
  const getDisplayEmail = (seller: Seller) => seller.email || "";
  const getDisplayShopName = (seller: Seller) => seller.shopName || "";

  const filteredSellers = sellers.filter((seller) => {
    const matchesFilter = filter === "all" || seller.status === filter;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return matchesFilter;

    const matchesSearch =
      getDisplayName(seller).toLowerCase().includes(q) ||
      getDisplayEmail(seller).toLowerCase().includes(q) ||
      getDisplayShopName(seller).toLowerCase().includes(q) ||
      (seller.mobile || "").includes(q) ||
      (seller.upiId || "").toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  const statusColors: Record<"active" | "inactive" | "pending", string> = {
    active: BASE_COLORS.success,
    inactive: BASE_COLORS.gray,
    pending: BASE_COLORS.warning,
  };

  const statusLabels: Record<"active" | "inactive" | "pending", string> = {
    active: "Active",
    inactive: "Inactive",
    pending: "Pending",
  };

  return (
    <div className="w-full h-full">
      <div className="mb-6">
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: BASE_COLORS.darkText }}
        >
          All Sellers
        </h1>
        <p className="text-base" style={{ color: BASE_COLORS.gray }}>
          Manage and view all registered sellers on the platform
        </p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name, email, phone, shop name or UPI..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2"
            style={{
              backgroundColor: BASE_COLORS.white,
              borderColor: BASE_COLORS.lightGray,
              color: BASE_COLORS.darkText,
            }}
            onFocus={(e) => {
              (e.target as HTMLInputElement).style.borderColor =
                BASE_COLORS.primary;
            }}
            onBlur={(e) => {
              (e.target as HTMLInputElement).style.borderColor =
                BASE_COLORS.lightGray;
            }}
          />
        </div>
        <div className="flex gap-2">
          {(["all", "active", "inactive", "pending"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-200 capitalize"
              style={{
                backgroundColor:
                  filter === status
                    ? BASE_COLORS.primary
                    : BASE_COLORS.lightBackground,
                color:
                  filter === status ? BASE_COLORS.white : BASE_COLORS.darkText,
              }}
            >
              {status === "all" ? "All" : statusLabels[status]}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div
          className="rounded-lg p-4 shadow-md"
          style={{ backgroundColor: BASE_COLORS.white }}
        >
          <p
            className="texxt-base font-medium mb-1"
            style={{ color: BASE_COLORS.gray }}
          >
            Total Sellers
          </p>
          <p
            className="text-2xl font-bold"
            style={{ color: BASE_COLORS.darkText }}
          >
            {dashboardStats.totalSellers}
          </p>
        </div>

        <div
          className="rounded-lg p-4 shadow-md"
          style={{ backgroundColor: BASE_COLORS.white }}
        >
          <p
            className="texxt-base font-medium mb-1"
            style={{ color: BASE_COLORS.gray }}
          >
            Active Sellers
          </p>
          <p
            className="text-2xl font-bold"
            style={{ color: BASE_COLORS.success }}
          >
            {dashboardStats.activeSellers}
          </p>
        </div>

        <div
          className="rounded-lg p-4 shadow-md"
          style={{ backgroundColor: BASE_COLORS.white }}
        >
          <p
            className="texxt-base font-medium mb-1"
            style={{ color: BASE_COLORS.gray }}
          >
            Pending Sellers
          </p>
          <p
            className="text-2xl font-bold"
            style={{ color: BASE_COLORS.warning }}
          >
            {dashboardStats.pendingSellers}
          </p>
        </div>

        <div
          className="rounded-lg p-4 shadow-md"
          style={{ backgroundColor: BASE_COLORS.white }}
        >
          <p
            className="texxt-base font-medium mb-1"
            style={{ color: BASE_COLORS.gray }}
          >
            Shop Not Live
          </p>
          <p className="text-2xl font-bold" style={{ color: BASE_COLORS.gray }}>
            {dashboardStats.sellersWithoutShop +
              dashboardStats.sellersWithShopNoProduct}
          </p>
        </div>
      </div>
      {/* Sellers Table */}
      <div
        className="rounded-xl shadow-lg overflow-hidden"
        style={{ backgroundColor: BASE_COLORS.white }}
      >
        {loading ? (
          <div
            className="flex items-center justify-center py-12"
            style={{ color: BASE_COLORS.gray }}
          >
            Loading...
          </div>
        ) : filteredSellers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: `${BASE_COLORS.primary}15` }}
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke={BASE_COLORS.primary}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3
              className="text-xl font-semibold mb-2"
              style={{ color: BASE_COLORS.darkText }}
            >
              No sellers found
            </h3>
            <p className="text-base" style={{ color: BASE_COLORS.gray }}>
              {searchQuery
                ? "Try adjusting your search criteria"
                : "No sellers have been registered yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="">
                <tr
                  className="text-xl"
                  style={{ backgroundColor: BASE_COLORS.lightBackground }}
                >
                  <th
                    className="px-6 py-4 text-left font-semibold"
                    style={{ color: BASE_COLORS.darkText }}
                  >
                    Sr. No.
                  </th>
                  <th
                    className="px-6 py-4 text-left font-semibold"
                    style={{ color: BASE_COLORS.darkText }}
                  >
                    Seller Name
                  </th>
                  <th
                    className="px-6 py-4 text-left font-semibold"
                    style={{ color: BASE_COLORS.darkText }}
                  >
                    Shop Name
                  </th>
                  <th
                    className="px-6 py-4 text-left font-semibold"
                    style={{ color: BASE_COLORS.darkText }}
                  >
                    Contact
                  </th>
                  <th
                    className="px-6 py-4 text-left font-semibold"
                    style={{ color: BASE_COLORS.darkText }}
                  >
                    Status
                  </th>
                  <th
                    className="px-6 py-4 text-left font-semibold"
                    style={{ color: BASE_COLORS.darkText }}
                  >
                    Join Date
                  </th>
                  <th
                    className="px-6 py-4 text-left font-semibold"
                    style={{ color: BASE_COLORS.darkText }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSellers.map((seller, index) => (
                  <tr
                    key={seller._id}
                    className="border-t transition-colors hover:bg-opacity-50"
                    style={{
                      borderColor: BASE_COLORS.lightGray,
                      backgroundColor:
                        index % 2 === 0
                          ? BASE_COLORS.white
                          : BASE_COLORS.lightBackground,
                    }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <p
                          className="font-medium"
                          style={{ color: BASE_COLORS.darkText }}
                        >
                          {(currentPage - 1) * limit + index + 1}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white"
                          style={{ backgroundColor: BASE_COLORS.primary }}
                        >
                          {(getDisplayName(seller)[0] || "U").toUpperCase()}
                        </div>
                        <div>
                          <p
                            className="font-medium"
                            style={{ color: BASE_COLORS.darkText }}
                          >
                            {getDisplayName(seller)}
                          </p>
                          <p
                            className="texxt-base"
                            style={{ color: BASE_COLORS.gray }}
                          >
                            {getDisplayEmail(seller)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p
                        className="font-medium"
                        style={{ color: BASE_COLORS.darkText }}
                      >
                        {getDisplayShopName(seller)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p style={{ color: BASE_COLORS.darkText }}>
                        {seller.mobile || seller.phone || "N/A"}
                      </p>
                    </td>
                    <td className="px-7 py-4">
                      <span
                        className="px-4 py-1 rounded-full text-base font-medium"
                        style={{
                          backgroundColor: `${
                            statusColors[seller.status || "pending"]
                          }20`,
                          color: statusColors[seller.status || "pending"],
                        }}
                      >
                        {statusLabels[seller.status || "pending"]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p style={{ color: BASE_COLORS.gray }}>
                        {new Date(
                          seller.createdAt || seller.joinDate || Date.now()
                        ).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="px-3 py-1 rounded-lg text-lg font-medium transition-all duration-200 hover:opacity-90"
                        style={{
                          backgroundColor: BASE_COLORS.primary,
                          color: BASE_COLORS.white,
                        }}
                        // hook this up to your detail view / navigation
                        onClick={() => {
                          // example: navigate to seller details, replace with your router
                          toast.info(
                            "Open seller details - wire up navigation"
                          );
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center px-6 py-4">
          <p className="text-md" style={{ color: BASE_COLORS.gray }}>
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-4 py-2 rounded-lg text-base font-medium disabled:opacity-50"
              style={{
                backgroundColor: BASE_COLORS.lightBackground,
                color: BASE_COLORS.darkText,
              }}
            >
              Previous
            </button>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-2 rounded-lg text-base font-medium disabled:opacity-50"
              style={{
                backgroundColor: BASE_COLORS.primary,
                color: BASE_COLORS.white,
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllSellersAdmin;

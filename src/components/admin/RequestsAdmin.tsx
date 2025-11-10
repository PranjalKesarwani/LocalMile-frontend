import { useEffect, useState } from "react";
import { BASE_COLORS } from "../../constant";
import { toast } from "react-toastify";
import { api } from "../../configs/apiClient";

export type Requests = {
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
  // backend might return "chosenCategories" or "categories" — keep both optional
  chosenCategories?: string[];
  categories?: string[];
};

const fallbackStaticRequests: Requests[] = [
  {
    _id: "1",
    sellerName: "Rajesh Kumar",
    shopName: "Rajesh Electronics",
    basicAddress: "123 Main Street, Sector 5",
    mobile: "9876543210",
    email: "rajesh.kumar@example.com",
    profilePic: "",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    adminApproval: false,
    upiId: "",
    chosenCategories: ["Electronics", "Appliances"],
  },
  {
    _id: "2",
    sellerName: "Priya Sharma",
    shopName: "Priya Fashion Hub",
    basicAddress: "456 Market Road, Sector 8",
    mobile: "9876543211",
    email: "priya.sharma@example.com",
    profilePic: "",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    adminApproval: true,
    upiId: "",
    chosenCategories: ["Clothing", "Accessories"],
  },
];

const RequestsAdmin = () => {
  const [requests, setRequests] = useState<Requests[]>(fallbackStaticRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch pending requests from backend
  const getPendingRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/get-seller-requests");
      // expected response: { success: true, sellerRequests }
      if (res.status === 200 && res.data?.sellerRequests) {
        // map/normalize server objects to our Requests type if needed
        const normalized: Requests[] = res.data.sellerRequests.map(
          (r: any) => ({
            _id: r._id || r.id,
            adminApproval: Boolean(r.adminApproval),
            sellerName: r.sellerName || r.name || "",
            shopName: r.shopName || r.shop || "",
            basicAddress: r.basicAddress || r.shopAddress || "",
            mobile: r.mobile || r.phone || "",
            profilePic: r.profilePic || r.pic || "",
            createdAt: r.createdAt || new Date().toISOString(),
            email: r.email || "",
            upiId: r.upiId || "",
            chosenCategories: r.chosenCategories || r.categories || [],
          })
        );
        setRequests(normalized);
      } else {
        toast.error("Unexpected response from server");
      }
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Optimistic UI update + call backend to change approval
  const changeApproval = async (requestId: string, newStatus: boolean) => {
    // Optimistically update UI
    setRequests((prev) =>
      prev.map((r) =>
        r._id === requestId ? { ...r, adminApproval: newStatus } : r
      )
    );

    try {
      // Replace this endpoint with your actual backend route if different.
      // This sends sellerId and desired adminApproval flag.
      const res = await api.post("/admin/update-seller-approval", {
        sellerId: requestId,
        adminApproval: newStatus,
      });

      if (res.status === 200 && res.data?.success) {
        toast.success(
          newStatus ? "Seller approved successfully" : "Seller approval revoked"
        );
        // backend returned updated seller? if yes, reconcile:
        if (res.data.updatedSeller) {
          const updated = res.data.updatedSeller;
          setRequests((prev) =>
            prev.map((r) =>
              r._id === requestId
                ? {
                    ...r,
                    adminApproval: Boolean(updated.adminApproval),
                    sellerName: updated.sellerName ?? r.sellerName,
                    shopName: updated.shopName ?? r.shopName,
                    basicAddress: updated.basicAddress ?? r.basicAddress,
                    mobile: updated.mobile ?? r.mobile,
                    profilePic: updated.profilePic ?? r.profilePic,
                    email: updated.email ?? r.email,
                    upiId: updated.upiId ?? r.upiId,
                    chosenCategories:
                      updated.chosenCategories ??
                      updated.categories ??
                      r.chosenCategories,
                    createdAt: updated.createdAt ?? r.createdAt,
                  }
                : r
            )
          );
        }
      } else {
        // revert optimistic change if server didn't succeed
        setRequests((prev) =>
          prev.map((r) =>
            r._id === requestId ? { ...r, adminApproval: !newStatus } : r
          )
        );
        toast.error(res.data?.message || "Failed to update approval");
      }
    } catch (error: any) {
      // revert optimistic change
      setRequests((prev) =>
        prev.map((r) =>
          r._id === requestId ? { ...r, adminApproval: !newStatus } : r
        )
      );
      const errMsg =
        error?.response?.data?.message || error.message || "Network error";
      toast.error(errMsg);
    }
  };

  useEffect(() => {
    getPendingRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter requests based on search query
  const filteredRequests = requests.filter((request) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;

    const categories = (
      request.chosenCategories ||
      request.categories ||
      []
    ).join(" ");
    return (
      request.sellerName.toLowerCase().includes(q) ||
      request.shopName.toLowerCase().includes(q) ||
      (request.email || "").toLowerCase().includes(q) ||
      (request.mobile || "").includes(q) ||
      categories.toLowerCase().includes(q)
    );
  });

  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return "Today";
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div className="w-full h-full">
      {/* Header */}
      <div className="mb-6">
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: BASE_COLORS.darkText }}
        >
          Seller Requests
        </h1>
        <p className="text-base" style={{ color: BASE_COLORS.gray }}>
          Review and manage seller shop opening requests
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div
          className="rounded-lg p-4 shadow-md"
          style={{ backgroundColor: BASE_COLORS.white }}
        >
          <p
            className="text-sm font-medium mb-1"
            style={{ color: BASE_COLORS.gray }}
          >
            Total Requests
          </p>
          <p
            className="text-2xl font-bold"
            style={{ color: BASE_COLORS.darkText }}
          >
            {requests.length}
          </p>
        </div>
        <div
          className="rounded-lg p-4 shadow-md"
          style={{ backgroundColor: BASE_COLORS.white }}
        >
          <p
            className="text-sm font-medium mb-1"
            style={{ color: BASE_COLORS.gray }}
          >
            Pending
          </p>
          <p
            className="text-2xl font-bold"
            style={{ color: BASE_COLORS.warning }}
          >
            {requests.filter((r) => !r.adminApproval).length}
          </p>
        </div>
        <div
          className="rounded-lg p-4 shadow-md"
          style={{ backgroundColor: BASE_COLORS.white }}
        >
          <p
            className="text-sm font-medium mb-1"
            style={{ color: BASE_COLORS.gray }}
          >
            Approved
          </p>
          <p
            className="text-2xl font-bold"
            style={{ color: BASE_COLORS.success }}
          >
            {requests.filter((r) => r.adminApproval).length}
          </p>
        </div>
        <div
          className="rounded-lg p-4 shadow-md"
          style={{ backgroundColor: BASE_COLORS.white }}
        >
          <p
            className="text-sm font-medium mb-1"
            style={{ color: BASE_COLORS.gray }}
          >
            Filtered
          </p>
          <p
            className="text-2xl font-bold"
            style={{ color: BASE_COLORS.primary }}
          >
            {filteredRequests.length}
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div>
          <input
            type="text"
            placeholder="Search by seller name, shop name, email, phone or category..."
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
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center" style={{ color: BASE_COLORS.gray }}>
            Loading...
          </div>
        ) : filteredRequests.length === 0 ? (
          <div
            className="rounded-xl p-12 shadow-lg flex flex-col items-center justify-center"
            style={{ backgroundColor: BASE_COLORS.white }}
          >
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3
              className="text-xl font-semibold mb-2"
              style={{ color: BASE_COLORS.darkText }}
            >
              No requests found
            </h3>
            <p className="text-base" style={{ color: BASE_COLORS.gray }}>
              {searchQuery
                ? "Try adjusting your search"
                : "No seller requests available"}
            </p>
          </div>
        ) : (
          filteredRequests.map((request) => {
            const categories =
              request.chosenCategories || request.categories || [];
            return (
              <div
                key={request._id}
                className="rounded-xl p-6 shadow-lg transition-all duration-200 hover:shadow-xl"
                style={{ backgroundColor: BASE_COLORS.white }}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Left Section - Request Info */}
                  <div className="flex-1 space-y-4">
                    {/* Header with Status */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3
                          className="text-xl font-bold mb-1"
                          style={{ color: BASE_COLORS.darkText }}
                        >
                          {request.shopName}
                        </h3>
                        <p
                          className="text-base"
                          style={{ color: BASE_COLORS.gray }}
                        >
                          by {request.sellerName}
                        </p>
                      </div>
                      <span
                        className="px-3 py-1 rounded-full text-base font-medium"
                        style={{
                          backgroundColor: request.adminApproval
                            ? `${BASE_COLORS.success}20`
                            : `${BASE_COLORS.warning}20`,
                          color: request.adminApproval
                            ? BASE_COLORS.success
                            : BASE_COLORS.warning,
                        }}
                      >
                        {request.adminApproval ? "Approved" : "Pending"}
                      </span>
                    </div>

                    {/* Request Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Seller Name */}
                      <div className="flex items-start gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{
                            backgroundColor: `${BASE_COLORS.primary}15`,
                          }}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke={BASE_COLORS.primary}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p
                            className="text-sm font-medium mb-1"
                            style={{ color: BASE_COLORS.gray }}
                          >
                            Seller Name
                          </p>
                          <p
                            className="text-base font-semibold"
                            style={{ color: BASE_COLORS.darkText }}
                          >
                            {request.sellerName}
                          </p>
                        </div>
                      </div>

                      {/* Shop Name */}
                      <div className="flex items-start gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{
                            backgroundColor: `${BASE_COLORS.primary}15`,
                          }}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke={BASE_COLORS.primary}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                          </svg>
                        </div>
                        <div>
                          <p
                            className="text-sm font-medium mb-1"
                            style={{ color: BASE_COLORS.gray }}
                          >
                            Shop Name
                          </p>
                          <p
                            className="text-base font-semibold"
                            style={{ color: BASE_COLORS.darkText }}
                          >
                            {request.shopName}
                          </p>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-start gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{
                            backgroundColor: `${BASE_COLORS.primary}15`,
                          }}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke={BASE_COLORS.primary}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p
                            className="text-sm font-medium mb-1"
                            style={{ color: BASE_COLORS.gray }}
                          >
                            Location
                          </p>
                          <p
                            className="text-base font-semibold"
                            style={{ color: BASE_COLORS.darkText }}
                          >
                            {request.basicAddress || "N/A"}
                          </p>
                        </div>
                      </div>

                      {/* Mobile */}
                      <div className="flex items-start gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{
                            backgroundColor: `${BASE_COLORS.primary}15`,
                          }}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke={BASE_COLORS.primary}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p
                            className="text-sm font-medium mb-1"
                            style={{ color: BASE_COLORS.gray }}
                          >
                            Mobile
                          </p>
                          <p
                            className="text-base font-semibold"
                            style={{ color: BASE_COLORS.darkText }}
                          >
                            {request.mobile || "N/A"}
                          </p>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="flex items-start gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{
                            backgroundColor: `${BASE_COLORS.primary}15`,
                          }}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke={BASE_COLORS.primary}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p
                            className="text-sm font-medium mb-1"
                            style={{ color: BASE_COLORS.gray }}
                          >
                            Email
                          </p>
                          <p
                            className="text-base font-semibold"
                            style={{ color: BASE_COLORS.darkText }}
                          >
                            {request.email || "N/A"}
                          </p>
                        </div>
                      </div>

                      {/* Request Time */}
                      <div className="flex items-start gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{
                            backgroundColor: `${BASE_COLORS.primary}15`,
                          }}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke={BASE_COLORS.primary}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p
                            className="text-sm font-medium mb-1"
                            style={{ color: BASE_COLORS.gray }}
                          >
                            Request Time
                          </p>
                          <p
                            className="text-base font-semibold"
                            style={{ color: BASE_COLORS.darkText }}
                          >
                            {formatDate(request.createdAt)}
                          </p>
                        </div>
                      </div>

                      {/* Categories */}
                      <div className="flex items-start gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{
                            backgroundColor: `${BASE_COLORS.primary}15`,
                          }}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke={BASE_COLORS.primary}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p
                            className="text-sm font-medium mb-2"
                            style={{ color: BASE_COLORS.gray }}
                          >
                            Categories
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {categories.length > 0 ? (
                              categories.map((category, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 rounded-full text-sm font-medium"
                                  style={{
                                    backgroundColor: `${BASE_COLORS.primary}15`,
                                    color: BASE_COLORS.primary,
                                  }}
                                >
                                  {category}
                                </span>
                              ))
                            ) : (
                              <span
                                className="text-sm"
                                style={{ color: BASE_COLORS.gray }}
                              >
                                No categories selected
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Actions */}
                  <div className="flex flex-col gap-3 lg:w-48">
                    {!request.adminApproval ? (
                      <>
                        <button
                          onClick={() => changeApproval(request._id, true)}
                          className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:opacity-90"
                          style={{
                            backgroundColor: BASE_COLORS.success,
                            color: BASE_COLORS.white,
                          }}
                        >
                          Approve Request
                        </button>
                        <button
                          onClick={() => changeApproval(request._id, false)}
                          className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:opacity-90 border-2"
                          style={{
                            backgroundColor: "transparent",
                            borderColor: BASE_COLORS.error,
                            color: BASE_COLORS.error,
                          }}
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => changeApproval(request._id, false)}
                          className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:opacity-90 border-2"
                          style={{
                            backgroundColor: "transparent",
                            borderColor: BASE_COLORS.warning,
                            color: BASE_COLORS.warning,
                          }}
                        >
                          Revoke Approval
                        </button>
                        <div
                          className="px-4 py-2 rounded-lg text-center text-base font-medium"
                          style={{
                            backgroundColor: `${BASE_COLORS.success}15`,
                            color: BASE_COLORS.success,
                          }}
                        >
                          ✓ Approved
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RequestsAdmin;

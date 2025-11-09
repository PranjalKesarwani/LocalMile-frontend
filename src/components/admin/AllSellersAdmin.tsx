import { useState } from "react";
import { BASE_COLORS } from "../../constant";

interface Seller {
  id: string;
  name: string;
  email: string;
  phone: string;
  shopName: string;
  status: "active" | "inactive" | "pending";
  joinDate: string;
}

const AllSellersAdmin = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [filter, setFilter] = useState<
    "all" | "active" | "inactive" | "pending"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSellers = sellers.filter((seller) => {
    const matchesFilter = filter === "all" || seller.status === filter;
    const matchesSearch =
      seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.shopName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const statusColors = {
    active: BASE_COLORS.success,
    inactive: BASE_COLORS.gray,
    pending: BASE_COLORS.warning,
  };

  const statusLabels = {
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
            placeholder="Search by name, email, or shop name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2"
            style={{
              backgroundColor: BASE_COLORS.white,
              borderColor: BASE_COLORS.lightGray,
              color: BASE_COLORS.darkText,
            }}
            onFocus={(e) => {
              e.target.style.borderColor = BASE_COLORS.primary;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = BASE_COLORS.lightGray;
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
            className="text-sm font-medium mb-1"
            style={{ color: BASE_COLORS.gray }}
          >
            Total Sellers
          </p>
          <p
            className="text-2xl font-bold"
            style={{ color: BASE_COLORS.darkText }}
          >
            {sellers.length}
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
            Active
          </p>
          <p
            className="text-2xl font-bold"
            style={{ color: BASE_COLORS.success }}
          >
            {sellers.filter((s) => s.status === "active").length}
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
            {sellers.filter((s) => s.status === "pending").length}
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
            Inactive
          </p>
          <p className="text-2xl font-bold" style={{ color: BASE_COLORS.gray }}>
            {sellers.filter((s) => s.status === "inactive").length}
          </p>
        </div>
      </div>

      {/* Sellers Table */}
      <div
        className="rounded-xl shadow-lg overflow-hidden"
        style={{ backgroundColor: BASE_COLORS.white }}
      >
        {filteredSellers.length === 0 ? (
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
              <thead>
                <tr style={{ backgroundColor: BASE_COLORS.lightBackground }}>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold"
                    style={{ color: BASE_COLORS.darkText }}
                  >
                    Seller Name
                  </th>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold"
                    style={{ color: BASE_COLORS.darkText }}
                  >
                    Shop Name
                  </th>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold"
                    style={{ color: BASE_COLORS.darkText }}
                  >
                    Contact
                  </th>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold"
                    style={{ color: BASE_COLORS.darkText }}
                  >
                    Status
                  </th>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold"
                    style={{ color: BASE_COLORS.darkText }}
                  >
                    Join Date
                  </th>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold"
                    style={{ color: BASE_COLORS.darkText }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSellers.map((seller, index) => (
                  <tr
                    key={seller.id}
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
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white"
                          style={{ backgroundColor: BASE_COLORS.primary }}
                        >
                          {seller.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p
                            className="font-medium"
                            style={{ color: BASE_COLORS.darkText }}
                          >
                            {seller.name}
                          </p>
                          <p
                            className="text-sm"
                            style={{ color: BASE_COLORS.gray }}
                          >
                            {seller.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p
                        className="font-medium"
                        style={{ color: BASE_COLORS.darkText }}
                      >
                        {seller.shopName}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p style={{ color: BASE_COLORS.darkText }}>
                        {seller.phone}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${statusColors[seller.status]}20`,
                          color: statusColors[seller.status],
                        }}
                      >
                        {statusLabels[seller.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p style={{ color: BASE_COLORS.gray }}>
                        {new Date(seller.joinDate).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 hover:opacity-90"
                        style={{
                          backgroundColor: BASE_COLORS.primary,
                          color: BASE_COLORS.white,
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
    </div>
  );
};

export default AllSellersAdmin;

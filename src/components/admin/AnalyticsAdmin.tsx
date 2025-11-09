import { BASE_COLORS } from "../../constant";

const AnalyticsAdmin = () => {
  const stats = [
    {
      label: "Total Sellers",
      value: "0",
      icon: (
        <svg
          className="w-8 h-8"
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
      color: BASE_COLORS.primary,
    },
    {
      label: "Pending Requests",
      value: "0",
      icon: (
        <svg
          className="w-8 h-8"
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
      color: BASE_COLORS.warning,
    },
    {
      label: "Total Orders",
      value: "0",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      ),
      color: BASE_COLORS.success,
    },
    {
      label: "Active Deliveries",
      value: "0",
      icon: (
        <svg
          className="w-8 h-8"
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
      color: BASE_COLORS.chakraBlue,
    },
  ];

  return (
    <div className="w-full h-full">
      <div className="mb-6">
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: BASE_COLORS.darkText }}
        >
          Analytics Dashboard
        </h1>
        <p className="text-base" style={{ color: BASE_COLORS.gray }}>
          Overview of your platform metrics and statistics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="rounded-xl p-6 shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
            style={{ backgroundColor: BASE_COLORS.white }}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <div style={{ color: stat.color }}>{stat.icon}</div>
              </div>
            </div>
            <h3
              className="text-3xl font-bold mb-1"
              style={{ color: BASE_COLORS.darkText }}
            >
              {stat.value}
            </h3>
            <p
              className="text-sm font-medium"
              style={{ color: BASE_COLORS.gray }}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Placeholder 1 */}
        <div
          className="rounded-xl p-6 shadow-lg"
          style={{ backgroundColor: BASE_COLORS.white }}
        >
          <h3
            className="text-xl font-semibold mb-4"
            style={{ color: BASE_COLORS.darkText }}
          >
            Sales Overview
          </h3>
          <div
            className="h-64 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: BASE_COLORS.lightBackground }}
          >
            <p style={{ color: BASE_COLORS.gray }}>
              Chart will be displayed here
            </p>
          </div>
        </div>

        {/* Chart Placeholder 2 */}
        <div
          className="rounded-xl p-6 shadow-lg"
          style={{ backgroundColor: BASE_COLORS.white }}
        >
          <h3
            className="text-xl font-semibold mb-4"
            style={{ color: BASE_COLORS.darkText }}
          >
            User Growth
          </h3>
          <div
            className="h-64 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: BASE_COLORS.lightBackground }}
          >
            <p style={{ color: BASE_COLORS.gray }}>
              Chart will be displayed here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsAdmin;

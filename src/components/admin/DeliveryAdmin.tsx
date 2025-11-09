import { useState } from "react";
import { BASE_COLORS } from "../../constant";

const DeliveryAdmin = () => {
  const [activeTab, setActiveTab] = useState<"all" | "active" | "inactive">(
    "all"
  );

  const deliveryPersons = [
    // This would come from API
  ];

  const tabs = [
    { id: "all" as const, label: "All Delivery Persons", count: 0 },
    { id: "active" as const, label: "Active", count: 0 },
    { id: "inactive" as const, label: "Inactive", count: 0 },
  ];

  return (
    <div className="w-full h-full">
      <div className="mb-6">
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: BASE_COLORS.darkText }}
        >
          Delivery Manager
        </h1>
        <p className="text-base" style={{ color: BASE_COLORS.gray }}>
          Manage delivery personnel and their assignments
        </p>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-2 mb-6 border-b"
        style={{ borderColor: BASE_COLORS.lightGray }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-6 py-3 font-medium transition-all duration-200 relative"
            style={{
              color:
                activeTab === tab.id ? BASE_COLORS.primary : BASE_COLORS.gray,
            }}
          >
            {tab.label}
            {tab.count > 0 && (
              <span
                className="ml-2 px-2 py-0.5 rounded-full text-xs"
                style={{
                  backgroundColor:
                    activeTab === tab.id
                      ? `${BASE_COLORS.primary}20`
                      : BASE_COLORS.lightGray,
                  color:
                    activeTab === tab.id
                      ? BASE_COLORS.primary
                      : BASE_COLORS.gray,
                }}
              >
                {tab.count}
              </span>
            )}
            {activeTab === tab.id && (
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                style={{ backgroundColor: BASE_COLORS.primary }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Actions Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search delivery persons..."
            className="px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2"
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
        <button
          className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:opacity-90"
          style={{
            backgroundColor: BASE_COLORS.primary,
            color: BASE_COLORS.white,
          }}
        >
          + Add Delivery Person
        </button>
      </div>

      {/* Delivery Persons List */}
      <div
        className="rounded-xl p-6 shadow-lg"
        style={{ backgroundColor: BASE_COLORS.white }}
      >
        {deliveryPersons.length === 0 ? (
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
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </div>
            <h3
              className="text-xl font-semibold mb-2"
              style={{ color: BASE_COLORS.darkText }}
            >
              No delivery persons found
            </h3>
            <p className="text-base mb-4" style={{ color: BASE_COLORS.gray }}>
              Get started by adding your first delivery person
            </p>
            <button
              className="px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:opacity-90"
              style={{
                backgroundColor: BASE_COLORS.primary,
                color: BASE_COLORS.white,
              }}
            >
              Add Delivery Person
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Delivery person cards would go here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryAdmin;

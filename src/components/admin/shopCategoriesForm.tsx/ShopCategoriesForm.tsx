import axios from "axios";
import { useEffect, useState } from "react";
import { Tree, TreeNodeDatum } from "react-d3-tree";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../Url";
import { BASE_COLORS } from "../../../constant";

// Extend the default TreeNodeDatum type
interface CustomNodeDatum extends TreeNodeDatum {
  status: "active" | "inactive";
  attributes?: {
    id: string;
  };
}

interface TCatetory {
  name: string;
  status: "active" | "inactive";
  parentCategory: string | null;
  image?: string;
}

const initialTreeData: any = {
  name: "Categories",
  status: "active",
  attributes: { id: "root" },
  children: [
    {
      name: "Electronics",
      status: "active",
      attributes: { id: "1" },
      children: [
        {
          name: "Laptops",
          status: "active",
          attributes: { id: "2" },
          children: [
            {
              name: "Gaming Laptops",
              status: "active",
              attributes: { id: "3" },
            },
            {
              name: "Office Laptops",
              status: "active",
              attributes: { id: "4" },
            },
          ],
        },
      ],
    },
  ],
};

const CategoryTree = () => {
  const [treeData, setTreeData] = useState<CustomNodeDatum>(initialTreeData);
  const [selectedNode, setSelectedNode] = useState<CustomNodeDatum | null>(
    null
  );
  const [addCategory, setAddCategory] = useState<TCatetory>({
    name: "",
    status: "active", // default status
    parentCategory: null,
    image: "",
  });

  const handleAddCategory = async (action: string, payload: TCatetory) => {
    try {
      const apiPayload: any = { action };
      const headers = { "Content-Type": "application/json" };

      if (action === "GET") {
        const res = await axios.post(
          `${BASE_URL}/admin/handle-category-actions`,
          apiPayload,
          { headers }
        );
        setTreeData(res.data);
        return;
      }

      if (!["ADD", "DELETE", "UPDATE"].includes(action)) {
        toast.error("Invalid action!");
        return;
      }

      if (action === "ADD") {
        const { name, status, image = "" } = payload;

        if (!selectedNode || !name || !status) {
          toast.error("Please fill all fields!");
          return;
        }

        Object.assign(apiPayload, {
          name,
          status,
          parentCategory: selectedNode.attributes?.id,
          image,
        });
      }

      if (action === "DELETE") {
        if (!selectedNode) {
          toast.error("Select a category to delete!");
          return;
        }
        apiPayload.categoryId = selectedNode.attributes?.id;
      }

      if (action === "UPDATE") {
        if (!selectedNode) {
          toast.error("Select a category to update!");
          return;
        }

        const { name, status, image } = payload;

        if (!name || !status) {
          toast.error("Please fill all fields!");
          return;
        }

        Object.assign(apiPayload, {
          categoryId: selectedNode.attributes?.id,
          updateData: { name, status, image },
        });
      }

      const res = await axios.post(
        `${BASE_URL}/admin/handle-category-actions`,
        apiPayload,
        { headers }
      );

      if (res.status === 201 && action === "ADD") {
        toast.success("Category added successfully!");
        handleAddCategory("GET", payload);
      }

      if (res.status === 200 && action === "DELETE") {
        toast.success("Category deleted successfully!");
        handleAddCategory("GET", payload);
      }

      if (res.status === 200 && action === "UPDATE") {
        toast.success("Category updated successfully!");
        handleAddCategory("GET", payload);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    const fetchTree = async () => {
      await handleAddCategory("GET", addCategory);
    };
    fetchTree();
  }, []);

  return (
    <div className="w-full h-full flex flex-col" style={{ backgroundColor: BASE_COLORS.background }}>
      {/* Header */}
      <div className="mb-6">
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: BASE_COLORS.darkText }}
        >
          Shop Categories Manager
        </h1>
        <p className="text-base" style={{ color: BASE_COLORS.gray }}>
          Manage your shop category hierarchy
        </p>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Tree Visualization Section */}
        <div
          className="flex-1 rounded-xl shadow-lg overflow-hidden"
          style={{ backgroundColor: BASE_COLORS.white }}
        >
          <div className="p-4 border-b" style={{ borderColor: BASE_COLORS.lightGray }}>
            <h2
              className="text-xl font-semibold"
              style={{ color: BASE_COLORS.darkText }}
            >
              Category Tree
            </h2>
            <p className="text-sm mt-1" style={{ color: BASE_COLORS.gray }}>
              Click on a category node to select it
            </p>
          </div>
          <div className="w-full h-full overflow-auto" style={{ minHeight: "500px" }}>
            <Tree
              data={treeData}
              orientation="vertical"
              pathFunc="step"
              translate={{ x: 200, y: 100 }}
              renderCustomNodeElement={(rd3tProps) => {
                const nodeData = rd3tProps.nodeDatum as CustomNodeDatum;
                const isSelected = selectedNode?.attributes?.id === nodeData.attributes?.id;
                const isActive = nodeData.status === "active";
                
                return (
                  <g>
                    <rect
                      width={140}
                      height={50}
                      x={-70}
                      y={-25}
                      fill={isSelected ? BASE_COLORS.primary : (isActive ? BASE_COLORS.success : BASE_COLORS.gray)}
                      rx={8}
                      stroke={isSelected ? BASE_COLORS.primary : "transparent"}
                      strokeWidth={isSelected ? 3 : 0}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setSelectedNode(nodeData);
                        setAddCategory({
                          name: nodeData.name,
                          status: nodeData.status,
                          parentCategory: null,
                          image: "",
                        });
                      }}
                    />
                    <text
                      fill={BASE_COLORS.white}
                      textAnchor="middle"
                      dy="0.3em"
                      fontSize="14"
                      fontWeight="600"
                      style={{ cursor: "pointer", userSelect: "none" }}
                      onClick={() => {
                        setSelectedNode(nodeData);
                        setAddCategory({
                          name: nodeData.name,
                          status: nodeData.status,
                          parentCategory: null,
                          image: "",
                        });
                      }}
                    >
                      {rd3tProps.nodeDatum.name}
                    </text>
                  </g>
                );
              }}
            />
          </div>
        </div>

        {/* Form Section */}
        <div
          className="w-96 rounded-xl shadow-lg p-6 overflow-y-auto"
          style={{ backgroundColor: BASE_COLORS.white }}
        >
          <div className="mb-6">
            <h2
              className="text-xl font-semibold mb-2"
              style={{ color: BASE_COLORS.darkText }}
            >
              {selectedNode
                ? `Edit Category: ${selectedNode.name}`
                : "Select a category"}
            </h2>
            {selectedNode && (
              <p className="text-sm" style={{ color: BASE_COLORS.gray }}>
                Category ID: {selectedNode.attributes?.id}
              </p>
            )}
          </div>

          {selectedNode ? (
            <div className="space-y-4">
              {/* Category Name Input */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: BASE_COLORS.darkText }}
                >
                  Category Name
                </label>
                <input
                  type="text"
                  placeholder="Enter category name"
                  value={addCategory?.name}
                  onChange={(e) =>
                    setAddCategory({ ...addCategory, name: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-200"
                  style={{
                    backgroundColor: BASE_COLORS.white,
                    borderColor: BASE_COLORS.lightGray,
                    color: BASE_COLORS.darkText,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = BASE_COLORS.primary;
                    e.target.style.boxShadow = `0 0 0 3px ${BASE_COLORS.primary}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = BASE_COLORS.lightGray;
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Parent Category ID Input */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: BASE_COLORS.darkText }}
                >
                  Parent Category ID
                </label>
                <input
                  type="text"
                  placeholder="Parent Category ID"
                  value={selectedNode?.attributes?.id || ""}
                  readOnly
                  className="w-full px-4 py-2 rounded-lg border-2"
                  style={{
                    backgroundColor: BASE_COLORS.lightBackground,
                    borderColor: BASE_COLORS.lightGray,
                    color: BASE_COLORS.gray,
                    cursor: "not-allowed",
                  }}
                />
                <p className="text-xs mt-1" style={{ color: BASE_COLORS.gray }}>
                  This is the selected category's ID (read-only)
                </p>
              </div>

              {/* Image URL Input */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: BASE_COLORS.darkText }}
                >
                  Image URL
                </label>
                <input
                  type="text"
                  placeholder="Enter image URL"
                  value={addCategory?.image || ""}
                  onChange={(e) =>
                    setAddCategory({ ...addCategory, image: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-200"
                  style={{
                    backgroundColor: BASE_COLORS.white,
                    borderColor: BASE_COLORS.lightGray,
                    color: BASE_COLORS.darkText,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = BASE_COLORS.primary;
                    e.target.style.boxShadow = `0 0 0 3px ${BASE_COLORS.primary}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = BASE_COLORS.lightGray;
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Status Select */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: BASE_COLORS.darkText }}
                >
                  Status
                </label>
                <select
                  value={addCategory?.status || "active"}
                  onChange={(e) =>
                    setAddCategory({
                      ...addCategory,
                      status: e.target.value as "active" | "inactive",
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-200"
                  style={{
                    backgroundColor: BASE_COLORS.white,
                    borderColor: BASE_COLORS.lightGray,
                    color: BASE_COLORS.darkText,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = BASE_COLORS.primary;
                    e.target.style.boxShadow = `0 0 0 3px ${BASE_COLORS.primary}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = BASE_COLORS.lightGray;
                    e.target.style.boxShadow = "none";
                  }}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-4">
                <button
                  onClick={() => handleAddCategory("ADD", addCategory)}
                  disabled={!selectedNode || !addCategory.name}
                  className="w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: BASE_COLORS.primary,
                    color: BASE_COLORS.white,
                  }}
                >
                  Add Subcategory
                </button>
                <button
                  onClick={() => handleAddCategory("UPDATE", addCategory)}
                  disabled={!selectedNode || !addCategory.name}
                  className="w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: BASE_COLORS.warning,
                    color: BASE_COLORS.white,
                  }}
                >
                  Update Category
                </button>
                <button
                  onClick={() => handleAddCategory("DELETE", addCategory)}
                  disabled={!selectedNode}
                  className="w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: BASE_COLORS.error,
                    color: BASE_COLORS.white,
                  }}
                >
                  Delete Category
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: BASE_COLORS.darkText }}
              >
                No category selected
              </h3>
              <p className="text-sm text-center" style={{ color: BASE_COLORS.gray }}>
                Click on a category node in the tree to select and edit it
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryTree;

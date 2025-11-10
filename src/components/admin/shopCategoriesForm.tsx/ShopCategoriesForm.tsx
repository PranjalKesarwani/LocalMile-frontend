import axios from "axios";
import React, { useEffect, useState } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../Url";
import { BASE_COLORS } from "../../../constant";

// Custom node data structure
interface CustomNodeDatum {
  name: string;
  status: "active" | "inactive";
  attributes?: {
    id: string;
  };
  children?: CustomNodeDatum[];
}

interface TCatetory {
  name: string;
  status: "active" | "inactive";
  parentCategory: string | null;
  image?: string;
}

const initialTreeData: CustomNodeDatum = {
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
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [addCategory, setAddCategory] = useState<TCatetory>({
    name: "",
    status: "active", // default status
    parentCategory: null,
    image: "",
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    // Don't start dragging if clicking on a button, node, or interactive element
    const target = e.target as HTMLElement;
    if (
      target.tagName === "BUTTON" ||
      target.closest("button") ||
      target.closest('[data-tree-node="true"]')
    ) {
      return;
    }
    // Only start dragging on left mouse button
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add global mouse event listeners for smooth dragging
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, dragStart]);

  const toggleNodeExpansion = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

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

  // Recursive function to render tree nodes
  const renderTreeNode = (node: CustomNodeDatum): JSX.Element => {
    const isSelected = selectedNode?.attributes?.id === node.attributes?.id;
    const isActive = node.status === "active";
    const nodeId = node.attributes?.id || node.name;
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(nodeId);

    const nodeLabel = (
      <div
        data-tree-node="true"
        style={{
          display: "inline-block",
          padding: "12px 16px",
          borderRadius: "8px",
          backgroundColor: isSelected
            ? BASE_COLORS.primary
            : isActive
            ? BASE_COLORS.success
            : BASE_COLORS.gray,
          color: BASE_COLORS.white,
          cursor: "pointer",
          textAlign: "center",
          fontWeight: "600",
          fontSize: "14px",
          border: isSelected ? `3px solid ${BASE_COLORS.primary}` : "none",
          boxShadow: isSelected
            ? `0 0 0 3px ${BASE_COLORS.primary}20`
            : "0 2px 4px rgba(0,0,0,0.5)",
          transition: "all 0.2s ease",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => {
          if (!isSelected) {
            e.currentTarget.style.opacity = "0.9";
            e.currentTarget.style.transform = "scale(1.05)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "scale(1)";
          }
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            justifyContent: "center",
          }}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNodeExpansion(nodeId);
              }}
              style={{
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "bold",
                userSelect: "none",
                minWidth: "28px",
                minHeight: "28px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: BASE_COLORS.white,
                color: BASE_COLORS.darkText,
                border: `2px solid ${BASE_COLORS.lightGray}`,
                borderRadius: "6px",
                padding: "4px 8px",
                transition: "all 0.2s ease",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  BASE_COLORS.lightBackground;
                e.currentTarget.style.borderColor = BASE_COLORS.primary;
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = BASE_COLORS.white;
                e.currentTarget.style.borderColor = BASE_COLORS.lightGray;
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {isExpanded ? "−" : "+"}
            </button>
          )}
          <span
            onClick={() => {
              setSelectedNode(node);
              setAddCategory({
                name: node.name,
                status: node.status,
                parentCategory: null,
                image: "",
              });
            }}
          >
            {node.name}
          </span>
        </div>
      </div>
    );

    if (!hasChildren) {
      return <TreeNode label={nodeLabel} />;
    }

    return (
      <TreeNode label={nodeLabel}>
        {isExpanded &&
          node.children!.map((child) => (
            <React.Fragment key={child.attributes?.id || child.name}>
              {renderTreeNode(child)}
            </React.Fragment>
          ))}
      </TreeNode>
    );
  };

  return (
    <div
      className="w-full h-full flex flex-col"
      style={{ backgroundColor: BASE_COLORS.background }}
    >
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
          <div
            className="p-4 border-b"
            style={{ borderColor: BASE_COLORS.lightGray }}
          >
            <h2
              className="text-xl font-semibold"
              style={{ color: BASE_COLORS.darkText }}
            >
              Category Tree
            </h2>
            <p className="text-sm mt-1" style={{ color: BASE_COLORS.gray }}>
              Click on a category node to select it, click +/- to
              expand/collapse, drag to pan
            </p>
          </div>
          <div
            className="w-full h-full overflow-hidden relative"
            style={{
              minHeight: "500px",
              cursor: isDragging ? "grabbing" : "grab",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div
              style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                transition: isDragging ? "none" : "transform 0.1s ease-out",
                padding: "20px",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            >
              <Tree
                lineWidth="2px"
                lineColor={BASE_COLORS.lightGray}
                lineBorderRadius="10px"
                label={
                  <div
                    data-tree-node="true"
                    style={{
                      display: "inline-block",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      backgroundColor:
                        selectedNode?.attributes?.id === treeData.attributes?.id
                          ? BASE_COLORS.primary
                          : treeData.status === "active"
                          ? BASE_COLORS.success
                          : BASE_COLORS.gray,
                      color: BASE_COLORS.white,
                      cursor: "pointer",
                      textAlign: "center",
                      fontWeight: "600",
                      fontSize: "14px",
                      border:
                        selectedNode?.attributes?.id === treeData.attributes?.id
                          ? `3px solid ${BASE_COLORS.primary}`
                          : "none",
                      boxShadow:
                        selectedNode?.attributes?.id === treeData.attributes?.id
                          ? `0 0 0 3px ${BASE_COLORS.primary}20`
                          : "0 2px 4px rgba(0,0,0,0.5)",
                      transition: "all 0.2s ease",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      if (
                        selectedNode?.attributes?.id !== treeData.attributes?.id
                      ) {
                        e.currentTarget.style.opacity = "0.9";
                        e.currentTarget.style.transform = "scale(1.05)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (
                        selectedNode?.attributes?.id !== treeData.attributes?.id
                      ) {
                        e.currentTarget.style.opacity = "1";
                        e.currentTarget.style.transform = "scale(1)";
                      }
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        justifyContent: "center",
                      }}
                    >
                      {treeData.children && treeData.children.length > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const rootId =
                              treeData.attributes?.id || treeData.name;
                            toggleNodeExpansion(rootId);
                          }}
                          style={{
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: "bold",
                            userSelect: "none",
                            minWidth: "28px",
                            minHeight: "28px",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: BASE_COLORS.white,
                            color: BASE_COLORS.darkText,
                            border: `2px solid ${BASE_COLORS.lightGray}`,
                            borderRadius: "6px",
                            padding: "4px 8px",
                            transition: "all 0.2s ease",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.5)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              BASE_COLORS.lightBackground;
                            e.currentTarget.style.borderColor =
                              BASE_COLORS.primary;
                            e.currentTarget.style.transform = "scale(1.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              BASE_COLORS.white;
                            e.currentTarget.style.borderColor =
                              BASE_COLORS.lightGray;
                            e.currentTarget.style.transform = "scale(1)";
                          }}
                        >
                          {expandedNodes.has(
                            treeData.attributes?.id || treeData.name
                          )
                            ? "−"
                            : "+"}
                        </button>
                      )}
                      <span
                        onClick={() => {
                          setSelectedNode(treeData);
                          setAddCategory({
                            name: treeData.name,
                            status: treeData.status,
                            parentCategory: null,
                            image: "",
                          });
                        }}
                      >
                        {treeData.name}
                      </span>
                    </div>
                  </div>
                }
              >
                {treeData.children &&
                  expandedNodes.has(treeData.attributes?.id || treeData.name) &&
                  treeData.children.map((child) => (
                    <React.Fragment key={child.attributes?.id || child.name}>
                      {renderTreeNode(child)}
                    </React.Fragment>
                  ))}
              </Tree>
            </div>
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
              <p
                className="text-sm text-center"
                style={{ color: BASE_COLORS.gray }}
              >
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

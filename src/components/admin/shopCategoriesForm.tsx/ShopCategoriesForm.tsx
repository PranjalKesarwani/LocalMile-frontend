import axios from "axios";
import { useEffect, useState } from "react";
import { Tree, TreeNodeDatum } from "react-d3-tree";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../Url";

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
    <div
      className="flex items-center flex-col showBorder overflow-y-auto w-full"
      style={{ display: "flex", height: "100vh" }}
    >
      <div className="w-full showBorder" style={{ flex: 1 }}>
        <Tree
          data={treeData}
          orientation="vertical"
          pathFunc="step"
          translate={{ x: 200, y: 100 }}
          renderCustomNodeElement={(rd3tProps) => (
            <g>
              <rect
                width={120}
                height={40}
                x={-60}
                y={-20}
                fill="#4CAF50"
                rx={5}
                onClick={() => setSelectedNode(rd3tProps.nodeDatum as any)}
              />
              <text
                fill="black"
                textAnchor="middle"
                dy="0.3em"
                onClick={() => setSelectedNode(rd3tProps.nodeDatum as any)}
              >
                {rd3tProps.nodeDatum.name}
              </text>
            </g>
          )}
        />
      </div>

      <div
        className="w-full"
        style={{ width: 300, padding: 20, borderLeft: "1px solid #ccc" }}
      >
        <h3>
          <h3>
            {selectedNode
              ? `Edit Category: ${selectedNode.name}`
              : "Select a category"}
          </h3>
        </h3>
        <input
          type="text"
          placeholder="New category name"
          value={addCategory?.name}
          onChange={(e) =>
            setAddCategory({ ...addCategory, name: e.target.value })
          }
          style={{ margin: "10px 0", padding: 8, width: "100%" }}
        />
        <input
          type="text"
          placeholder="Parent Category ID"
          value={selectedNode?.attributes?.id}
          onChange={(e) =>
            setAddCategory({ ...addCategory, parentCategory: e.target.value })
          }
          style={{ margin: "10px 0", padding: 8, width: "100%" }}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={addCategory?.image || ""}
          onChange={(e) =>
            setAddCategory({ ...addCategory, image: e.target.value })
          }
          style={{ margin: "10px 0", padding: 8, width: "100%" }}
        />
        <select
          value={addCategory?.status || "active"}
          onChange={(e) =>
            setAddCategory({
              ...addCategory,
              status: e.target.value as "active" | "inactive",
            })
          }
          style={{ margin: "10px 0", padding: 8, width: "100%" }}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {/* <button
          onClick={() => handleAddCategory("ADD", addCategory)}
          disabled={!selectedNode || !addCategory.name}
          style={{
            padding: "8px 16px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Add Subcategory
        </button> */}
        <div className="flex items-center justify-center w-full">
          <button
            onClick={() => handleAddCategory("ADD", addCategory)}
            style={{
              margin: "10px",
              padding: "8px",
              backgroundColor: "#2196F3",
              color: "white",
              borderRadius: 4,
            }}
          >
            Add Subcategory
          </button>
          <button
            onClick={() => handleAddCategory("UPDATE", addCategory)}
            style={{
              margin: "10px",
              padding: "8px",
              backgroundColor: "#FF9800",
              color: "white",
              borderRadius: 4,
            }}
          >
            Update Category
          </button>
          <button
            onClick={() => handleAddCategory("DELETE", addCategory)}
            style={{
              margin: "10px",
              padding: "8px",
              backgroundColor: "#F44336",
              color: "white",
              borderRadius: 4,
            }}
          >
            Delete Category
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryTree;

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
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleAddCategory = async (action: string, payload: TCatetory) => {
    if (action === "GET") {
      const res = await axios.post(
        `${BASE_URL}/admin/handle-category-actions`,
        {
          action: action,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setTreeData(res.data);
    } else if (action === "ADD") {
      const { name, status, parentCategory, image = "" } = payload;
      if (!selectedNode) return;
      if (!name || !status || !parentCategory) {
        toast.error("Please fill all fields!");
        return;
      }
      const res = await axios.post(
        `${BASE_URL}/admin/handle-category-actions`,
        {
          action: action,
          name: name,
          status: status,
          parentCategory: selectedNode.attributes?.id,
          image: image,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.status === 201) {
        toast.success("Category added successfully!");
        return;
      }

      const newCategory: any = {
        name: name,
        status: status,
        attributes: { id: Date.now().toString() },
      };

      const updateTree = (node: CustomNodeDatum): CustomNodeDatum => ({
        ...node,
        children:
          node.attributes?.id === selectedNode.attributes?.id
            ? [...(node.children || []), newCategory]
            : node.children?.map(updateTree as any),
      });

      setTreeData(updateTree(treeData));
      setNewCategoryName("");
      toast.success("Category added successfully!");
    }
  };

  useEffect(() => {
    const fetchTree = async () => {
      await handleAddCategory("GET", addCategory);
    };
    fetchTree();
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ flex: 1, border: "1px solid #ccc" }}>
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

      <div style={{ width: 300, padding: 20, borderLeft: "1px solid #ccc" }}>
        <h3>
          {selectedNode ? `Add to: ${selectedNode.name}` : "Select a node"}
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
          value={addCategory?.parentCategory || ""}
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
        <input
          type="text"
          placeholder="Status"
          value={addCategory?.status || ""}
          onChange={(e) =>
            setAddCategory({
              ...addCategory,
              status: e.target.value === "inactive" ? "inactive" : "active",
            })
          }
          style={{ margin: "10px 0", padding: 8, width: "100%" }}
        />
        <button
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
        </button>
      </div>
    </div>
  );
};

export default CategoryTree;

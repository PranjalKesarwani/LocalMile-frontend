import { useState } from "react";
import { Tree, TreeNodeDatum } from "react-d3-tree";
import { toast } from "react-toastify";

// Extend the default TreeNodeDatum type
interface CustomNodeDatum extends TreeNodeDatum {
  status: "active" | "inactive";
  attributes?: {
    id: string;
  };
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
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleAddCategory = () => {
    if (!selectedNode || !newCategoryName) return;

    const newCategory: any = {
      name: newCategoryName,
      status: "active",
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
  };

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
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          style={{ margin: "10px 0", padding: 8, width: "100%" }}
        />
        <button
          onClick={handleAddCategory}
          disabled={!selectedNode || !newCategoryName}
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

import React, { useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { DndProvider } from "react-dnd";
import {
  Tree,
  MultiBackend,
  getBackendOptions,
  getDescendants
} from "@minoru/react-dnd-treeview";
import Button from "@mui/material/Button";
import { theme } from "./theme";
import { CustomNode } from "./CustomNode";
import styles from "./App.module.css";
// import { AddDialog } from "./AddDialog";
import DialogAlert from "./DialogAlert";
import { deleteCategory, createCategory, fetchCategories } from '@/api/categoryService';

import { Toast } from '@/core/CustomHotToast';


function arrayToTree(items) {
  const tree = [];
  const lookup = {};

  for (const item of items) {
    lookup[item.id] = { ...item, children: [] };
  }

  for (const item of items) {
    if (item.parentId === null) {
      tree.push(lookup[item.id]);
    } else {
      lookup[item.parentId]?.children.push(lookup[item.id]);
    }
  }

  return tree;
}

function CategoryTree({ categoryOptions, category, onCategoryChange }) {


  console.log(JSON.stringify(categoryOptions));

  function convertCategoryData(categories, parentId = 0) {
    return categories.flatMap((category) => [
      {
      id: category.id,
      parent: parentId === 0 ? null : parentId,
      text: category.name,
      droppable: category.children && category.children.length > 0,
      },
     ...(category.children ? convertCategoryData(category.children, category.id) : []),
    ]);
  }

  console.log(convertCategoryData(categoryOptions));

  const [openDialog, setOpenDialog] = useState(false);
  const [treeData, setTreeData] = useState(convertCategoryData(categoryOptions));
  const [selectedNode, setSelectedNode] = useState(null);
  const [forceUpdate, setForceUpdate] = useState(0);

  const handleDrop = (newTree) => setTreeData(newTree);
  const handleSelect = (e, node) => {
     e.stopPropagation();
  if (selectedNode && selectedNode.id === node.id) {
    // If the node is already selected, deselect it
    setSelectedNode(null);
  } else {
    onCategoryChange(node.id);
    setSelectedNode(node);
    // onCategorySelect(node.id);
  }
  };

   // Set the selected node if a category is passed
  useState(() => {
    if (category) {
      const selected = treeData.find((node) => node.id === category);
      if (selected) {
        setSelectedNode(selected);
      }
    }
  }, [category, treeData]);

const fetchAndUpdateTreeData = async () => {
  try {
    const categories = await fetchCategories();
    const convertedCategories = convertCategoryData(categories);
    setTreeData(convertedCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

const handleAddNode = async (newNode) => {
  console.log("handleAddNode:", newNode); // Log the newNode object
  console.log("newNode.text:", newNode.text); // Log the newNode.text property
  console.log("newNode JSON:", JSON.stringify(newNode)); // Log the JSON stringified newNode object
  if (newNode.text === "") throw new Error("Can't be empty");
  try {
    const createdCategory = await createCategory({
      name: newNode.text,
      parentId: newNode.parent,
    });

    const newTreeData = [...treeData, { ...createdCategory, text: createdCategory.name, droppable: newNode.droppable }];
    console.log(newTreeData);
    console.log('newtree!');
    setTreeData(newTreeData);
    Toast.success('Categorie gecreeërd');
    setOpenDialog(false);
    fetchAndUpdateTreeData();
    setForceUpdate(forceUpdate + 1);

  } catch (error) {
    console.error('Error adding category:', error);
    Toast.error('Error creating category');
    setOpenDialog(false);
  }
};

const handleDeleteNode = async (id) => {
  // Delete the category and related products via the API
  try {
    await deleteCategory(id);
  } catch (error) {
    Toast.error('Error deleted category');
  }
  Toast.success('Categorie verwijderd');
   fetchAndUpdateTreeData(); // Fetch and update the tree data
  // Update the tree data in the state
  const newTree = treeData.filter((node) => node.id !== id);
  setTreeData(newTree);
};

return (
  <div className="app" style={{display: "flex", flexDirection: "column"}}>
      <DialogAlert
        selectedNode={selectedNode}
        title="Add Node"
        onClose={() => setOpenDialog(false)}
        onConfirm={(name) => {
          handleAddNode({
            id: selectedNode ? selectedNode.id : null,
            parent: selectedNode ? selectedNode.id : null,
            text: name,
            droppable: false,
          }),
          setOpenDialog(false);
        }}
      />
    <DndProvider backend={MultiBackend} options={getBackendOptions()}>
      <Tree
      key={forceUpdate}
        tree={treeData}
        rootId={null}
        render={(node, { depth, isOpen, onToggle }) => (
          <CustomNode
            node={node}
            depth={depth}
            isOpen={isOpen}
            isSelected={node.id === selectedNode?.id}
            onToggle={onToggle}
            onSelect={handleSelect}
            onDelete={handleDeleteNode}
          />
        )}
        dragPreviewRender={(monitorProps) => (
          <div>{monitorProps.item.text}</div>
        )}
        onDrop={handleDrop}
      />
    </DndProvider>
  </div>
);


}


export default CategoryTree;
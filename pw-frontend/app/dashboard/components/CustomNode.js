import React from "react";
import { NodeProps } from "@minoru/react-dnd-treeview";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";

export const CustomNode = ({
  node,
  depth,
  isOpen,
  isSelected,
  onToggle,
  onSelect,
  onDelete,
}) => {


  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this category?")) {
      onDelete(id);
    }
  };

  const getFontSize = (depth) => {
    switch (depth) {
      case 0:
        return "16px";
      case 1:
        return "14px";
      default:
        return "12px";
    }
  };

  return (
    <Paper
      elevation={1}
      style={{
        margin: "4px 0",
        padding: "4px 8px",
        display: "flex",
        alignItems: "center",
        background: isSelected ? "#13152591" : "inherit",
      }}
      onClick={(e) => onSelect(e, node)}
    >
      <div style={{ display: "flex", marginLeft: depth * 16 }}>
        {node.droppable && (
          <Button
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          >
            {isOpen ? "-" : "+"}
          </Button>
        )}
        <Typography variant="body1" style={{ fontSize: getFontSize(depth) }}>
          {node.text}
        </Typography>
      </div>
      <div style={{ marginLeft: "auto" }}>
        <IconButton
          size="small"
          onClick={(e) => handleDelete(e, node.id)}
          edge="end"
          style={{ fontSize: "12px" }}
        >
          Delete
        </IconButton>
      </div>
    </Paper>
  );
};

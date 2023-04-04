import React, { useState, useEffect } from 'react';

function CategorySelectorTwee({ category, categoryOptions, onChange }) {
  const [activeCategory, setActiveCategory] = useState(category);
  const [categoryTree, setCategoryTree] = useState(null);

  // Create category tree on mount
  useEffect(() => {
    const createTree = (categories, parentId = null) => {
      try {
        const nodes = {};
        categories.forEach(category => {
          const { id, name, children } = category;
          nodes[id] = {
            id,
            name,
            parentId,
            children: createTree(children, id),
          };
        });
        return nodes;
      } catch (error) {
        console.error('Error creating category tree:', error);
        return null;
      }
    };

    setCategoryTree(createTree(categoryOptions));
  }, [categoryOptions]);

  // Get active category and its parent categories
  const getActiveCategoryAndParents = (categoryId, tree) => {
    if (!tree) {
      return [];
    }
    const category = tree[categoryId];
    if (!category) {
      return [];
    }
    const { id, name, parentId } = category;
    const parentCategories = parentId ? getActiveCategoryAndParents(parentId, tree) : [];
    return [...parentCategories, { id, name }];
  };

  // Get direct children of active category
  const getDirectChildren = (categoryId, tree) => {
    if (!tree) {
      return [];
    }
    const category = tree[categoryId];
    if (!category) {
      return [];
    }
    return Object.values(category.children);
  };

  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    setActiveCategory(categoryId);
    onChange(categoryId);
  };

  // Render category options recursively
  const renderCategoryOptions = (categories, indentLevel = 0) => {
    if (!Array.isArray(categories)) {
      return null;
    }
    return categories.map(category => {
      const { id, name, children } = category;
      return (
        <React.Fragment key={id}>
          <option value={id}>{' '.repeat(indentLevel * 2)}{name}</option>
          {renderCategoryOptions(children, indentLevel + 1)}
        </React.Fragment>
      );
    });
  };

  // Render component
  return (
    <div>
      <label htmlFor="category">Category:</label>
      <select id="category" value={activeCategory} onChange={e => handleCategorySelect(e.target.value)}>
        {renderCategoryOptions(getActiveCategoryAndParents(activeCategory, categoryTree))}
        {renderCategoryOptions(getDirectChildren(activeCategory, categoryTree), 1)}
      </select>
    </div>
  );
}

export default CategorySelectorTwee;

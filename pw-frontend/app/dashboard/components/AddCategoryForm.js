import React, { useState, useEffect, useMemo } from "react";
import CreatableSelect from "react-select/creatable";

function CategorySelector({
  categoryOptions,
  onCategoryChange,
  onNewCategory,
  onSubmit,
  category
}) {
  const [mainCategory, setMainCategory] = useState(null);
  const [level1Category, setLevel1Category] = useState(null);
  const [level11Category, setLevel11Category] = useState(null);

  console.log(categoryOptions);
  console.log('-------------');
  console.log(category);

useEffect(() => {
  if (category) {
    const topLevelCategory = findCategoryById(category);
    if (topLevelCategory && topLevelCategory.children) {
      setLevel1Category(
        topLevelCategory.children.map((child) => ({
          value: child.id,
          label: child.name,
        }))
      );
    } else {
      setLevel1Category(null);
    }
  } else {
    setLevel1Category(null);
  }
  setLevel11Category(null);
}, [mainCategory]);



const findCategoryById = (id) => {
  if (!id) return null;

  const findInChildren = (children, id) => {
    if (!children) return null;

    for (const child of children) {
      if (child.id === id) return child;

      const grandchild = findInChildren(child.children, id);
      if (grandchild) return grandchild;
    }
    return null;
  };

  for (const category of categoryOptions) {
    console.log("category:", category);
    if (category.id === id) return category;

    const child = findInChildren(category.children, id);
    if (child) return child;
  }

  return null;
};


useEffect(() => {
  if (!categoryOptions.length) return;
  if (!category) return;
  const setCurrentCategories = (category) => {
    const currentCategory = findCategoryById(category);
    console.log("currentCategory:", currentCategory);

    if (!currentCategory) {
      setMainCategory(null);
      setLevel1Category(null);
      setLevel11Category(null);
      return;
    }

    if (!currentCategory.parentId) {
      setMainCategory({ value: currentCategory.id, label: currentCategory.name });
      setLevel1Category(null);
      setLevel11Category(null);
    } else {
      const parentCategory = findCategoryById(currentCategory.parentId);
      console.log("parentCategory:", parentCategory);


      if (!parentCategory.parentId) {
        setMainCategory({ value: parentCategory.id, label: parentCategory.name });
        setLevel1Category({ value: currentCategory.id, label: currentCategory.name });
        setLevel11Category(null);
      } else {
        const grandparentCategory = findCategoryById(parentCategory.parentId);
        console.log("grandparentCategory:", grandparentCategory);
        setMainCategory({ value: grandparentCategory.id, label: grandparentCategory.name });
        setLevel1Category({ value: parentCategory.id, label: parentCategory.name });
        setLevel11Category({ value: currentCategory.id, label: currentCategory.name });
      }
    }
  };

  setCurrentCategories(category);
}, [category, categoryOptions]);




  const handleSelectChange = (level, newValue, actionMeta) => {
    if (actionMeta.action === "create-option") {
      const parentId =
        level === "level1" ? mainCategory?.id : level1Category?.id;

      onSubmit({ name: newValue.label, parent_id: parentId }).then(
        (newCategory) => {
          onNewCategory(newCategory);

          if (level === "main") {
            setMainCategory(newCategory);
            setLevel1Category(null);
            setLevel11Category(null);
          } else if (level === "level1") {
            setLevel1Category(newCategory);
            setLevel11Category(null);
          } else {
            setLevel11Category(newCategory);
          }

          onCategoryChange(newCategory.id);
        }
      );
    } else {
      if (level === "main") {
        setMainCategory(newValue);
        setLevel1Category(null);
        setLevel11Category(null);
      } else if (level === "level1") {
        setLevel1Category(newValue);
        setLevel11Category(null);
      } else {
        setLevel11Category(newValue);
      }

      onCategoryChange(newValue?.id);
    }
  };

  const formatCategoryOptions = (categories) => {
    return categories.map((category) => ({
      id: category.id,
      label: category.name,
    }));
  };

  const topLevelCategories = useMemo(
    () =>
      formatCategoryOptions(
        categoryOptions.filter((option) => !option.parentId)
      ),
    [categoryOptions]
  );

  const level1Categories = useMemo(
    () =>
      formatCategoryOptions(
        categoryOptions.filter((option) => option.parentId === mainCategory?.id)
      ),
    [categoryOptions, mainCategory]
  );
  const level11Categories = useMemo(
    () =>
      formatCategoryOptions(
        categoryOptions.filter(
          (option) => option.parentId === level1Category?.id
        )
      ),
    [categoryOptions, level1Category]
  );

  return (
    <div>
      <CreatableSelect
        value={mainCategory}
        onChange={(newValue, actionMeta) =>
          handleSelectChange("main", newValue, actionMeta)
        }
        options={topLevelCategories}
        placeholder="Main Category"
      />
      <CreatableSelect
        value={level1Category}
        onChange={(newValue, actionMeta) =>
          handleSelectChange("level1", newValue, actionMeta)
        }
        options={level1Categories}
        placeholder="Level 1 Category"
        isDisabled={!mainCategory}
      />
      <CreatableSelect
        value={level11Category}
        onChange={(newValue, actionMeta) =>
          handleSelectChange("level11", newValue, actionMeta)
        }
        options={level11Categories}
        placeholder="Level 1.1 Category"
        isDisabled={!level1Category}
      />
    </div>
  );
}

export default CategorySelector;

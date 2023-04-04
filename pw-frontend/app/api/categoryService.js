const API_URL = 'http://localhost:3001/api/categories';

// In your frontend, e.g., in a useEffect hook or a function called when the component is loaded
export const fetchCategories = async () => {
  console.log("fetchCategories");
  try {
    const response = await fetch(`${API_URL}`);
    const categories = await response.json();
console.log('categories:', categories);
    return categories;
    // Set the state with the fetched categories
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}


export const handleAddCategory = async (categoryName, parentCategoryId = null) => {
  try {
    // Send a POST request to your API with the category data
    const response = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: categoryName,
        parentId: parentCategoryId,
      }),
    });

    const newCategory = await response.json();
    console.log('newCategory in handleAddCategory:', newCategory);
    return newCategory;
    // Add the new category to the categoryOptions state
  } catch (error) {
    console.error('Error creating new category:', error);
  }
};


// app/api/categoryService.js
export const createCategory = async (categoryData) => {
  console.log("createCategory");
  try {
    const response = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      throw new Error('Error creating category');
    }

    const newCategory = await response.json();
    return newCategory;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    const response = await fetch(`${API_URL}/${categoryId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Error deleting category');
    }

    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

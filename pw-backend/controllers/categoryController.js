const fs = require('fs');
const path = require('path');
const { Category, Product } = require('../models');
const slugify = require('slugify');

// The recursive function for building the category tree
async function buildCategoryTree(categoryId) {
  console.log("buildCategoryTree");
  const category = await Category.findByPk(categoryId);
  const subcategories = await Category.findAll({ where: { parentId: categoryId } });

  console.log(`Subcategories for ${categoryId}:`, subcategories);

  if (subcategories.length === 0) {
    return { ...category.toJSON(), children: [] };
  }

  const children = await Promise.all(
    subcategories.map(async (subcategory) => buildCategoryTree(subcategory.id))
  );

  return { ...category.toJSON(), children };
}

async function buildFullCategoryTree() {
  try {
    const categories = await Category.findAll({ where: { parentId: null } });
    const categoryTree = await Promise.all(
      categories.map(async (category) => buildCategoryTree(category.id))
    );

    return categoryTree;
  } catch (error) {
    console.error('Error fetching category tree:', error);
    throw error;
  }
}


exports.getFullCategoryTree = async (req, res) => {
  try {
    const categoryTree = await buildFullCategoryTree();
    res.json(categoryTree);
  } catch (error) {
    console.error('Error fetching category tree:', error);
    res.status(500).json({ message: `Error fetching category tree: ${error.message}` });
  }
};


exports.createCategory = async (req, res) => {
  console.log('createCategory loaded');
  try {
    const { name, parentId } = req.body; // Update the property name here

    const newCategory = await Category.create({
      name: name,
      slug: slugify(name, { lower: true }),
      parentId: parentId || null, // Update the property name here
    });

    await updateCategoryStructure();

    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Error creating category' });
  }
};

async function updateCategoryStructure() {
  try {
    const categoryTree = await buildFullCategoryTree();
    const filePath = path.resolve(__dirname, '../categoryStructure.json');
    fs.writeFileSync(filePath, JSON.stringify(categoryTree, null, 2), 'utf8');
  } catch (error) {
    console.error('Error updating category structure:', error);
    throw error;
  }
}


exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    // Delete all related products
    // You'll need to implement this function in your product model
    await Product.deleteAllByCategoryId(categoryId);

    // Delete the category
    await Category.destroy({ where: { id: categoryId } });


    await updateCategoryStructure();

    res.status(200).json({ message: 'Category and related products deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: `Error deleting category: ${error.message}` });
  }
};


exports.getCategoryStructure = async (req, res) => {
  try {
    const filePath = path.resolve(__dirname, '../categoryStructure.json');
    const data = fs.readFileSync(filePath, 'utf8');
    const categoryStructure = JSON.parse(data);
    res.status(200).json(categoryStructure);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category structure' });
  }
};

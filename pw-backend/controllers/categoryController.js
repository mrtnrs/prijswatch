const fs = require('fs');
const path = require('path');
const { Category, Product, MetaProduct } = require('../models');
const slugify = require('slugify');

let CATEGORY_STRUCTURE = '';

if(process.env.ENVIRONMENT === "production"){
  CATEGORY_STRUCTURE = '/var/data/categoryStructure.json';
} else {
  CATEGORY_STRUCTURE = path.resolve(__dirname, '../categoryStructure.json');
}


// The recursive function for building the category tree
async function buildCategoryTree(categoryId) {
  console.log("buildCategoryTree");
  const category = await Category.findByPk(categoryId);
  const subcategories = await Category.findAll({ where: { parentId: categoryId } });

  if (subcategories.length === 0) {
    return { ...category.toJSON(), children: [] };
  }

  const children = await Promise.all(
    subcategories.map(async (subcategory) => buildCategoryTree(subcategory.id))
  );

  return { ...category.toJSON(), children };
}

async function buildFullCategoryTree() {
  console.log('buildfullcat');
  try {
    const categories = await Category.findAll({ where: { parentId: null } });
    const categoryTree = await Promise.all(
      categories.map(async (category) => buildCategoryTree(category.id))
    );

    return categoryTree;
  } catch (error) {
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
  try {
    const { name, parentId } = req.body; // Update the property name here

    const newCategory = await Category.create({
      name: name,
      slug: slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g }),
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
  console.log('updatecatstruct');
  try {
    const categoryTree = await buildFullCategoryTree();
    const version = Date.now(); // Use a timestamp as the version
    const categoryData = {
      version,
      tree: categoryTree,
    };
    fs.writeFileSync(CATEGORY_STRUCTURE, JSON.stringify(categoryData, null, 2), 'utf8');
  } catch (error) {
    console.error('Error updating category structure:', error);
    throw error;
  }
}


// Helper function to delete categories recursively
const deleteCategoryRecursively = async (categoryId) => {
  // Fetch the category's subcategories
  const subcategories = await Category.findAll({ where: { parentId: categoryId } });

  // Delete each subcategory recursively
  for (const subcategory of subcategories) {
    await deleteCategoryRecursively(subcategory.id);
  }

  // Delete all related MetaProducts and their associated Products and Prices
  const metaProducts = await MetaProduct.findAll({ where: { categoryId } });
  for (const metaProduct of metaProducts) {
    const products = await Product.findAll({ where: { metaProductId: metaProduct.id } });
    for (const product of products) {
      await Price.destroy({ where: { productId: product.id } }); // Delete related Prices
      await product.destroy(); // Delete the Product
    }
    await metaProduct.destroy(); // Delete the MetaProduct
  }

  // Finally, delete the category
  await Category.destroy({ where: { id: categoryId } });
};


exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    // Delete it all
    await deleteCategoryRecursively(categoryId);


    await updateCategoryStructure();

    res.status(200).json({ message: 'Category and related products deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: `Error deleting category: ${error.message}` });
  }
};


exports.getCategoryStructure = async (req, res) => {
  try {
    const data = fs.readFileSync(CATEGORY_STRUCTURE, 'utf8');
    const categoryStructure = JSON.parse(data);
    console.log('filePath:', CATEGORY_STRUCTURE);
    console.log('categoryStructure:', categoryStructure);
    res.status(200).json(categoryStructure);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category structure' });
  }
};

// manual update cat structure

exports.regenerateCategoryStructure = async (req, res) => {
  try {
    await updateCategoryStructure();
    res.status(200).json({ message: 'Category structure regenerated successfully' });
  } catch (error) {
    console.error('Error regenerating category structure:', error);
    res.status(500).json({ message: `Error regenerating category structure: ${error.message}` });
  }
};



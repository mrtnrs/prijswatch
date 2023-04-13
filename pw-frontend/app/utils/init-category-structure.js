// public/init-category-structure.js
(async () => {
  const { categoryStructure } = await import('@/utils/categoryStructure');
  await categoryStructure.init();
  console.log('Initialized');
  // Now the categoryStructure.tree is ready to use
})();

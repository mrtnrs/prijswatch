const axios = require("axios");

const fetchProductsForPage = async (page) => {
  const url = `https://api.krefel.be/api/v2/krefel/categories/C937/products?fields=FULL&currentPage=${page}&pageSize=96&lang=nl`;

  const { data } = await axios.get(url);

  if (data.products.length === 0) {
    return null;
  }

  return data.products.map((product) => {
    const {
      code,
      name,
      price,
      images,
      brand,
      categories,
      url,
    } = product;

    const imageUrl = images && images[0] ? images[0].url : null;
    const category = categories && categories[0] ? categories[0].name : null;
    const productUrl = `https://www.krefel.be/nl${url}`

    return {
      code,
      name,
      brand: brand.name,
      category,
      imageUrl,
      productUrl,
      price: {
        value: price.value,
        currency: price.currencyIso,
        formattedValue: price.formattedValue,
      },
    };
  });
};

const fetchAllProducts = async () => {
  let allProducts = [];
  let currentPage = 1;

  while (true) {
    const products = await fetchProductsForPage(currentPage);

    if (!products) {
      break;
    }

    allProducts = allProducts.concat(products);
    currentPage += 1;
  }

  return allProducts;
};

fetchAllProducts()
  .then((products) => {
    console.log("All products fetched:", products);
    console.log(products.length);
  })
  .catch((error) => {
    console.error("Error fetching products:", error);
  });
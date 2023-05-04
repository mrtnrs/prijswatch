import { useState, useEffect, useCallback } from 'react';
import ProductGrid from './ProductGrid';

import findCategoryBySlug from './utils';
import { categoryStructure as importedCategoryStructure } from '@/utils/categoryStructure';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip';
import CustomIcon from '@/vercelFix/Icon'
import Button from '@mui/material/Button';
import ApexLineChart from '@/components/chartjs/ApexLineChart';

import updateCategoryTree from '@/core/utils/updateCategoryTree';
import productService from '@/api/productService';
import priceService from '@/api/priceService';

import Typography from '@mui/material/Typography';
import { hexToRGBA } from '@/core/utils/hex-to-rgba'
import { useTheme } from '@mui/material/styles'
const SERVER_URL = process.env.NEXT_PUBLIC_API_SERVER_URL;
const IMG_SERVER = process.env.NEXT_PUBLIC_IMG_SERVER;

import Image from 'next/image';


function ProductList({ products }) {
  return (
    <div>
      {products.map((product) => (
        <div key={product.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <img src={`${IMG_SERVER}${product.imageUrl}`} alt={product.name} width="50" height="50" />
          <div style={{ flexGrow: 1, paddingLeft: '10px' }}>
            <h4>{product.name}</h4>
            <p>Price: €{product.prijs}</p>
          </div>
          <Button variant="outlined">Visit Webshop</Button>
        </div>
      ))}
    </div>
  );
}



export default function SingleMetaProduct({ categorySlug, metaProductSlug, onProductNotFound, onProductNameUpdate }) {
  const [metaProduct, setMetaProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const categoryStructure = importedCategoryStructure.tree;
  const [displayMode, setDisplayMode] = useState('grid');

   const theme = useTheme()

  useEffect(() => {
    const storedDisplayMode = localStorage.getItem('displayMode');
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (storedDisplayMode) {
      setDisplayMode(storedDisplayMode);
    } else if (isMobile) {
      setDisplayMode('list');
    }
  }, []);

  const toggleDisplayMode = useCallback(() => {
    const newDisplayMode = displayMode === 'grid' ? 'list' : 'grid';
    setDisplayMode(newDisplayMode);
    localStorage.setItem('displayMode', newDisplayMode);
  }, [displayMode]);

  console.log('categorySlug', categorySlug);
  console.log('metaproductslug', metaProductSlug);

  useEffect(() => {
  async function fetchMetaProduct() {
    try {
      const res = await fetch(`${SERVER_URL}/api/products/${categorySlug}/${metaProductSlug}/meta-product`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.name) { // Check if data object has a name property
          setMetaProduct(data);
          onProductNameUpdate(data.name);
          setLoading(false);
        } else {
          onProductNotFound();
          setMetaProduct(null);
          setLoading(false);
        }
      } else {
        console.log("res ok not ok");
        setMetaProduct(null);
      }
    } catch (error) {
      onProductNotFound();
      setMetaProduct(null);
      setLoading(false);
      console.error(`Error in fetch request: ${error.message}`);
    }
  }

  fetchMetaProduct();
}, [categorySlug, metaProductSlug, onProductNotFound]);


  useEffect(() => {
    if (metaProduct && metaProduct.id) {
      async function fetchProductsData() {
        try {
          const data = await productService.fetchProducts(metaProduct.id);
          setProducts(data);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      }

      fetchProductsData();
    }
  }, [metaProduct]);

  useEffect(() => {
  if (metaProduct && metaProduct.id) {
    async function fetchPriceData() {
      try {
        const data = await priceService.fetchPriceData(metaProduct.id);
        console.log('data', data);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching price data:', error);
      }
    }

    fetchPriceData();
  }
}, [metaProduct]);

    const createSeriesArray = (products) => {
    return products.map((product) => {
      return {
        name: product.name,
        data: product.prices.map((price) => {
          return {
            x: new Date(price.createdAt),
            y: price.value,
          };
        }),
      };
    });
  };

 // const series = createSeriesArray(products);

    const series = [
  {
    name: "Product 1",
    data: [
      { x: "2023-01-01", y: 100 },
      { x: "2023-01-15", y: 120 },
      { x: "2023-02-01", y: 90 },
      { x: "2023-02-15", y: 150 },
      { x: "2023-03-01", y: 170 },
    ],
  },
  {
    name: "Product 2",
    data: [
      { x: "2023-01-01", y: 80 },
      { x: "2023-01-15", y: 110 },
      { x: "2023-02-01", y: 130 },
      { x: "2023-02-15", y: 140 },
      { x: "2023-03-01", y: 190 },
    ],
  },
];



  if (loading) {
    return <div>Loading...</div>;
  }

  if (!metaProduct) {
    return (
      <div>
        <h1>404 Not Found</h1>
        <p>The product or category you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <Container sx={{ mt:'4rem', pl: 0}}>
    <Box sx={{ flexGrow: 1,             background:"radial-gradient(141.61% 141.61% at 29.14% -11.49%, rgba(203, 213, 225, 0.15) 0%, rgba(203, 213, 225, 0) 57.72%)",
            "--tw-border-opacity": "1",
            borderColor: "rgb(31 41 55/var(--tw-border-opacity))",
            borderWidth: "1px",
            borderRadius: "1rem",
            boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.1)",
            padding: "2rem", }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={4}
                  sx={{

          }}
        >
          <Box sx={{ position: 'relative'}}>
          <Typography variant="h4" sx={{ fontWeight: '600'}}>{metaProduct.name}           <Box sx={{    
            display: "block",
            right: "0",
            position: "absolute",
            top: "0"}}>
                      <Tooltip title="Stel prijsalert in" placement="top">
                <IconButton aria-label='capture screenshot'>
                  <CustomIcon icon='mdi:bell-alert-outline' />
                </IconButton>
            </Tooltip>
              <Tooltip title="Voeg toe aan wishlist" placement="top">
                <IconButton aria-label='capture screenshot'>
                  <CustomIcon icon='mdi:playlist-plus' />
                </IconButton>
            </Tooltip>
            </Box></Typography>

            <p>{metaProduct.brand}</p>
            {metaProduct.imageUrl && (
              <Image src={`${IMG_SERVER}${metaProduct.imageUrl}`} alt={metaProduct.name} width={200} height={200}
              style={{ borderRadius: "25px",
    padding: "1rem",
    backgroundColor: "white",
    maxWidth: "18rem",
    marginTop: "2rem"}} />
            )}
            <p>{metaProduct.description}</p>



          </Box>
        </Grid>
        <Grid item xs={12} md={6} lg={8}>
          <ApexLineChart series={series}/>
        </Grid>
      </Grid>
    </Box>
    <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px 0',    backdropFilter: "blur(3px)",
    backgroundColor: "rgb(255 255 255 / 5%)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.1)",
    padding: "5px 10px",
    marginTop: "2rem",
    marginBottom: "2rem" }}>
        <Button onClick={toggleDisplayMode} sx={{ border: 'none !important', color: (theme) => (theme.palette.mode === 'light' ? '#BFBFD5' : '#57596C'),}}>
          {displayMode === 'grid' ? <CustomIcon icon='mdi:format-list-bulleted'  /> : <CustomIcon icon='mdi:dots-grid' />}
        </Button>
      </div>
      {displayMode === 'grid' ? (
        <ProductGrid products={products} />
      ) : (
        <ProductList products={products} />
      )}
  </Container>
  );
}

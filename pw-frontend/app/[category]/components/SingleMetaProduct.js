import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';

import updateCategoryTree from '@/core/utils/updateCategoryTree';
import productService from '@/api/productService';
import priceService from '@/api/priceService';

import Typography from '@mui/material/Typography';
import { hexToRGBA } from '@/core/utils/hex-to-rgba'
import { useTheme } from '@mui/material/styles'
const SERVER_URL = process.env.NEXT_PUBLIC_API_SERVER_URL;
const IMG_SERVER = process.env.NEXT_PUBLIC_IMG_SERVER;
import { useMediaQuery } from '@mui/material';

import Product from './Product';

import Image from 'next/image';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Switch from '@mui/material/Switch';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/system';

import CustomLegend from './CustomLegend';

// Dynamic metadata




const iOSBoxShadow =
  '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

const CustomSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? '#3880ff' : '#3880ff',
  height: 2,
  padding: '15px 0',
  '& .MuiSlider-thumb': {
    height: 28,
    width: 28,
    backgroundColor: '#fff',
    boxShadow: iOSBoxShadow,
    '&:focus, &:hover, &.Mui-active': {
      boxShadow:
        '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        boxShadow: iOSBoxShadow,
      },
    },
  },
  '& .MuiSlider-valueLabel': {
    fontSize: 12,
    fontWeight: 'normal',
    top: -6,
    backgroundColor: 'unset',
    color: theme.palette.text.primary,
    '&:before': {
      display: 'none',
    },
    '& *': {
      background: 'transparent',
      color: theme.palette.mode === 'dark' ? '#fff' : '#000',
    },
  },
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-rail': {
    opacity: 0.5,
    backgroundColor: '#bfbfbf',
  },
  '& .MuiSlider-mark': {
    backgroundColor: '#bfbfbf',
    height: 8,
    width: 1,
    '&.MuiSlider-markActive': {
      opacity: 1,
      backgroundColor: 'currentColor',
    },
  },
}));

function SingleMetaProduct({ categorySlug, metaProductSlug, onProductNotFound, onProductNameUpdate }) {
  const [showGraph, setShowGraph] = useState(false);
  const [metaProduct, setMetaProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const categoryStructure = importedCategoryStructure.tree;
  const [displayMode, setDisplayMode] = useState('grid');
  const [singleDataPoint, setSingleDataPoint] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedWebshops, setSelectedWebshops] = useState(new Set());
  const [webshops, setWebshops] = useState([]);
  const [sortedProducts, setSortedProducts] = useState(products);
  const [order, setOrder] = useState('asc');
  const [priceFilter, setPriceFilter] = useState([0, Infinity]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  const [sliderValue, setSliderValue] = useState([minPrice, maxPrice]);
  const [seriesLoading, setSeriesLoading] = useState(true);
  const [series, setSeries] = useState([]);


  const theme = useTheme();
  const isUp = useMediaQuery(theme => theme.breakpoints.up('sm'));
  const isDown = useMediaQuery(theme => theme.breakpoints.down('sm'));

  console.log('typeof window: ', typeof window);

  useEffect(() => {
    if(isUp) {
      console.log('IS UP');
      setShowGraph(true);
    } else {
      console.log('IS DOWN');
      setShowGraph(false);
    }
  }, [isUp]);

  const sortProducts = (order) => {
    const sorted = [...products].sort((a, b) => {
      return order === 'asc' ? a.price - b.price : b.price - a.price;
    });
    setSortedProducts(sorted);
  };


const toggleOrder = () => {
  const newOrder = order === 'asc' ? 'desc' : 'asc';
  setOrder(newOrder);

  const sorted = [...products].sort((a, b) => {
    return newOrder === 'asc' ? a.latestPrice - b.latestPrice : b.latestPrice - a.latestPrice;
  });

  setSortedProducts(sorted);
};


function handleSliderChange(event, newValue) {
    // Get the minimum and maximum prices from the slider
    setSliderValue(newValue);

    var minPrice = newValue[0];
    var maxPrice = newValue[1];

    // Get all the products
    var products = document.getElementsByClassName('product');

    // Loop through each product
    for (var i = 0; i < products.length; i++) {
        // Get the product's price
        var productPrice = Number(products[i].getAttribute('data-price'));

        // Check if the product's price is within the selected range
        if (productPrice >= minPrice && productPrice <= maxPrice) {
            // If it is, show the product
            products[i].style.display = 'block';
        } else {
            // Otherwise, hide it
            products[i].style.display = 'none !important';
        }
    }
}


  // The following code block is added to apply price filter and webshop filter together:
useEffect(() => {
  const filtered = sortedProducts.filter(
    (product) =>
      selectedWebshops.has(product.webshopId)
  );
  setFilteredProducts(filtered);
}, [sortedProducts, priceFilter, selectedWebshops]);



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
    console.log('entering fetchMEtaProduct');
    try {
      console.log('fetching priduct');
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
        setSortedProducts(data); // also update sortedProducts
        const processedData = createSeriesArray(data);
            setSeries(processedData);

        // Set the loading state to false
        setSeriesLoading(false);

      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }

    fetchProductsData();
  }
}, [metaProduct]);


    useEffect(() => {
    // Step 2: Check if there's only one date for each product
    const hasSingleDataPoint = products.every(
      (product) => product.prices.length === 1
    );
 setSingleDataPoint(hasSingleDataPoint);
  }, [products]);

useEffect(() => {
  if (products.length > 0) {
  setMinPrice(Math.min(...products.map((product) => product.latestPrice).filter(price => !isNaN(price))));
  setMaxPrice(Math.max(...products.map((product) => product.latestPrice).filter(price => !isNaN(price))))
  const uniqueWebshops = Array.from(new Set(products.map(product => product.webshopId)))
    .map(webshopId => {
      const product = products.find(p => p.webshopId === webshopId);
      if (product && product.webshop) {
        return { id: webshopId, name: product.webshop.name, logo: product.webshop.logo };
      }
      return null;
    })
    .filter(webshop => webshop !== null);
  setWebshops(uniqueWebshops);
  setSelectedWebshops(new Set(uniqueWebshops.map(webshop => webshop.id)));
  }
}, [products]);

useEffect(() => {
    setSliderValue([minPrice, maxPrice]);
}, [minPrice, maxPrice]);


//   const filteredProducts = useMemo(() => {
//   return products.filter((product) => selectedWebshops.has(product.webshopId));
// }, [products, selectedWebshops]);

const createSeriesArray = (products) => {
  return products.map((product) => {
    const productData = product.prices.map((price) => { // Reverse the prices array
      const date = new Date(price.createdAt);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
      const year = date.getFullYear().toString().substr(-2);

      return {
        x: `${day}/${month}/${year}`,
        y: price.value,
      };
    });

    return {
      name: product.name,
      webshop: product.webshop.name,
      data: productData,
    };
  });
};


  const handleWebshopClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

const handleToggleWebshop = (webshopId) => {
  setSelectedWebshops((prevState) => {
    const updatedWebshops = new Set(prevState);
    if (prevState.has(webshopId)) {
      updatedWebshops.delete(webshopId);
    } else {
      updatedWebshops.add(webshopId);
    }
    return updatedWebshops;
  });
};

const resetFilter = () => {
  setSelectedWebshops(new Set(webshops.map(webshop => webshop.id)));
};

   
   console.log('series: ', series);



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
    <>
    {metaProduct && (
      <head>

        <title>{`Koop de ${metaProduct.brand} ${metaProduct.name} aan de beste prijs - prijs.watch`}</title>
        <meta name="description" content={`Vergelijk prijzen voor ${metaProduct.name} op prijs.watch. Vind de laagste prijs uit verschillende webshops.`} />

        {/* OpenGraph tags */}
        <meta property="og:title" content={`${metaProduct.name} voor de beste prijs - prijs.watch`} />
        <meta property="og:description" content={`Vergelijk prijzen voor ${metaProduct.name} op prijs.watch. Vind de laagste prijs uit verschillende webshops. Prijs varieert van €${minPrice} tot €${maxPrice}.`} />
        <meta property="og:image" content={`${IMG_SERVER}${metaProduct.imageUrl}`} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="product" />
        <meta property="product:price:amount" content={`${minPrice}-${maxPrice}`} />
        <meta property="product:price:currency" content="EUR" />
        <meta property="og:site_name" content="prijs.watch" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Koop de ${metaProduct.brand} ${metaProduct.name} aan de beste prijs - prijs.watch`} />
        <meta name="twitter:description" content={`Vergelijk prijzen voor de ${metaProduct.name} op prijs.watch. Vind de laagste prijs uit verschillende webshops. De prijs varieert van €${minPrice} tot €${maxPrice}.`} />
        <meta name="twitter:image" content={`${IMG_SERVER}${metaProduct.imageUrl}`} />


        {/* Additional metadata */}
        <meta name="keywords" content={`${metaProduct.name}, ${metaProduct.brand}, prijs vergelijken, beste prijs, webshops`} />

        {/* To add: retailers; product availability */}

      </head>
    )}
    <Container sx={{ mt:{xs: '1rem', md: '4rem'}, pl: 0, mb: '10rem'}}>
    <Box sx={{ flexGrow: 1,             background:"radial-gradient(141.61% 141.61% at 29.14% -11.49%, rgba(203, 213, 225, 0.15) 0%, rgba(203, 213, 225, 0) 57.72%)",
            "--tw-border-opacity": "1",
            borderColor: "rgb(31 41 55/var(--tw-border-opacity))",
            borderWidth: "1px",
            borderRadius: "1rem",
            boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.1)",
            padding: "1rem 2rem", }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4} lg={4}>
          <Box sx={{ position: 'relative'}}>
          <Typography variant="h4" sx={{ fontWeight: '600'}}>{metaProduct.name}           
          <Box sx={{    
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
    maxWidth: isDown ? '10rem' : "18rem",
    marginTop: "2rem",
    margin: isDown ? "1.3rem auto" : "unset" }} />
            )}
            <p>{metaProduct.description}</p>

            <Box sx={{ display: { xs: "flex", md: "none !important" }}}>
              <Button onClick={() => setShowGraph(!showGraph)} sx={{margin: '0 auto', border: 'none !important', color: (theme) => (theme.palette.mode === 'light' ? '#BFBFD5' : '#57596C'),}}>
                <CustomIcon icon='mdi:chart-line' /> {showGraph ? "Verberg prijsgrafiek" : "Toon prijsgrafiek"}
              </Button>
            </Box>



          </Box>
        </Grid>
        {(showGraph || isUp) && !seriesLoading && ( <Grid item xs={12} md={8} lg={8} sx={{maxHeight: '430px', position: 'relative', marginTop: {xs: '2rem', md: 'unset'}}}>
        {singleDataPoint && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(255, 255, 255, 0.01)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1,
              borderRadius: 1,
              overflow: 'hidden',
              maxWidth: '100%',
              margin: '0 auto',
            }}
          >
            <Typography variant="body1" sx={{opacity: '.7', textAlign: 'center'}}>
              Onvoldoende historische prijsdata<br/> om grafiek te tonen.
            </Typography>
          </Box>
        )}
        <Box sx={{ position: "relative", filter: singleDataPoint ? "blur(2px); max-height: 280px; overflow: hidden" : "none" }}>
          <CustomLegend series={series}>
            {(filteredSeries) => <ApexLineChart series={filteredSeries} />}
          </CustomLegend>
          </Box>
        </Grid>
        )}
      </Grid>
    </Box>
    <div style={{ display: 'flex', justifyContent: 'flex-start', margin: '10px 0',    backdropFilter: "blur(3px)",
    backgroundColor: "rgb(255 255 255 / 5%)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    boxShadow: theme.palette.mode === 'light' ? "0px 5px 10px rgba(0, 0, 0, .15) " : "2px 2px 2px rgba(0, 0, 0, 0.1)",
    padding: isDown ? '0px 5px' : "5px 10px",
    marginTop: "2rem",
    marginBottom: "2rem",
    alignItems: "center" }}>
<Button onClick={toggleOrder} sx={{color: theme.palette.mode === 'light' ? '#BFBFD5' : '#57596C'}}>
  {order === 'asc' ? <CustomIcon icon='mdi:sort-ascending' /> : <CustomIcon icon='mdi:sort-descending' />}
</Button>

    <Button onClick={handleWebshopClick} sx={{ border: 'none !important', color: (theme) => (theme.palette.mode === 'light' ? '#BFBFD5' : '#57596C'), }}>
  <CustomIcon icon='mdi:filter-outline' /> {isDown ? '' : 'Filter Webshops'}
</Button>
{selectedWebshops.size < webshops.length && (
  <Chip
    label="Reset Filter"
    onDelete={resetFilter}
    sx={{ marginLeft: '1rem' }}
  />
)}
{minPrice !== maxPrice && (
        <CustomSlider
          value={sliderValue}
          valueLabelDisplay="auto"
          min={minPrice}
          max={maxPrice}
          onChange={handleSliderChange}
          aria-labelledby="range-slider"
          sx={{maxWidth: '10rem', marginLeft: '3.5%', height: '3px', scale: '.6', color: "transparent"}}
        />
      )}
<Menu
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={handleClose}
>

  {webshops.map((webshop) => (
    <MenuItem key={webshop.id}>
      <ListItemAvatar>
        <Avatar src={`/webshoplogos/${webshop.name.toLowerCase()}logo.webp`} alt={webshop.name} sx={{ width: 34, height: 34 }} />
      </ListItemAvatar>
      <ListItemText primary={webshop.name} />
      <Switch
        checked={selectedWebshops.has(webshop.id)}
        onChange={() => handleToggleWebshop(webshop.id)}
      />
    </MenuItem>
  ))}
</Menu>

        <Button onClick={toggleDisplayMode} sx={{ marginLeft: 'auto', border: 'none !important', color: (theme) => (theme.palette.mode === 'light' ? '#BFBFD5' : '#57596C'),}}>
          {displayMode === 'grid' ? <CustomIcon icon='mdi:format-list-bulleted'  /> : <CustomIcon icon='mdi:dots-grid' />}
        </Button>
      </div>
      
<Product 
  products={products
    .filter((product) => 
      product.latestPrice >= sliderValue[0] && 
      product.latestPrice <= sliderValue[1] &&
      selectedWebshops.has(product.webshopId)
    )
    .sort((a, b) => order === 'asc' ? a.latestPrice - b.latestPrice : b.latestPrice - a.latestPrice)
  }
  displayMode={displayMode} 
/>



  </Container>
  </>
  );
}


export default React.memo(SingleMetaProduct);

import React, { useCallback } from 'react';
import Button from '@mui/material/Button';
import ProductCard from './ProductCard';
import Box from '@mui/material/Box';

const IMG_SERVER = process.env.NEXT_PUBLIC_IMG_SERVER;

const Product = ({ products, displayMode }) => {
  const renderProduct = useCallback((product) => {
    console.log(product);
    const productDetails = (
      <>
        <img src={`${IMG_SERVER}${product.imageUrl}`} alt={product.name} width="50" height="50" />
        <div style={{ flexGrow: 1, paddingLeft: '10px' }}>
          <h4>{product.name}</h4>
          <p>Price: €{product.latestPrice}</p>
        </div>
        <Button variant="outlined">Visit Webshop</Button>
      </>
    );

    if (displayMode === 'grid') {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
      return (
        <ProductCard
          key={product.id}
          name={product.name}
          brand={product.brand}
          image={`${IMG_SERVER}${product.imageUrl}`}
          metadata={product.metadata}
          lastCheck={product.lastCheck}
          url={product.url}
          webshopId={product.webshopId}
          price={product.latestPrice}
          displayMode={displayMode}
          webshopNaam={product.webshop.name}
        />
      );
    } else {
      return (
        <div
          key={product.id}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: '10px',
            width: '100%',
          }}
        >
                  <ProductCard
          key={product.id}
          name={product.name}
          brand={product.brand}
          image={`${IMG_SERVER}${product.imageUrl}`}
          metadata={product.metadata}
          lastCheck={product.lastCheck}
          url={product.url}
          webshopId={product.webshopId}
          price={product.latestPrice}
          displayMode={displayMode}
          webshopNaam={product.webshop.name}
        />
        </div>
      );
    }
  }, [displayMode]);

  return (
<Box
  sx={{
    display: 'grid',
    '--auto-grid-min-size': '18rem',
    gridTemplateColumns:
      displayMode === 'grid'
        ? 'repeat(auto-fill, minmax(var(--auto-grid-min-size), 1fr));'
        : 'none',
    gap: displayMode === 'grid' ? '1.3rem' : '10px',
    maxWidth: '100%',
  }}

>
  {products.map(renderProduct)}
</Box>




  );
};

export default React.memo(Product);

// components/MetaProductsByBrand.js
import {
    useMemo,
    useState
} from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    CardMedia,
    Grid
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import BrandToggleButtons from './BrandToggleButtons'
import { Fade } from '@mui/material';
import { getProductUrl, getCategoryPath } from '@/core/utils/get-product-url';
import { usePathname } from 'next/navigation';




const MetaProductsByBrand = ({
    metaProducts,
    category,
    categoryStructure
}) => {
   
    console.log('metaProducts: ', metaProducts);
    const locatie = usePathname();
    const sortedMetaProducts = useMemo(() => {
        const sorted = {};
        metaProducts.forEach((metaProduct) => {
            const brand = metaProduct.brand;
            if (!sorted[brand]) {
                sorted[brand] = [];
            }
            metaProduct.metaProductIds.forEach((_, index) => {
                sorted[brand].push({
                    id: metaProduct.metaProductIds[index],
                    name: metaProduct.names[index],
                    imageUrl: metaProduct.imageUrls[index],
                    slug: metaProduct.slugs[index],
                });
            });
        });

        return sorted;
    }, [metaProducts]);

    const uniqueBrands = useMemo(() => {
        const brands = new Set(metaProducts.map((metaProduct) => metaProduct.brand));
        return Array.from(brands);
    }, [metaProducts]);

    const [selectedBrands, setSelectedBrands] = useState([]);
    const categoryPath = getCategoryPath(category.slug, categoryStructure);
    

    return ( <
        div > 
          <BrandToggleButtons
            brands={uniqueBrands}
            setSelectedBrands={setSelectedBrands}
            selectedBrands={selectedBrands}
          />
        {
            Object.entries(sortedMetaProducts)
            .filter(([brand]) => selectedBrands.length === 0 || selectedBrands.includes(brand))
            .map(([brand, products]) => ( 
              <Fade in={true} timeout={500} key={brand}>
              <Box key = {brand}
                sx = {
                    {
                        borderBottom: '1px solid red',
                        paddingBottom: '1rem',
                        marginBottom: '2rem',
                    }
                } >
                <
                Box sx = {
                    {
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'row',
                        marginBottom: '16px',
                    }
                } >
                <
                Image src = {
                    `/Logos/${brand}.webp`
                }
                width = {
                    100
                }
                height = {
                    100
                }
                style = {
                    {
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        objectFit: 'contain',
                        marginRight: '1rem',
                        padding: '10px'
                    }
                }
                alt = {
                    `${brand} logo`
                }
                /> <
                Box >
                <
                Typography variant = "h4" > {
                    brand
                } < /Typography> <
                Typography variant = "subtitle1"
                color = "text.secondary" > {
                    products.length
                }
                smartphones found
                for {
                    brand
                } <
                /Typography> <
                /Box> <
                /Box> <
                Box sx = {
                    {
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        gap: '10px',
                    }
                } >
                { 
                    products.map((product) => { 
                      const productUrl = `${locatie}/${product.slug}`;
                      return (
                      <Box key={product.id}
                           sx={
                            {
                                marginBottom: '16px',
                                width: '140px'
                            }} >
                        <Card 
                          sx={
                            {
                                borderRadius: '0.5rem',
                                boxShadow: 'none',
                                border: 'none',
                            }} >
                          <Box 
                            sx={
                              {
                                width: '140px',
                                height: '140px',
                                bgcolor: 'white',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: '0.5rem',
                                overflow: 'hidden',
                              }
                            }>
                            <Link href={productUrl}>
                            <CardMedia 
                              component="img"
                              image = {product.imageUrl || "https://via.placeholder.com/140x140"}
                              alt = {product.name}
                              sx = {
                                {
                                objectFit: 'contain',
                                maxWidth: '100%',
                                maxHeight: '100%',
                                padding: "10px",
                              }}/> 
                              </Link>
                          </Box> 
                            <CardContent 
                              sx={{
                                padding: '0.65rem 0.5rem 0.5rem 0rem',
                                border: 'transparent',
                              }} >
                            <Link href={productUrl}>
                              <Typography 
                                variant="subtitle1"
                                sx={{
                                fontSize: '0.875rem',
                                color: 'white',
                                display: 'inline',
                                wordBreak: 'break-word',
                                display: 'block',
                                lineHeight: '18px',
                              }} >
                                {product.name} 
                              </Typography> 
                            </Link>
                            <Typography variant = "body2"
                              color = "text.secondary"
                              sx = {{ display: 'none' }} >
                            < /Typography> 
                            </CardContent> 
                          </Card> 
                        </Box>
                    )})
                } </Box> 
                </Box>
                </Fade>
            ))
        }

        <
        /div>
    );
};

export default MetaProductsByBrand;
import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Fade from '@mui/material/Fade';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip'
import CustomIcon from '@/vercelFix/Icon'
import { categoryStructure } from '@/utils/categoryStructure';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

import Link from 'next/link'

import { getProductUrl, getCategoryPath, calculateCatPathForHome } from '@/core/utils/get-product-url';
const IMG_SERVER = process.env.NEXT_PUBLIC_IMG_SERVER;

const SearchResults = ({ searchResults, queryLength, isLoading }) => {


  const theme = useTheme();
  const mode = theme.palette.mode;

  return (
    <Box sx={{ flexGrow: 1, height: '100%', position: 'absolute', right: 0, left: 0 }}>
    <Grid container spacing={2} sx={{
    overflow: 'auto',
    alignItems: 'stretch', // Align grid items to the top
  }}>
    {isLoading ? (
      <Grid
      container
      alignItems="center"
      justifyContent="center"
      style={{ height: '100%' }}
      >
<CircularProgress />
</Grid>
) : searchResults.length > 0 ? (
  searchResults.map((result, index) => {
    const productUrl = getProductUrl(result, categoryStructure.tree);
    const categoryUrl = productUrl.split('/').slice(0, -1).join('/');

    return (
      <Grid item xs={12} sm={6} md={6} key={result.id}>
        <Fade in timeout={300 * (index + 1)}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              alignItems: 'flex-start',
              padding: '0',
              transition: 'all 1s ease-in-out',
    backdropFilter: "blur(3px)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "10px",
    boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.25)",
              '&:hover': {
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            <CardContent sx={{ width: '100%', padding: '1rem !important'}} >
              <Grid container alignItems="flex-start">
                <Grid item xs={4}>
                  {productUrl ? (
                    <Link href={productUrl}>
                      <img
                        src={`${IMG_SERVER}${result.imageUrl}`}
                        alt={result.name}
                        style={{
                          width: '5rem',
                          minWidth: '5rem',
                          height: '5rem',
                          borderRadius: '0.375rem',
                          objectFit: 'contain',
                          border: '1px solid',
                          backgroundColor: 'white',
                          borderColor: 'primary.main',
                          padding: '.1rem',
                        }}
                      />
                    </Link>
                  ) : (
                    <img
                      src={`${IMG_SERVER}/${result.imageUrl}`}
                      alt={result.name}
                      style={{
                        width: '5rem',
                        height: '5rem',
                        borderRadius: '0.375rem',
                        objectFit: 'contain',
                        border: '1px solid',
                        borderColor: 'primary.main',
                      }}
                    />
                  )}
                </Grid>
                <Grid item xs={8}>
                  {productUrl ? (
                    <Link href={productUrl} style={{ textDecoration: 'none' }}>
                      <Typography gutterBottom variant="subtitle2" component="div" color="textSecondary" sx={{mb:0}}>
                        {result.brand ? result.brand : 'No brand'}
                      </Typography>
                      <Typography gutterBottom variant="h7" component="div">
                        {result.name}
                      </Typography>
                    </Link>
                  ) : (
                    <>
                      <Typography gutterBottom variant="subtitle2" component="div" color="textSecondary" sx={{mb:0}}>
                        {result.brand ? result.brand : 'No brand'}
                      </Typography>
                      <Typography gutterBottom variant="h7" component="div">
                        {result.name}
                      </Typography>
                    </>
                  )}
                  {categoryUrl ? (
                    <Link href={categoryUrl} style={{ textDecoration: 'none', opacity: '.6' }}>
                      <Chip
                        label={result.category}
                        color="primary"
                        variant="outlined"
                        clickable
                        sx={{
                          backgroundColor: 'transparent',
                          opacity: 0.7,
                          color: 'white',
                          height: 'auto !important',
                          paddingLeft: '4px',
                          paddingRight: '4px',
                          borderColor: mode === 'light' ? 'white' : 'text.primary',
                          '&:hover': {
                            backgroundColor: 'primary.dark',
                            opacity: 1,
                          },
                          '& .MuiChip-label': {
                            textDecoration: 'none',
                            paddingLeft: '4px',
                            paddingRight: '4px',
                          },
                        }}
                      />
                    </Link>
                  ) : null}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Fade>
      </Grid>
    );
      
  })

) : searchResults.length === 0 && queryLength > 0 ? (
  <Grid item xs={12}>
    <Typography variant="subtitle1">Geen resultaten gevonden.</Typography>
  </Grid>
) : null}
</Grid>
</Box>
);

};

export default SearchResults;

import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Fade from '@mui/material/Fade';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip'
import Icon from '@/components/Icon'
import { categoryStructure } from '@/utils/categoryStructure';
import { useTheme } from '@mui/material/styles';

import Link from 'next/link'

import { getProductUrl, getCategoryPath } from '@/core/utils/get-product-url';

const SearchResults = ({ searchResults, queryLength, isLoading }) => {

  const theme = useTheme();
  const mode = theme.palette.mode;

  return (
    <Grid container spacing={2} sx={{
    position: 'absolute',
    overflow: 'auto',
    height: '100%',
    alignItems: 'flex-start', // Align grid items to the top
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
    const categoryUrl = getCategoryPath(result.category, categoryStructure.tree);

    return (
      <Grid item xs={12} sm={6} md={6} key={result.id}>
        <Fade in timeout={300 * (index + 1)}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              padding: '0',
              transition: 'all 1s ease-in-out',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            <CardContent>
              <Grid container alignItems="flex-start">
                <Grid item xs={4}>
                  {productUrl ? (
                    <Link href={productUrl}>
                      <img
                        src={result.imageUrl}
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
                    </Link>
                  ) : (
                    <img
                      src={result.imageUrl}
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
                    <Link href={categoryUrl} style={{ textDecoration: 'none' }}>
                      <Chip
                        label={result.category}
                        color="primary"
                        variant="outlined"
                        icon={
                          <Icon
                            icon="mdi:arrow-right-thin-circle-outline"
                            fontSize={20}
                          />
                        }
                        clickable
                        sx={{
                          backgroundColor: 'transparent',
                          opacity: 0.7,
                          color: 'white',
                          borderColor: mode === 'light' ? 'white' : 'text.primary',
                          '&:hover': {
                            backgroundColor: 'primary.dark',
                            opacity: 1,
                          },
                          '& .MuiChip-label': {
                            textDecoration: 'none',
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
);

};

export default SearchResults;

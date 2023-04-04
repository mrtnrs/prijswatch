// app/page.js
'use client'
import { fetchProducts } from '../lib/api';
import Link from 'next/link';

// MUI
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { styled } from '@mui/system';
// import { useSession, signIn, signOut } from "next-auth/react";

import SearchBar from '@/components/search/SearchBar'



// ** Spinner Import
import Spinner from '@/components/spinner'
import Icon from '@/components/Icon'


const StyledCard = styled(Card)`
  border-radius: 15px;
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.1);
`;

const CategoryCard = styled(Card)`
  border-radius: 15px;
  position: relative;
`;

const CategoryCardMedia = styled(CardMedia)`
  border-radius: 50%;
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 80px;
`;


export default function Home() {

 // const { data: session } = useSession();



  const session = false;

  return (
       <>
          <Container maxWidth="lg">
      {/* Hero Section */}
      <Grid container spacing={4} alignItems="center" justifyContent="center" style={{ marginTop: 50 }}>
        <Grid item xs={12} style={{ textAlign: 'center' }}>
          <Typography variant="h2">Welcome to the Store</Typography>
        </Grid>
        <Grid item xs={12}>
          <SearchBar />
        </Grid>
      </Grid>

      {/* Categories Section */}
      <Grid container spacing={4} style={{ marginTop: 50 }}>
        {/* Add more category cards as needed */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <CategoryCard>
            <CategoryCardMedia image="https://placehold.co/80x80.png" />
            <CardContent>
              <Typography variant="h6">Category</Typography>
              <Typography>Subcategory</Typography>
            </CardContent>
          </CategoryCard>
        </Grid>
      </Grid>

      {/* Glassmorphism Card and Graph */}
      <Grid container spacing={4} style={{ marginTop: 50 }}>
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h5">Glassmorphism Card</Typography>
              <Typography>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Typography>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} md={6}>
          {/* Add your graph component here */}
          <Typography>Graph component goes here</Typography>
        </Grid>
      </Grid>

      <Typography variant="h4" style={{ marginTop: 50 }}>Popular</Typography>
      <Grid container spacing={4} style={{ marginTop: 20 }}>
        {/* Add more product cards as needed */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StyledCard>
            <CardMedia image="https://placehold.co/600x400.png" title="Product" style={{ height: 200 }} />
            <CardContent>
              <Typography variant="h6">Product Title</Typography>
              <Typography>Product Description</Typography>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      {/* Dropped in price Section */}
      <Typography variant="h4" style={{ marginTop: 50 }}>Dropped in price</Typography>
      <Grid container spacing={4} style={{ marginTop: 20 }}>
        {/* Add more product cards as needed */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StyledCard>
            <CardMedia image="https://placehold.co/600x400.png" title="Product" style={{ height: 200 }} />
            <CardContent>
              <Typography variant="h6">Product Title</Typography>
              <Typography>Product Description</Typography>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Container>
    </>
  );
}

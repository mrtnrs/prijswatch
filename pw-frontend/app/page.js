// app/page.js
'use client'
import { fetchProducts } from '../lib/api';
import Link from 'next/link';

import { useState } from 'react'

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
import { useEffect } from 'react';
import { categoryStructure } from '@/utils/categoryStructure';

import { styled } from '@mui/system';
// import { useSession, signIn, signOut } from "next-auth/react";

import SearchBar from '@/components/search/SearchBar'
import SearchResults from '@/components/search/SearchResults';


const API_URL = 'http://localhost:3001/api/search';

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
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (query) => {
    console.log(query);
    try {
      fetch(`${API_URL}/?q=${query}`)
      .then((response) => {
        if (!response.ok) {
          console.log(response);
          throw new Error('Failed to fetch search results');
        }
        console.log(response);
        return response.json();
      })
      .then((data) => { 
        setSearchResults(data);
        setIsLoading(false);
      })
      .catch((error) => { 
        console.error(error);
        setIsLoading(false);
      });
    } catch (error) {
      console.error(`Error in fetch request for ${caller}: ${error.message}`);
      throw error;
    }
  };

  function debounce(func, wait) {
    let timeout;
    return (...args) => {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const debouncedHandleSearch = debounce((query) => {
    
    handleSearch(query);
}, 300); // 300ms delay

  const session = false;

  return (
   <>
   <Container maxWidth="nm">
      {/* Hero Section */}

   <Grid container spacing={4} alignItems="center" justifyContent="center" style={{ marginTop: 50 }} sx={{ minHeight: "30rem"}}>
    {/* Typography and SearchBar */}
   <Grid item xs={12} lg={6} style={{ textAlign: 'center' }}>
   <Typography variant="h1" sx={{ textAlign: { lg: 'left' }, maxWidth: '37rem' }}>Vind de beste producten aan de laagste prijzen</Typography>
   <Typography variant="subtitle1" sx={{ textAlign: { lg: 'left' }, mt:2, maxWidth: '28rem' }}>Vergelijk prijzen in een oogwenk, zie hoe de prijzen evolueren
   en krijg meldingen bij kortingen en prijsdalingen!</Typography>
   <Box sx={{ textAlign: { md: 'left' }, mt: 5 }}>
   <SearchBar 
   handleSearch={debouncedHandleSearch}
   setSearchResults={setSearchResults}
   searchQuery={searchQuery}
   setSearchQuery={setSearchQuery}
   setIsLoading={setIsLoading} />
   </Box>
   </Grid>



    {/* Search results */}
   <Grid item xs={12} lg={6} order={{ xs: 2, lg: 1 }} sx={{ position: 'relative' }}>
   <SearchResults 
   searchResults={searchResults}
   queryLength={searchQuery.length}
   isLoading={isLoading}
   />

   <img
   src="b.png"
   alt="Product 2"
   style={{
    zIndex: '-1',
  }}
  />
  </Grid>
  </Grid>



      {/* Glassmorphism Card and Graph */}
  <Grid container spacing={4} style={{ marginTop: 50 }}>
  <Grid item xs={12} md={6}>
  <StyledCard>
  <CardContent>
  <Typography variant="h5">prijs.watch</Typography>
  <Typography>We volgen de prijs van [xxxx] producten</Typography>
  <Typography>Op [xx] verschillende webshops</Typography>
  <Typography>Bekijk de prijsevolutie</Typography>
  <Typography>Krijg meldingen bij prijsdalingen of kortingen</Typography>
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

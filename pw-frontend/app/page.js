// app/page.js
'use client'
import { fetchProducts } from '../lib/api';
import Link from 'next/link';
import Image from 'next/image'

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
import { useEffect, useRef } from 'react';
import { categoryStructure } from '@/utils/categoryStructure';

import { styled } from '@mui/system';
// import { useSession, signIn, signOut } from "next-auth/react";

import SearchBar from '@/components/search/SearchBar'
import SearchResults from '@/components/search/SearchResults';
import SlidingImage from '@/components/imageslider/SlidingImage';
import Tabhome from '@/components/Tabhome/Tabhome';
import Trending from '@/components/trending/Trending';


const API_URL = '/api/search';
const SERVER_URL = process.env.NEXT_PUBLIC_API_SERVER_URL;

// ** Spinner Import
import Spinner from '@/components/spinner'
import CustomIcon from '@/vercelFix/Icon'


import Scanner from '@/components/scanner/Scanner';
import '@/styles/home.css';

// app/page.js
// ...

const CategoryCard = styled(Card)`
  border-radius: 15px;
  position: relative;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-10px);
  }
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

const StyledCard = styled(Card)`
  border-radius: 15px;
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-10px);
  }
`;



export default function Home() {

  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSlidingImage, setShowSlidingImage] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
  const timer = setTimeout(() => {
    setIsReady(true);
  }, 100); // 100ms delay

  return () => {
    clearTimeout(timer);
  };
}, []);


  const handleSearch = (query) => {
    console.log(query);
    try {
      fetch(`${SERVER_URL}${API_URL}/?q=${query}`)
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
    setShowSlidingImage(false);
    handleSearch(query);
}, 300); // 300ms delay

  const session = false;



  return (

   <>

   <Container maxWidth="nm">
      {/* Hero Section */}

   <Grid container spacing={12} alignItems="center" justifyContent="center" style={{ marginTop: 50 }} sx={{ minHeight: "40rem"}}>
    {/* Typography and SearchBar */}
   <Grid item xs={12} lg={6} style={{ textAlign: 'center' }}>
   <Typography className="text-gradient" variant="h1" sx={{ textAlign: { lg: 'left' }, maxWidth: '37rem'}}>Vind de beste producten</Typography>
   <Typography className="text-gradient" variant="h1" sx={{ textAlign: { lg: 'left' }, maxWidth: '37rem', mb: 5 }}>aan de laagste prijzen</Typography>
   <Typography variant="subtitle1" sx={{ textAlign: { lg: 'left' }, mt:2, maxWidth: '28rem', mb: 10  }}>Vergelijk prijzen in een oogwenk, zie hoe de prijzen evolueren
   en krijg meldingen bij kortingen en prijsdalingen!</Typography>
   <Box sx={{ textAlign: { md: 'left' }, mt: 5 }}>
   <SearchBar 
   handleSearch={debouncedHandleSearch}
   setSearchResults={setSearchResults}
   searchQuery={searchQuery}
   setSearchQuery={setSearchQuery}
   setIsLoading={setIsLoading} />
   </Box>
   <Box sx={{mt: 5, ml: 0}}   className={`flex mt-12 items-center space-x-4 md:space-x-6 ${
    isReady ? 'fade-in' : 'hidden'
  }`} data-aos="fade-right" data-aos-delay="400">
                <div>
                  <div className="font-cabinet-grotesk text-2xl font-extrabold text-left">1700</div>
                  <div className="text-gray-500">Producten</div>
                </div>
                <div>
                  🔘
                  </div>
                <div>
                  <div className="font-cabinet-grotesk text-2xl font-extrabold text-left">12</div>
                  <div className="text-gray-500">Webshops</div>
                </div>
                   <div>
                  🔘
                  </div>
                <div>
                  <div className="font-cabinet-grotesk text-2xl font-extrabold text-left">+12k</div>
                  <div className="text-gray-500">Prijsdalingen</div>
                </div>
              </Box>


   </Grid>



    {/* Search results */}
   <Grid item xs={12} lg={6} order={{ xs: 2, lg: 1 }} sx={{ position: 'relative', pt: 0, alignSelf: "flex-start" }}>

   <div className="container" style={{marginTop: "8%"}}>
   {showSlidingImage && <SlidingImage />}
    <Scanner />
    </div>
   <SearchResults 
   searchResults={searchResults}
   queryLength={searchQuery.length}
   isLoading={isLoading}
   />



  </Grid>

  </Grid>


  <Grid container spacing={4} style={{marginTop: 50}}>
  
  <Tabhome />

  </Grid>

      <>



      <Grid container spacing={4} style={{ marginTop: 20 }}>
            {/* Recently Dropped in Price Section */}
      <Trending />
      </Grid>


    </>
  </Container>
  </>
  );
}

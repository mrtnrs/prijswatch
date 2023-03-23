'use client'
import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import ScraperCard from './ScraperCard';

const fetchScrapers = async () => {
  // Replace this with an actual API call to fetch scraper data
  return [
    {
      id: 1,
      name: 'Scraper 1',
      lastRan: '2023-03-22 10:30',
      productsFetched: 100,
      errors: 0,
    },
    {
      id: 2,
      name: 'Scraper 2',
      lastRan: '2023-03-22 12:00',
      productsFetched: 150,
      errors: 1,
    },
  ];
};

const ScraperList = () => {
  const [scrapers, setScrapers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedScrapers = await fetchScrapers();
      setScrapers(fetchedScrapers);
    };
    fetchData();
  }, []);

  return (
    <Grid container spacing={3}>
      {scrapers.map((scraper) => (
        <Grid item key={scraper.id} xs={12}>
          <ScraperCard scraper={scraper} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ScraperList;

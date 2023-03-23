import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const ScraperCard = ({ scraper }) => {
  const handleStop = () => {
    console.log('Stopping scraper:', scraper.id);
    // Call the API to stop the scraper
  };

  const handleStart = () => {
    console.log('Starting scraper:', scraper.id);
    // Call the API to start the scraper
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{scraper.name}</Typography>
        <Typography>Last ran: {scraper.lastRan}</Typography>
        <Typography>Number of products fetched: {scraper.productsFetched}</Typography>
        <Typography>Errors: {scraper.errors}</Typography>
        <Button onClick={handleStop}>Stop</Button>
        <Button onClick={handleStart}>Start</Button>
      </CardContent>
    </Card>
  );
};

export default ScraperCard;

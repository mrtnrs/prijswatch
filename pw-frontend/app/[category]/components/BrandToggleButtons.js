import React, { MouseEvent, useState } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Box, Typography } from '@mui/material';

const BrandToggleButtons = ({ brands, setSelectedBrands, selectedBrands }) => {
  const handleBrandSelection = (event, newSelectedBrands) => {
    setSelectedBrands(newSelectedBrands);
  };

  return (
    <Box sx={{ margin: '50px 0' }}>
      <ToggleButtonGroup
        value={selectedBrands}
        onChange={handleBrandSelection}
        aria-label='brands'
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        {brands.map((brand) => (
          <ToggleButton key={brand} value={brand} aria-label={brand}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <img
                src={`/Logos/${brand}.webp`}
                alt={`${brand} logo`}
                width='30'
                height='30'
              />
              <Typography>{brand}</Typography>
            </Box>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};

export default BrandToggleButtons;

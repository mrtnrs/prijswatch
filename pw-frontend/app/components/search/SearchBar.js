'use client'
import { useState } from 'react';


import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Icon from '@/components/Icon'
import IconButton from '@mui/material/IconButton';


function SearchBar({ handleSearch, setSearchResults, searchQuery, setSearchQuery, setIsLoading, ...props}) {


  return (
       <div>
      <TextField
        value={searchQuery}
        onChange={(e) => {
        setSearchQuery(e.target.value);
        handleSearch(e.target.value);
        setIsLoading(true);
        }}
        placeholder="Zoek een product..."
        sx={{
          borderRadius: '10px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          padding: '0 10px',
          '& .MuiInputBase-input': {
            color: 'white',
          },
          padding: 0,
          outline: '1px solid #ffffff1f',
          border: '1px solid black',
          minWidth: { md: '20rem' },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Icon icon='mdi:magnify' fontSize={24} />
            </InputAdornment>
          ),
          endAdornment: searchQuery ? (
            <InputAdornment position="end">
              <IconButton
                edge="end"
                color="inherit"
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                }}
              >
                <Icon icon='mdi:close' fontSize={24} />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
        {...props}
      />
    </div>
  );
}

export default SearchBar
'use client'
import { useState } from 'react';
import '@/styles/searchBar.css'

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CustomIcon from '@/vercelFix/Icon'
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles'


function SearchBar({ handleSearch, setSearchResults, searchQuery, setSearchQuery, setIsLoading, ...props}) {

  const theme = useTheme();

  return (
       <div>
      <TextField
        className="searchField"
        value={searchQuery}
        onChange={(e) => {
        setSearchQuery(e.target.value);
        handleSearch(e.target.value);
        setIsLoading(true);
        }}
        placeholder="Zoek een product..."
        sx={{
          borderRadius: '99999px',
          padding: '0 10px',
          '& .MuiInputBase-input': {
             color: theme.palette.customColors.main,
          },
          padding: 0,
          outline: '1px solid #ffffff1f',
          border: '1px solid black',
          boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.25)',
           border: '1px solid rgba(255, 255, 255, 0.2)',
          position: 'relative',
          transition: 'transform 250ms',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(3px)',
          minWidth: { md: '20rem' },

        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <CustomIcon icon='mdi:magnify' fontSize={24} />
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
                <CustomIcon icon='mdi:close' fontSize={24} />
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
'use client'
// ** React Imports
import { useEffect, useCallback, useRef, useState } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import MuiDialog from '@mui/material/Dialog'
import ListItem from '@mui/material/ListItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import ListItemButton from '@mui/material/ListItemButton'
import InputAdornment from '@mui/material/InputAdornment'
import MuiAutocomplete from '@mui/material/Autocomplete'
import { getCategoryPath, getProductUrl } from '@/core/utils/get-product-url';
import { categoryStructure } from '@/utils/categoryStructure';

const API_URL = '/api/search';
const SERVER_URL = process.env.NEXT_PUBLIC_API_SERVER_URL;


// ** Third Party Imports
// import axios from 'axios'

// ** Icon Imports
import CustomIcon from '@/vercelFix/Icon'

// ** Configs Imports
import themeConfig from '@/core/configs/themeConfig'

const defaultSuggestionsData = [
  {
    category: 'Populaire producten',
    suggestions: [
      {
        icon: 'mdi:chart-donut',
        suggestion: 'CRM',
        link: '/dashboards/crm'
      },
      {
        icon: 'mdi:poll',
        suggestion: 'Analytics',
        link: '/dashboards/analytics'
      },
      {
        icon: 'mdi:chart-bubble',
        suggestion: 'eCommerce',
        link: '/dashboards/ecommerce'
      },
      {
        icon: 'mdi:account-group',
        suggestion: 'User List',
        link: '/apps/user/list'
      }
    ]
  },
  {
    category: 'Populaire categorieën',
    suggestions: [
      {
        icon: 'mdi:calendar-blank',
        suggestion: 'Calendar',
        link: '/apps/calendar'
      },
      {
        icon: 'mdi:format-list-numbered',
        suggestion: 'Invoice List',
        link: '/apps/invoice/list'
      },
      {
        icon: 'mdi:currency-usd',
        suggestion: 'Pricing',
        link: '/pages/pricing'
      },
      {
        icon: 'mdi:account-cog-outline',
        suggestion: 'Account Settings',
        link: '/pages/account-settings/account'
      }
    ]
  },
]

const categoryTitle = {
  dashboards: 'Dashboards',
  appsPages: 'Apps & Pages',
  userInterface: 'User Interface',
  formsTables: 'Forms & Tables',
  chartsMisc: 'Charts & Misc'
}

// ** Styled Autocomplete component
const Autocomplete = styled(MuiAutocomplete)(({ theme }) => ({
  '& fieldset': {
    border: 0
  },
  '& + .MuiAutocomplete-popper': {
    '& .MuiAutocomplete-listbox': {
      paddingTop: 0,
      height: '100%',
      maxHeight: 'inherit',
      '& .MuiListSubheader-root': {
        top: 0,
        fontWeight: 400,
        lineHeight: '15px',
        fontSize: '0.75rem',
        letterSpacing: '1px',
        color: theme.palette.text.disabled
      }
    },
    '& .MuiAutocomplete-paper': {
      border: 0,
      height: '100%',
      borderRadius: 0,
      boxShadow: 'none'
    },
    '& .MuiListItem-root.suggestion': {
      padding: 0,
      '& .MuiListItemSecondaryAction-root': {
        display: 'flex'
      },
      '&.Mui-focused.Mui-focusVisible, &:hover': {
        backgroundColor: theme.palette.action.hover
      },
      '& .MuiListItemButton-root: hover': {
        backgroundColor: 'transparent'
      },
      '&:not(:hover)': {
        '& .MuiListItemSecondaryAction-root': {
          display: 'none'
        },
        '&.Mui-focused, &.Mui-focused.Mui-focusVisible:not(:hover)': {
          '& .MuiListItemSecondaryAction-root': {
            display: 'flex'
          }
        },
        [theme.breakpoints.down('sm')]: {
          '&.Mui-focused:not(.Mui-focusVisible) .MuiListItemSecondaryAction-root': {
            display: 'none'
          }
        }
      }
    },
    '& .MuiAutocomplete-noOptions': {
      display: 'grid',
      minHeight: '100%',
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: theme.spacing(10)
    }
  }
}))

// ** Styled Dialog component
const Dialog = styled(MuiDialog)({
  '& .MuiBackdrop-root': {
    backdropFilter: 'blur(4px)'
  },
  '& .MuiDialog-paper': {
    overflow: 'hidden',
    '&:not(.MuiDialog-paperFullScreen)': {
      height: '100%',
      maxHeight: 550
    }
  }
})

const NoResult = ({ value, setOpenDialog }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
      <Box sx={{ mb: 2.5, color: 'text.primary' }}>
        <CustomIcon icon='mdi:file-remove-outline' fontSize='5rem' />
      </Box>
      <Typography variant='h6' sx={{ mb: 11.5, wordWrap: 'break-word' }}>
        No results for{' '}
        <Typography variant='h6' component='span' sx={{ wordWrap: 'break-word' }}>
          {`"${value}"`}
        </Typography>
      </Typography>

      <Typography variant='body2' sx={{ mb: 2.5, color: 'text.disabled' }}>
        Try searching for
      </Typography>
      <List sx={{ py: 0 }}>
        <ListItem sx={{ py: 2 }} disablePadding onClick={() => setOpenDialog(false)}>
          <Box
            component={Link}
            href='/dashboards/crm'
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              '&:hover > *': { color: 'primary.main' }
            }}
          >
            <Box sx={{ mr: 2.5, display: 'flex', color: 'text.primary' }}>
              <CustomIcon icon='mdi:cart-outline' fontSize={20} />
            </Box>
            <Typography variant='body2' sx={{ color: 'text.primary' }}>
              CRM Dashboard
            </Typography>
          </Box>
        </ListItem>
        <ListItem sx={{ py: 2 }} disablePadding onClick={() => setOpenDialog(false)}>
          <Box
            component={Link}
            href='/pages/user-profile/profile'
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              '&:hover > *': { color: 'primary.main' }
            }}
          >
            <Box sx={{ mr: 2.5, display: 'flex', color: 'text.primary' }}>
              <CustomIcon icon='mdi:account-outline' fontSize={20} />
            </Box>
            <Typography variant='body2' sx={{ color: 'text.primary' }}>
              User Profile
            </Typography>
          </Box>
        </ListItem>
        <ListItem sx={{ py: 2 }} disablePadding onClick={() => setOpenDialog(false)}>
          <Box
            component={Link}
            href='/pages/account-settings/account'
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              '&:hover > *': { color: 'primary.main' }
            }}
          >
            <Box sx={{ mr: 2.5, display: 'flex', color: 'text.primary' }}>
              <CustomIcon icon='mdi:account-cog-outline' fontSize={20} />
            </Box>
            <Typography variant='body2' sx={{ color: 'text.primary' }}>
              Account Settings
            </Typography>
          </Box>
        </ListItem>
      </List>
    </Box>
  )
}

const DefaultSuggestions = ({ setOpenDialog }) => {
  return (
    <Grid container spacing={6} sx={{ ml: 0, display: 'none' }}>
      {defaultSuggestionsData.map((item, index) => (
        <Grid item xs={12} sm={6} key={index}>
          <Typography component='p' variant='overline' sx={{ lineHeight: 1.25, color: 'text.disabled' }}>
            {item.category}
          </Typography>
          <List sx={{ py: 2.5 }}>
            {item.suggestions.map((suggestionItem, index2) => (
              <ListItem key={index2} sx={{ py: 2 }} disablePadding>
                <Box
                  component={Link}
                  href={suggestionItem.link}
                  onClick={() => setOpenDialog(false)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    '& svg': { mr: 2.5 },
                    color: 'text.primary',
                    textDecoration: 'none',
                    '&:hover > *': { color: 'primary.main' }
                  }}
                >
                  <CustomIcon icon={suggestionItem.icon} fontSize={20} />
                  <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {suggestionItem.suggestion}
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        </Grid>
      ))}
    </Grid>
  )
}


const AutocompleteComponent = ({ hidden, settings }) => {
  // ** States
  const [isMounted, setIsMounted] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [options, setOptions] = useState([])
  const [searchInProgress, setSearchInProgress] = useState(false);
  const [hasSearchBeenCalled, setHasSearchBeenCalled] = useState(false);



  // ** Hooks & Vars
  const theme = useTheme()
  const router = useRouter()
  const { layout } = settings
  const wrapper = useRef(null)
  const fullScreenDialog = useMediaQuery(theme.breakpoints.down('sm'));

const getProductURLFromData = (data) => {
  const categoryPath = getCategoryPath(data.category, categoryStructure.tree);
  const productSlug = data.slug;
  return categoryPath ? `/${categoryPath.join('/')}/${productSlug}` : `/${productSlug}`;
};


    useEffect(() => {
    if (searchValue) {
      const handleSearch = (query) => {
        setSearchInProgress(true);
        // ... your existing handleSearch logic ...
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
        setOptions(data);
        setHasSearchBeenCalled(true);
        console.log(data);
      })
      .catch((error) => { 
        console.error(error);
      })
      .finally(() => {
        setSearchInProgress(false);
      });
    } catch (error) {
      console.error(`Error in fetch request for ${error.message}`);
      throw error;
    }
      };

      const debounce = (func, wait) => {
            let timeout;
    return (...args) => {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
      };

      const debouncedHandleSearch = debounce((query) => {
        handleSearch(query);
      }, 300);

      debouncedHandleSearch(searchValue);
    }
  }, [searchValue]);

/*
  // Get all data using API
  useEffect(() => {
    axios
      .get('/app-bar/search', {
        params: { q: searchValue }
      })
      .then(response => {
        if (response.data && response.data.length) {
          setOptions(response.data)
        } else {
          setOptions([])
        }
      })
  }, [searchValue])
*/



// NEED TO IMPLEMENT GOOGLE ANALYTICS BASED POPULAR SEARCHES/CATEGORIES
// useEffect(() => {
//   const { protocol, host } = window.location;
//   const testApiUrl = 'http://127.0.0.1:3000/api/toppages/test';

//   fetch(testApiUrl)
//     .then((response) => response.json())
//     .then((data) => {
//       console.log("Test route data:", data);
//     })
//     .catch((error) => {
//       console.error("Error fetching test route:", error);
//     });
// }, []);


  useEffect(() => {

    if (!openDialog) {
      setSearchValue('')
    }
  }, [openDialog]);

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  // Handle click event on a list item in search result
const handleOptionClick = obj => {
  setSearchValue('');
  setOpenDialog(false);
  const productUrl = getProductURLFromData(obj);
  if (productUrl) {
    router.push(productUrl);
  }
};


  // Handle ESC & shortcut keys keydown events
  const handleKeydown = useCallback(
    event => {
      // ** Shortcut keys to open searchbox (Ctrl + /)
      if (!openDialog && event.ctrlKey && event.which === 191) {
        setOpenDialog(true)
      }
    },
    [openDialog]
  )

  // Handle shortcut keys keyup events
  const handleKeyUp = useCallback(
    event => {
      // ** ESC key to close searchbox
      if (openDialog && event.keyCode === 27) {
        setOpenDialog(false)
      }
    },
    [openDialog]
  )
  useEffect(() => {
    document.addEventListener('keydown', handleKeydown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeydown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyUp, handleKeydown])


  if (!isMounted) {
    return null
  } else {
    return (
      <Box
        ref={wrapper}
        onClick={() => !openDialog && setOpenDialog(true)}
        sx={{ display: 'flex', cursor: 'pointer', alignItems: 'center' }}
      >
        <IconButton color='inherit' sx={!hidden && layout === 'vertical' ? { mr: 1, ml: -2.75 } : {}}>
          <CustomIcon icon='mdi:magnify' />
        </IconButton>
        {!hidden && layout === 'vertical' ? (
          <Typography sx={{ userSelect: 'none', color: 'text.disabled' }}>Search (Ctrl+/)</Typography>
        ) : null}
        {openDialog && (
          <Dialog fullWidth open={openDialog} fullScreen={fullScreenDialog} onClose={() => setOpenDialog(false)}>
            <Box sx={{ top: 0, width: '100%', position: 'sticky' }}>
              <Autocomplete
              filterOptions={(options) => options}
                autoHighlight
                disablePortal
                options={options}
                id='appBar-search'
                isOptionEqualToValue={() => true}
                onInputChange={(event, value) => setSearchValue(value)}
                onChange={(event, obj) => handleOptionClick(obj)}
                noOptionsText={
            
  options.length === 0 && hasSearchBeenCalled ? (
    searchInProgress ? (
      "Searching..."
    ) : (
      "No results found"
    )
  ) : null
}

                getOptionLabel={option => option.name}
                groupBy={option => (searchValue.length ? categoryTitle[option.category] : '')}
                sx={{
                  '& + .MuiAutocomplete-popper': {
                    ...(searchValue.length
                      ? {
                          overflow: 'auto',
                          maxHeight: 'calc(100vh - 69px)',
                          borderTop: `1px solid ${theme.palette.divider}`,
                          height: fullScreenDialog ? 'calc(100vh - 69px)' : 481,
                          '& .MuiListSubheader-root': { p: theme.spacing(3.75, 6, 0.75) }
                        }
                      : {
                          '& .MuiAutocomplete-listbox': { pb: 0 }
                        })
                  }
                }}
                renderInput={params => {
                  return (
                    <TextField
                      {...params}
                      value={searchValue}
                      onChange={event => setSearchValue(event.target.value)}
                      inputRef={input => {
                        if (input) {
                          if (openDialog) {
                            input.focus()
                          } else {
                            input.blur()
                          }
                        }
                      }}
                      InputProps={{
                        ...params.InputProps,
                        sx: { p: `${theme.spacing(3.75, 6)} !important` },
                        startAdornment: (
                          <InputAdornment position='start' sx={{ color: 'text.primary' }}>
                            <CustomIcon icon='mdi:magnify' />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment
                            position='end'
                            onClick={() => setOpenDialog(false)}
                            sx={{ display: 'flex', cursor: 'pointer', alignItems: 'center' }}
                          >
                            {!hidden ? <Typography sx={{ mr: 2.5, color: 'text.disabled' }}>[esc]</Typography> : null}
                            <IconButton size='small' sx={{ p: 1 }}>
                              <CustomIcon icon='mdi:close' fontSize={20} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )
                }}
                renderOption={(props, option) => {
                  return searchValue.length ? (
                    <ListItem
                      {...props}
                      key={option.id}
                      className={`suggestion ${props.className}`}
                      onClick={() => handleOptionClick(option)}
                      secondaryAction={<CustomIcon icon='mdi:subdirectory-arrow-left' fontSize={20} />}
                      sx={{
                        '& .MuiListItemSecondaryAction-root': {
                          '& svg': {
                            cursor: 'pointer',
                            color: 'text.disabled'
                          }
                        }
                      }}
                    >
                      <ListItemButton
                        sx={{
                          py: 2.5,
                          px: `${theme.spacing(6)} !important`,
                          '& svg': { mr: 2.5, color: 'text.primary' }
                        }}
                      >
                        <CustomIcon fontSize={20} icon='mdi:chevron-double-right' />
                        <Typography variant='body2' sx={{ color: 'text.primary' }}>
                          {option.name} <span style={{opacity: .6}}>{`- ${option.category}`}</span>
                        </Typography>
                      </ListItemButton>
                    </ListItem>
                  ) : null
                }}
              />
            </Box>
            {searchValue.length === 0 ? (
              <Box
                sx={{
                  p: 10,
                  display: 'grid',
                  overflow: 'auto',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderTop: `1px solid ${theme.palette.divider}`,
                  height: fullScreenDialog ? 'calc(100vh - 69px)' : '100%'
                }}
              >
                <DefaultSuggestions setOpenDialog={setOpenDialog} />
              </Box>
            ) : null}
          </Dialog>
        )}
      </Box>
    )
  }
}

export default AutocompleteComponent

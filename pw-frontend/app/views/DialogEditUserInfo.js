// ** React Imports
import { useState, forwardRef, useEffect, useMemo } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Switch from '@mui/material/Switch'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormControlLabel from '@mui/material/FormControlLabel'
import Select from '@mui/material/Select'

// ** Icon Imports
import Icon from '@/components/Icon'
import CategoryTree from '@/dashboard/components/CategoryTree'

import {fetchCategories, createCategory} from '@/api/categoryService'
import ReactSelect from 'react-select';


const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const DialogEditUserInfo = ({ 
  displayAddScraperDialog, 
  setDisplayAddScraperDialog, 
  webshops, 
  handleTest, 
  handleSave, 
  selectedScraper,
  handleUpdate,
  onDelete,
  apiKey,
  apiEndpoint, 
  apiPagination  } ) => {

  // ** States
  const [show, setShow] = useState(false)
  const [languages, setLanguages] = useState([]);

  const [selectedWebshopId, setSelectedWebshopId] = useState('');
  const [url, setUrl] = useState('');
  const [scrapeInterval, setScrapeInterval] = useState('');
  const [category, setCategory] = useState(null);
  const [scraperType, setScraperType] = useState('API');
  const [saveStatus, setSaveStatus] = useState('');
  const [hasPagination, setHasPagination] = useState(false);
  const [paginationParameter, setPaginationParameter] = useState('');
  const [pageSize, setPageSize] = useState('');

  // Puppeteer-specific states
const [puppeteerUrlSelector, setPuppeteerUrlSelector] = useState('');
const [puppeteerProductNameSelector, setPuppeteerProductNameSelector] = useState('');
const [puppeteerProductPriceSelector, setPuppeteerProductPriceSelector] = useState('');
const [puppeteerPagination, setPuppeteerPagination] = useState(false);
const [puppeteerPaginationSelector, setPuppeteerPaginationSelector] = useState('');
const [puppeteerProductImageSelector, setPuppeteerProductImageSelector] = useState('');
const [puppeteerContainerSelector, setPuppeteerContainerSelector] = useState('');

const [apiKeyValue, setApiKeyValue] = useState(''); 
const [apiEndpointValue, setApiEndpointValue] = useState('');
const [apiPaginationValue, setApiPaginationValue] = useState('');
const [pageParameterName, setPageParameterName] = useState('');
const [pageSizeParameterName, setPageSizeParameterName] = useState('');
const [pageSizeValue, setPageSizeValue] = useState('');
const [dataPath, setDataPath] = useState('');
const [productMappingFunction, setProductMappingFunction] = useState('');



// categories
const [categoryOptions, setCategoryOptions] = useState([]);



  // SET IF EDIT

useEffect(() => {
  const fetchedCategories = async () => {
    const categories = await fetchCategories();
    console.log('caties', categories);
    setCategoryOptions(categories);
  }
  fetchedCategories();
}, []);

useEffect(() => {
  if (selectedScraper) {
    const {
      webshopId,
      interval,
      type,
      settings: {
        url,
        category,
        pagination,
        paginationParameter,
        pageSize,
        urlSelector,
        productNameSelector,
        productPriceSelector,
        productImageSelector,
        containerSelector,
        nextPageSelector,
      },
    } = selectedScraper;
    console.log('AAA', category);
    setUrl(url);
    setCategory(category);
    setSelectedWebshopId(webshopId); // Set the selectedWebshopId
    setScrapeInterval(interval);
    setScraperType(formatScraperType(type));
    setHasPagination(!!nextPageSelector);
    setPaginationParameter(paginationParameter);
    setPageSize(pageSize);
    setPuppeteerUrlSelector(urlSelector);
    setPuppeteerProductNameSelector(productNameSelector);
    setPuppeteerProductImageSelector(productImageSelector);
    setPuppeteerProductPriceSelector(productPriceSelector);
    setPuppeteerPagination(!!nextPageSelector);
    setPuppeteerContainerSelector(containerSelector);
    setPuppeteerPaginationSelector(nextPageSelector || '');
  }
}, [selectedScraper]);

useEffect(() => {
  if (selectedScraper && categoryOptions.length > 0) {
    const foundCategory = categoryOptions.find(c => c.name === selectedScraper.settings.category);
    if (foundCategory) {
      setCategory(foundCategory.id);
    } else {
      console.error(`No matching category found for ${selectedScraper.settings.category}`);
    }
  }
}, [selectedScraper, categoryOptions]);



const formatCategoryOptions = (categories) => {
  console.log("Input categories:", categories);
  return categories.map((category) => {
    return {
      value: category.id,
      label: category.name,
      children: category.subcategories?.length > 0 ? formatCategoryOptions(category.subcategories) : [],
    };
  });

  console.log("Formatted categories:", formattedCategories);
  return formattedCategories;
};



  const formatScraperType = (type) => {
    return type === "api" ? "API" : "Puppeteer";
  };

  // EVENT HANDLERS

  const handleScraperTypeChange = (event) => {
    setScraperType(event.target.value);
  };

  const handlePaginationChange = () => {
    const newPag = 
    setHasPagination(!hasPagination);
  }

  

  const handleTestClick = (action) => {

const scraperSettings = {
  url,
  scrapeInterval,
  category,
  type: scraperType,
  saveStatus,
  pagination: hasPagination,
  paginationParameter,
  pageSize,
  ...(scraperType === 'Puppeteer' && {
    urlSelector: puppeteerUrlSelector,
    productNameSelector: puppeteerProductNameSelector,
    productImageSelector: puppeteerProductImageSelector,
    containerSelector: puppeteerContainerSelector,
    productPriceSelector: puppeteerProductPriceSelector,
    nextPageSelector: puppeteerPagination ? puppeteerPaginationSelector : '',
  }),
  ...(scraperType === 'API' && {
    apiKey: apiKeyValue,
    apiEndpoint: apiEndpointValue,
    apiPagination: apiPaginationValue,
  }),
};


const formData = {
  webshopId: selectedWebshopId,
  scraperSettings,
  ...(selectedScraper && { selectedScraper }), // Include selectedScraper in formData if it's available
};

    if(action === 'save') {
      handleSave(formData);
    } else if (action === 'update') {
      handleUpdate(formData);
    } else {
      handleTest(formData);
    }
  }

  useEffect(() => {
    if (displayAddScraperDialog) {
      setShow(true);
    }
  }, [displayAddScraperDialog]);

  useEffect(() => {
    if (selectedScraper && selectedScraper.type === 'API') {
      const { apiKey, apiEndpoint, apiPagination } = selectedScraper.settings;
      setApiKeyValue(apiKey);
      setApiEndpointValue(apiEndpoint);
      setApiPaginationValue(apiPagination);
    }
  }, [selectedScraper]);

  const handleChange = event => {
    const {
      target: { value }
    } = event
    setLanguages(typeof value === 'string' ? value.split(',') : value)
  }

  // Handle Delete

    const handleDelete = () => {
      if (selectedScraper) {
        onDelete(selectedScraper.id);
        setShow(false);
        setDisplayAddScraperDialog(false);
      }
    };

    const handlePuppeteerPaginationChange = () => {
  setPuppeteerPagination(!puppeteerPagination);
}
const handleImageSelectorChange = (e) => setPuppeteerProductImageSelector(e.target.value);
const handleTitleSelectorChange = (e) => setPuppeteerProductNameSelector(e.target.value);
const handlePriceSelectorChange = (e) => setPuppeteerProductPriceSelector(e.target.value);
const handleUrlSelectorChange = (e) => setPuppeteerUrlSelector(e.target.value);

const handleNewCategory = (newCategory) => {
  // Find the parent category in the categoryOptions, if there's one
  const parentCategory = newCategory.parentId
    ? categoryOptions.find((category) => category.value === newCategory.parentId)
    : null;

  const newCategoryOption = {
    value: newCategory.id,
    label: newCategory.name,
    children: [],
  };

  if (parentCategory) {
    // If there's a parent category, update its children array
    parentCategory.children = [...parentCategory.children, newCategoryOption];
  } else {
    // If there's no parent category, add the new category to the categoryOptions state
    setCategoryOptions([...categoryOptions, newCategoryOption]);
  }
};

const handleAddCategory = async (categoryData) => {
  try {
    const newCategory = await createCategory(categoryData);
    // Fetch categories again to update the list
    const updatedCategories = await fetchCategories();
    setCategoryOptions(formatCategoryOptions(updatedCategories));
  } catch (error) {
    console.error('Error adding category:', error);
  }
};

function findParentCategories(categoryOptions, level11CategoryId) {
  const level11Category = categoryOptions.find(
    (category) => category.value === level11CategoryId
  );

  if (!level11Category) {
    return { level1Category: null, mainCategory: null };
  }

  const level1Category = categoryOptions.find(
    (category) => category.value === level11Category.parentId
  );

  if (!level1Category) {
    return { level1Category: null, mainCategory: null };
  }

  const mainCategory = categoryOptions.find(
    (category) => category.value === level1Category.parentId
  );

  return { level1Category, mainCategory };
}

const { level1Category, mainCategory } = useMemo(
  () => findParentCategories(categoryOptions, selectedScraper?.settings.level11CategoryId),
  [categoryOptions, selectedScraper]
);

const handleCategoryChange = (selectedCategoryId) => {
  setCategory(selectedCategoryId);
};


  return (
    <Card>
    <Dialog
    fullWidth
    open={show}
    maxWidth='md'
    scroll='body'
    onClose={() => setShow(false)}
    TransitionComponent={Transition}
    onBackdropClick={() => {
      setShow(false);
      setDisplayAddScraperDialog(false);
    } }
    >
    <DialogContent sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
    <IconButton
    size='small'
    onClick={() => { setShow(false); setDisplayAddScraperDialog(false);}}
    sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
    >
    <Icon icon='mdi:close' />
    </IconButton>
    <Box sx={{ mb: 8, textAlign: 'center' }}>
    <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
    { selectedScraper ? "Edit scraper" : "Add Scraper" }
    </Typography>
    </Box>



    <Grid container spacing={6}>
    <Grid item xs={12}>
    <FormControl fullWidth>
    <InputLabel id="webshop-select">Webshop</InputLabel>
    <Select 
    defaultValue="" 
    fullWidth 
    value={selectedWebshopId}
    onChange={(event) => setSelectedWebshopId(event.target.value)}
    labelId="webshop-select" label="Webshop">
    {webshops.map((webshop, index) => (
      <MenuItem key={index} value={webshop.id}>
      {webshop.name}
      </MenuItem>
      ))}
    </Select>
    </FormControl>
    </Grid>
    <Grid item xs={12}>
    <TextField 
      value={url} 
      onChange={(e) => setUrl(e.target.value)}
      fullWidth label='URL' placeholder='https...' required />
    </Grid>

    <Grid item sm={6} xs={12}>
  <FormControl fullWidth>
    <InputLabel id="interval-select">Interval</InputLabel>
    <Select defaultValue="12h"
    value={scrapeInterval}
    onChange={(e) => setScrapeInterval(e.target.value)} fullWidth labelId="interval-select" label="Interval">
      <MenuItem value="12h">Every 12 hours</MenuItem>
      <MenuItem value="24h">Every Day</MenuItem>
      <MenuItem value="1w">Once a week</MenuItem>
    </Select>
  </FormControl>
</Grid>

    <Grid item sm={6} xs={12}>
    <FormControl fullWidth>
<CategoryTree
  categoryOptions={categoryOptions} 
  category={category}
  onCategoryChange={handleCategoryChange}
/>
    </FormControl>
    </Grid>
    
        <Grid item sm={12} xs={12}>
    <FormControl fullWidth>
    <InputLabel id="scraper-type-select">Scraper Type</InputLabel>
    <Select value={scraperType} onChange={handleScraperTypeChange} fullWidth labelId="scraper-type-select" label="Scraper Type">
    <MenuItem value="API">API</MenuItem>
    <MenuItem value="Puppeteer">Puppeteer</MenuItem>
    </Select>
    </FormControl>
    </Grid>

    { scraperType === 'API' && (

     <>
            {/* API-specific form fields */}
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch checked={hasPagination} onChange={handlePaginationChange} />}
                label="Api has pagination"
                sx={{
                  '& .MuiFormControlLabel-label': {
                    color: 'text.secondary',
                  },
                }}
              />
              </Grid>
    {scraperType === 'API' && hasPagination && (
 <>
                {/* API Pagination form fields */}
                <Grid item sm={6} xs={12}>
                  <TextField
                    value={pageParameterName}
                    onChange={(e) => setPageParameterName(e.target.value)}
                    fullWidth
                    label="Page Parameter Name"
                    placeholder="page"
                    required
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField
                    value={pageSizeParameterName}
                    onChange={(e) => setPageSizeParameterName(e.target.value)}
                    fullWidth
                    label="Page Size Parameter Name"
                    placeholder="pageSize"
                    required
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField
                    value={pageSizeValue}
                    onChange={(e) => setPageSizeValue(e.target.value)}
                    fullWidth
                    label="Page Size Value"
                    placeholder="96"
                    required
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <TextField
                value={dataPath}
                onChange={(e) => setDataPath(e.target.value)}
                fullWidth
                label="Data Path"
                placeholder="data.products"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                value={productMappingFunction}
                onChange={(e) => setProductMappingFunction(e.target.value)}
                fullWidth
                label="function(product) { return { productId: product.id, productName: product.title, productPrice: product.cost }; }"
                placeholder="function(product) { /* mapping code */ }"
                required
                multiline
                rows={4}
              />
            </Grid>
          </>
        )}
        {scraperType === 'Puppeteer' && (
  <>
    {/* Puppeteer-specific form fields */}

  <Grid item sm={6} xs={12}>
      <TextField
        value={puppeteerContainerSelector}
        onChange={(e) => setPuppeteerContainerSelector(e.target.value)}
        fullWidth
        label="Container CSS Selector"
        placeholder=".product-container"
        required
      />
    </Grid>
    <Grid item sm={6} xs={12}>
      <TextField
          value={puppeteerProductNameSelector}
        onChange={handleTitleSelectorChange}
        fullWidth
        label="Title CSS Selector"
        placeholder=".product-title"
        required
      />
    </Grid>
    <Grid item sm={6} xs={12}>
      <TextField
  value={puppeteerProductPriceSelector}
  onChange={handlePriceSelectorChange}
        fullWidth
        label="Price CSS Selector"
        placeholder=".product-price"
        required
      />
    </Grid>
    <Grid item sm={6} xs={12}>
      <TextField
  value={puppeteerUrlSelector}
  onChange={handleUrlSelectorChange}
        fullWidth
        label="URL CSS Selector"
        placeholder=".product-url"
        required
      />
    </Grid>
    <Grid item sm={6} xs={12}>
  <TextField
    value={puppeteerProductImageSelector}
    onChange={handleImageSelectorChange}
    fullWidth
    label="Image CSS Selector"
    placeholder=".product-image"
    required
  />
</Grid>
    <Grid item xs={12}>
      <FormControlLabel
        control={<Switch checked={puppeteerPagination} onChange={handlePuppeteerPaginationChange} />}
        label='Puppeteer uses Pagination'
        sx={{
          '& .MuiFormControlLabel-label': {
            color: 'text.secondary'
          }
        }}
      />
    </Grid>
    {puppeteerPagination && (
      <>
        {/* Puppeteer Pagination fields */}
        <Grid item sm={6} xs={12}>
          <TextField
            value={puppeteerPaginationSelector}
            onChange={(e) => setPuppeteerPaginationSelector(e.target.value)}
            fullWidth
            label="Pagination Selector"
            placeholder=".next-page"
            required
          />
        </Grid>
      </>
    )}
  </>
)}


    </Grid>
    </DialogContent>


<DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'left', ml: 3 }}>
  {/* ... other buttons ... */}

<Button
  variant="contained"
  color="secondary"
  sx={{ mr: 2 }}
  onClick={() => {
    setSaveStatus('save');
    // Handle form submission
    setShow(false);
    setDisplayAddScraperDialog(false);
    handleTestClick(selectedScraper ? 'update' : 'save');
  }}
>
  {selectedScraper ? 'Update' : 'Save'}
</Button>
  <Button
    variant="outlined"
    color="secondary"
    sx={{ mr: 2 }}
    onClick={() => {
      setSaveStatus('draft');
      setShow(false);
      setDisplayAddScraperDialog(false);
    }}
  >
    Draft
  </Button>
  <Button
    variant="outlined"
    color="error"
    sx={{ mr: 2 }}
    onClick={() => {
      if (window.confirm('Are you sure you want to delete this scraper?')) {
      handleDelete();
      }
    }}
  >
    Delete
  </Button>
  <Button
    variant="outlined"
    color="primary"
    sx={{ mr: 2 }}
    onClick={() => handleTestClick('test')}
  >
    Test
  </Button>
  {/* ... other buttons ... */}
</DialogActions>


    </Dialog>
    </Card>
    )
}

export default DialogEditUserInfo

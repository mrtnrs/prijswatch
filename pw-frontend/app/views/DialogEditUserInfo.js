// ** React Imports
import { useState, forwardRef, useEffect } from 'react'

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
import Icon from '@/components/icon'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const DialogEditUserInfo = ({ displayAddScraperDialog, setDisplayAddScraperDialog, webshops, handleTest, handleSave} ) => {

  // ** States
  const [show, setShow] = useState(false)
  const [languages, setLanguages] = useState([]);

  const [selectedWebshopId, setSelectedWebshopId] = useState('');
  const [url, setUrl] = useState('');
  const [scrapeInterval, setScrapeInterval] = useState('');
  const [category, setCategory] = useState('');
  const [scraperType, setScraperType] = useState('API');
  const [saveStatus, setSaveStatus] = useState('');
  const [hasPagination, setHasPagination] = useState(false);
  const [paginationParameter, setPaginationParameter] = useState('');
  const [pageSize, setPageSize] = useState('');


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
      pageSize
    };

    const formData = {
      webshopId: selectedWebshopId,
      scraperSettings,
    };

    if(action === 'save') {
      handleSave(formData);
    } else {
      handleTest(formData);
    }
  }

  useEffect(() => {
    if (displayAddScraperDialog) {
      setShow(true);
    }
  }, [displayAddScraperDialog]);

  const handleChange = event => {
    const {
      target: { value }
    } = event
    setLanguages(typeof value === 'string' ? value.split(',') : value)
  }

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
    Add Scraper
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
    <InputLabel id='status-select'>Category</InputLabel>
    <Select defaultValue='Smartphones' 
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    fullWidth labelId='status-select' label='Category'>
    <MenuItem value='Smartphones'>Smartphones</MenuItem>
    <MenuItem value='Active'>Active</MenuItem>
    <MenuItem value='Inactive'>Inactive</MenuItem>
    <MenuItem value='Suspended'>Suspended</MenuItem>
    </Select>
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

    <Grid item xs={12}>
    <FormControlLabel
    control={<Switch checked={hasPagination} onChange={handlePaginationChange} />}
    label='Api has pagination'
    sx={{
      '& .MuiFormControlLabel-label': {
        color: 'text.secondary'
      }
    }}
    />
    </Grid>

    {scraperType === 'API' && hasPagination && (
      <>
      <Grid item sm={6} xs={12}>
        <TextField
          value={paginationParameter}
          onChange={(e) => setPaginationParameter(e.target.value)}
          fullWidth
          label="Pagination Parameter"
          placeholder="page"
          required
        />
      </Grid>
      <Grid item sm={6} xs={12}>
        <TextField
          value={pageSize}
          onChange={(e) => setPageSize(e.target.value)}
          fullWidth
          label="Page Size Parameter"
          placeholder="&pageSize=96"
          required
        />
      </Grid>
      </>
      )}
    {scraperType === 'Puppeteer' && (
      <>
    {/* Puppeteer specific form fields */}
      </>
      )}


    
    <Grid item xs={12}>
    <FormControlLabel
    control={<Switch defaultChecked />}
    label='Make this default shipping address'
    sx={{
      '& .MuiFormControlLabel-label': {
        color: 'text.secondary'
      }
    }}
    />
    </Grid>
    </Grid>
    </DialogContent>


<DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'left', ml: 3 }}>
  {/* ... other buttons ... */}

<Button
    variant="contained"
    sx={{ mr: 2 }}
    onClick={() => {
      setSaveStatus('saveAndRun');
      // Handle form submission
      setShow(false);
      setDisplayAddScraperDialog(false);
    }}
  >
    Save & Run
  </Button>
  <Button
    variant="contained"
    color="secondary"
    sx={{ mr: 2 }}
    onClick={() => {
      setSaveStatus('save');
      // Handle form submission
      setShow(false);
      setDisplayAddScraperDialog(false);
      handleTestClick('save');
    }}
  >
    Save
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
      setShow(false);
      setDisplayAddScraperDialog(false);
    }}
  >
    Discard
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

// ** React Imports
import { forwardRef, useState, useEffect } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import Select from '@mui/material/Select'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Icon Imports
import CustomIcon from '@/vercelFix/Icon'


const CustomInput = forwardRef((props, ref) => {
  return <TextField fullWidth {...props} inputRef={ref} label='Birth Date' autoComplete='off' />
})

const FormLayoutsSeparator = ({handleSubmit, selectedWebshop}) => {
  // ** States
  const [webshop, setWebshop] = useState({
    name: "",
    url: "",
    country: "",
    logo: null,
    deliveryCost: "free",
    freeDeliveryThreshold: "",
    deliveryCostValue: "",
  });

  useEffect(() => {
    if (selectedWebshop) {
      // Populate the form fields with the selectedWebshop data
      console.log("selectedWebshop detected");
      console.log(selectedWebshop);
      setWebshop(selectedWebshop);
    }
  }, [selectedWebshop]);

  const handleDeliveryCostValueChange = (e) => {
    setWebshop({ ...webshop, deliveryCostValue: e.target.value });
  };

  const resetForm = () => {
    setWebshop({
      name: "",
      url: "",
      country: "",
      logo: null,
      deliveryCost: "free",
      freeDeliveryThreshold: "",
      deliveryCostValue: "",
    });
  };

  const countries = [
    { code: "Be", name: "🇧🇪 België" },
    { code: "De", name: "🇩🇪 Duitsland" },
    { code: "Fr", name: "🇫🇷 Frankrijk" },
    { code: "Nl", name: "🇳🇱 Nederland" },

  // Add more countries as needed
    ];


  const handleDeliveryCostChange = (e) => {
    setWebshop({ ...webshop, deliveryCost: e.target.value });
  };

  const handleThresholdChange = (e) => {
    setWebshop({ ...webshop, freeDeliveryThreshold: e.target.value });
  };

  const handleChange = (e) => {
    setWebshop({ ...webshop, [e.target.name]: e.target.value });
  };

  const handleLogoUpload = (e) => {
    setWebshop({ ...webshop, logo: e.target.files[0] });
  };

  return (
    <Card>
    <CardHeader title='Voeg een webshop toe' />
    <Divider sx={{ m: '0 !important' }} />
    <form onSubmit={(event) => handleSubmit(event, webshop)}>
    <CardContent>

    <Grid container spacing={5}>
          {/* ... */}
    <Grid item xs={12} sm={6}>
    <TextField
    label="Name"
    name="name"
    value={webshop.name}
    onChange={handleChange}
    fullWidth
    required
    />
    </Grid>

    <Grid item xs={12} sm={6}>
    <TextField
    label="URL"
    name="url"
    value={webshop.url}
    onChange={handleChange}
    fullWidth
    required
    />
    </Grid>

    <Grid item xs={12} sm={6}>
    <FormControl fullWidth>
    <InputLabel id="form-layouts-separator-country-label">Country</InputLabel>
    <Select
    label="Country"
    name="country"
    value={webshop.country}
    onChange={(e) => setWebshop({ ...webshop, country: e.target.value })}
    id="form-layouts-separator-country"
    labelId="form-layouts-separator-country-label"
    >
    {countries.map((country) => (
      <MenuItem key={country.code} value={country.code}>
      {country.name}
      </MenuItem>
      ))}
    </Select>
    </FormControl>
    </Grid>
    <Grid item xs={12} sm={6}>
    <FormControl fullWidth>
    <InputLabel htmlFor="logo-upload">Logo</InputLabel>
    <input
    type="file"
    id="logo-upload"
    name="logo"
    accept="image/*"
    onChange={handleLogoUpload}
    style={{ display: "none" }}
    />
    <label htmlFor="logo-upload">
    <Button variant="contained" color="primary" component="span">
    Upload
    </Button>
    </label>
    </FormControl>
    </Grid>

          {/* ... */}
    <Grid item xs={12} sm={6}>
    <FormControl fullWidth>
    <InputLabel id="form-layouts-separator-delivery-cost-label">
    Delivery Cost
    </InputLabel>
    <Select
    label="Delivery Cost"
    name="deliveryCost"
    value={webshop.deliveryCost}
    onChange={handleDeliveryCostChange}
    id="form-layouts-separator-delivery-cost"
    labelId="form-layouts-separator-delivery-cost-label"
    >
    <MenuItem value="free">Free</MenuItem>
    <MenuItem value="freeThreshold">Free From a Specific Amount</MenuItem>
    <MenuItem value="paid">Paid</MenuItem>
    </Select>
    </FormControl>
    </Grid>

    {webshop.deliveryCost === "freeThreshold" && (
      <Grid item xs={12} sm={6}>
      <TextField
      label="Free Delivery Threshold"
      name="freeDeliveryThreshold"
      value={webshop.freeDeliveryThreshold}
      onChange={handleThresholdChange}
      fullWidth
      required
      />
      </Grid>
      )}

    {webshop.deliveryCost === "paid" && (
      <Grid item xs={12} sm={6}>
      <TextField
      label="Delivery Cost"
      name="deliveryCostValue"
      value={webshop.deliveryCostValue}
      onChange={handleDeliveryCostValueChange}
      fullWidth
      required
      />
      </Grid>
      )}
     </Grid>


    </CardContent>
    <Divider sx={{ m: '0 !important' }} />
    <CardActions>
    <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained' onClick={(event) => handleSubmit(event, webshop)}>
    {selectedWebshop ? 'Save' : 'Submit'}
    </Button>
    <Button type='reset' size='large' color='secondary' variant='outlined' onClick={() => toast.error("This didn't work.")} onClick={resetForm}>
    Reset
    </Button>
    </CardActions>
    </form>
    </Card>
    )
}

export default FormLayoutsSeparator

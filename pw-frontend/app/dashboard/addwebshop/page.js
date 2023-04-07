'use client'
// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/navigation';
import { createWebshop, updateWebshop } from '@/api/webshopService';

import { useContext } from 'react';
import WebshopContext from '@/context/WebshopContext';

// ** Styled Component
import DatePickerWrapper from '@/core/styles/libs/react-datepicker'

import FormLayoutsSeparator from '@/components/forms/form-layouts/FormLayoutsSeparator'


import { Toast } from './core/CustomHotToast';

const FormLayouts = () => {



const router = useRouter();
const { selectedWebshop, setSelectedWebshop } = useContext(WebshopContext);


const handleSubmit = async (event, webshop) => {
  event.preventDefault();
  
  if (selectedWebshop) {
    try {
      await updateWebshop(selectedWebshop.id, webshop);
      setSelectedWebshop(null);
      Toast.success('Webshop updated successfully!');
      router.push('/dashboard');
    } catch (error) {
      Toast.error("Problem: " + error);
    }
  } else {

    let requestData = {
    name: webshop.name,
    url: webshop.url,
    country: webshop.country,
    deliveryCost: webshop.deliveryCost,
  };

  if (webshop.deliveryCost === "freeThreshold") {
    requestData.freeDeliveryThreshold = parseInt(webshop.freeDeliveryThreshold);
  } else {
    requestData.freeDeliveryThreshold = null;
  }

  if (webshop.deliveryCost === "paid") {
    requestData.fixedDeliveryCost = parseFloat(webshop.deliveryCostValue);
  } else {
    requestData.fixedDeliveryCost = null;
  }

  try {
    await createWebshop(requestData);
    Toast.success('Webshop created successfully!');
    router.push('/dashboard');
  } catch (error) {
    // Handle error, e.g., show an error message
    Toast.error("This didn't work.");
  }

  }
};

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <FormLayoutsSeparator handleSubmit={handleSubmit} selectedWebshop={selectedWebshop}  />
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

export default FormLayouts

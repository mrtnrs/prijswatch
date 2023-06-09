'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import CustomIcon from '@/vercelFix/Icon'

import AddWebshop from '@/components/AddWebshop'
import { getAllWebshops, deleteWebshop } from '@/api/webshopService';
import { updateSearchIndex } from '@/api/searchService';
import { usePathname } from 'next/navigation';
import { regenerateCategoryStructure } from '@/api/categoryService';
import { categoryStructure } from '@/utils/categoryStructure';

import { useContext } from 'react';
import WebshopContext from '@/context/WebshopContext';

import { testScraper, saveScraper, getAllScrapers, updateScraper, deleteScraper, updateScraperActiveState } from '@/api/scraperService';


// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Custom Components Imports
import CardStatisticsCharacter from './components/card-stats-with-image'

import WebshopsCard from '@/components/WebshopsCard';
import TableColumns from '@/views/TableColumns';
import DialogEditUserInfo from '@/views/DialogEditUserInfo';

// ** Styled Component Import
import KeenSliderWrapper from '@/core/styles/libs/keen-slider'
import ApexChartWrapper from '@/core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import EcommerceTable from '@/views/dashboards/EcommerceTable'
import EcommerceTotalVisits from '@/views/dashboards/EcommerceTotalVisits'
import EcommerceVisitsByDay from '@/views/dashboards/EcommerceVisitsByDay'
import EcommerceLiveVisitors from '@/views/dashboards/EcommerceLiveVisitors'
import EcommerceSalesOverview from '@/views/dashboards/EcommerceSalesOverview'
import EcommerceWeeklySalesBg from '@/views/dashboards/EcommerceWeeklySalesBg'
import EcommerceSalesThisMonth from '@/views/dashboards/EcommerceSalesThisMonth'
import EcommerceMarketingSales from '@/views/dashboards/EcommerceMarketingSales'
import EcommerceActivityTimeline from '@/views/dashboards/EcommerceActivityTimeline'
import EcommerceImpressionsOrders from '@/views/dashboards/EcommerceImpressionsOrders'
import EcommerceSalesOverviewWithTabs from '@/views/dashboards/EcommerceSalesOverviewWithTabs'

import { Toast } from '@/core/CustomHotToast';


function Dashboard() {
  const { currentUser, loading } = useAuth();

    if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser || currentUser.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return <div>Access denied</div>;
  }


 // const { data: session, status } = useSession();
  const router = useRouter();

  const [webshops, setWebshops] = useState([]);
  const [scrapers, setScrapers] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  // const { setSelectedWebshop } = useContext(WebshopContext);

  const [displayAddScraperDialog, setDisplayAddScraperDialog] = useState(false);
  const [selectedScraper, setSelectedScraper] = useState(null);


  useEffect(() => {
    const fetchWebshops = async () => {
      try {
      	console.log('trying');
        if(currentUser) {
        const fetchedWebshops = await getAllWebshops();
        const fetchedScrapers = await getAllScrapers();

        console.log(fetchedWebshops);
        console.log('scrapers:' + fetchedScrapers);
        console.log('scrapers:' + fetchedScrapers.scrapers);
        console.log(fetchedScrapers.scrapers);
        setWebshops(fetchedWebshops);
        setScrapers(fetchedScrapers.scrapers);
        }
      } catch (error) {
        console.error('Error fetching webshops or scrapers:', error);
      }
    };

    fetchWebshops();
  }, []);

  useEffect(() => {
    console.log('scrapers updated:', scrapers);
  }, [scrapers]);

  const editWebshop = (webshop) => {
  	console.log('editWebshop');
  	setIsEditing(true);
  	// setSelectedWebshop(webshop);
  	router.push('/dashboard/addwebshop');
  }

  const handleDeleteWebshop = async (id) => {
    try {
      await deleteWebshop(id);
      setWebshops(webshops.filter((webshop) => webshop.id !== id));
      // setSelectedWebshop(null);
      Toast.success('Webshop verwijderd');
    } catch (error) {
     Toast.error("Error deleting webshop:", error);
     console.error('Error deleting webshop:', error);
   }
 };

 const handleTest = async (formData) => {
   try {
    const result = await testScraper(formData.webshopId, formData.scraperSettings);
    console.log("Test result:", result);
    // Handle test result as needed
    Toast.success('Data fetched succesfully');
  } catch (error) {
    console.error("Error testing scraper:", error);
    Toast.error("Error fechting data:", error);
    // Handle error as needed
  }
}

// update scraper

const handleUpdate = async (formData) => {
  try {
    const { webshopId, scraperSettings, selectedScraper } = formData;

    const result = await updateScraper(selectedScraper.id, webshopId, scraperSettings);
    console.log("Update result:", result);
    // Handle update result as needed
    Toast.success('Scraper updated successfully');
  } catch (error) {
    console.error("Error updating scraper:", error);
    Toast.error("Error updating scraper:", error);
    // Handle error as needed
  }
}


const handleSave = async (formData) => {
	try {
    const result = await saveScraper(formData.webshopId, formData.scraperSettings);
    console.log("Test result:", result);
    // Handle test result as needed
    Toast.success('Scraper stored succesfully');
  } catch (error) {
    console.error("Error testing scraper:", error);
    Toast.error("Error fechting data:", error);
    // Handle error as needed
  }
}

const handleDeleteScraper = async (scraperId) => {
  try {
    await deleteScraper(scraperId);
    setScrapers((prevState) => prevState.filter((scraper) => scraper.id !== scraperId));
    Toast.success('Scraper deleted successfully');
    // Refresh the scrapers list or remove the deleted scraper from the state
  } catch (error) {
    console.error('Error deleting scraper:', error);
    Toast.error('Error deleting scraper:', error);
  }
};

const updateScraperActive = (scraperId, active) => {
  setScrapers(prevScrapers =>
    prevScrapers.map(scraper => {
      if (scraper.id === scraperId) {
        return { ...scraper, active };
      }
      return scraper;
    })
  );
};

// run scraper cont

const handleStartStop = async (scraperId, isActive) => {
  try {
    await updateScraperActiveState(scraperId, !isActive);
    updateScraperActive(scraperId, !isActive); // Add this line
    // Refresh the scrapers list or update the specific scraper's active state in the state
    Toast.success(isActive ? 'Scraper stopped successfully' : 'Scraper started successfully');
  } catch (error) {
    console.error('Error updating scraper active state:', error);
    Toast.error('Error updating scraper active state:', error);
  }
};

const handleNewScraperBtn = () => {
  setDisplayAddScraperDialog(true);
}

// update search index

const handleUpdateSearchIndex = async () => {
  try {
    const data = await updateSearchIndex();
    Toast.success(data.message);
  } catch (error) {
    console.error(error);
    Toast.error('Error updating search:', error);
  }
};

// update category structure

async function handleUpdateCatStructure() {
  try {
    await regenerateCategoryStructure();
    await categoryStructure.updateTree();
    // Add any additional actions required after updating the category structure
    Toast.success('Category structure updated');
  } catch (error) {
    console.error('Error regenerating and updating category structure:', error);
    Toast.error('Error updating category structure:', error);
  }
}


if (status === 'loading') return <div>Loading...</div>;

console.log('scrapers: ' + scrapers);
console.log(scrapers);
console.log(scrapers.length);

return (

 <>
  <Grid container spacing={6} className='match-height'>
    <Grid item xs={12} md={12}>
      <Button variant='contained' size='small' sx={{mr:5}} variant='contained' endIcon={<CustomIcon icon='mdi:refresh' />} onClick={handleUpdateSearchIndex}>
        Generate Search Index
      </Button>
      <Button variant='contained' size='small' variant='contained' endIcon={<CustomIcon icon='mdi:refresh' />} onClick={handleUpdateCatStructure}>
        Generate category structure
      </Button>
    </Grid>
  </Grid>
 <ApexChartWrapper>
 <KeenSliderWrapper>
 <DialogEditUserInfo 
 displayAddScraperDialog={displayAddScraperDialog}
 setDisplayAddScraperDialog={setDisplayAddScraperDialog}
 webshops={webshops}
 handleTest={handleTest}
 handleSave={handleSave} 
 selectedScraper={selectedScraper}
 handleUpdate={handleUpdate}
 onDelete={handleDeleteScraper}
  />
 <Grid container spacing={6} className='match-height'>
 <Grid item xs={12} md={12}>
 <WebshopsCard 
 webshops={webshops} 
 editWebshop={editWebshop}
 handleDeleteWebshop={handleDeleteWebshop}
 />
 </Grid>

 {scrapers && webshops && webshops.map((webshop) => (
  console.log(scrapers),
  console.log('helo'),  

  <Grid item xs={12} md={12}>
  { scrapers ? (
    scrapers.length > 0 ? (
     <TableColumns
     key={webshop.id}
     webshop={webshop}
     scrapers={scrapers.filter(scraper => scraper.webshopId === webshop.id)}
     handleNewScraperBtn={handleNewScraperBtn}
     setSelectedScraper={setSelectedScraper}
     setDisplayAddScraperDialog={setDisplayAddScraperDialog}
     onStartStop={handleStartStop}
     />) : (
     <p>No scrapers found</p>
     )
     ) : (
     <p>Loading scrapers...</p>
     )}
     </Grid>
  ))}

 <Grid item xs={12} md={6}>
 <EcommerceSalesOverview />
 </Grid>
 <Grid item xs={12} sm={6} md={3}>
 <CardStatisticsCharacter
 data={{
  stats: '8.14k',
  title: 'Ratings',
  chipColor: 'primary',
  trendNumber: '+15.6%',
  chipText: 'Year of 2022',
  src: '/images/cards/card-stats-img-1.png'
}}
/>
</Grid>
<Grid item xs={12} sm={6} md={3}>
<CardStatisticsCharacter
data={{
  stats: '12.2k',
  trend: 'negative',
  title: 'Sessions',
  chipColor: 'success',
  trendNumber: '-25.5%',
  chipText: 'Last Month',
  src: '/images/cards/card-stats-img-2.png'
}}
/>
</Grid>
<Grid item xs={12} md={6}>
<EcommerceWeeklySalesBg />
</Grid>
<Grid item xs={12} sm={6} md={3}>
<EcommerceTotalVisits />
</Grid>
<Grid item xs={12} sm={6} md={3}>
<EcommerceSalesThisMonth />
</Grid>
<Grid item xs={12} md={6}>
<EcommerceActivityTimeline />
</Grid>
<Grid item xs={12} md={6}>
<EcommerceSalesOverviewWithTabs />
</Grid>
<Grid item xs={12} sm={6} md={3}>
<EcommerceImpressionsOrders />
</Grid>
<Grid item xs={12} md={5} sx={{ order: [2, 2, 1] }}>
<EcommerceMarketingSales />
</Grid>
<Grid item xs={12} sm={6} md={4} sx={{ order: [1, 1, 2] }}>
<EcommerceLiveVisitors />
</Grid>
<Grid item xs={12} md={8} sx={{ order: 3 }}>
<EcommerceTable />
</Grid>
<Grid item xs={12} md={4} sx={{ order: 3 }}>
<EcommerceVisitsByDay />
</Grid>
</Grid>
</KeenSliderWrapper>
</ApexChartWrapper>

</>
);
}

export default Dashboard;


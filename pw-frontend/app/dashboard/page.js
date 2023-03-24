'use client'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Icon from '@/components/icon'

import { webshops } from './dummydata';

import AddWebshop from '@/components/AddWebshop'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Custom Components Imports
import CardStatisticsCharacter from './components/card-stats-with-image'
import DialogCreateApp from '@/components/dialog-examples/DialogCreateApp'

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

function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session || !session.user || session.user.email !== 'raesmaarten@gmail.com') {
     // router.replace('/login');
    }
  }, [session, router]);

  if (status === 'loading') return <div>Loading...</div>;

  return (

  	<>

  	 <ApexChartWrapper>
      <KeenSliderWrapper>
      <AddWebshop />
      <DialogCreateApp />
      <Button 
      variant='contained' 
      startIcon={<Icon icon='mdi:plus' fontSize={20} 
      onClick={() => aFunction()}
      />}>
            add webshop
       </Button>
        <Grid container spacing={6} className='match-height'>
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


     <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {webshops.map((webshop) => (
          <div key={webshop.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center mb-4">
              <img
                src={webshop.logo}
                alt={webshop.name}
                className="w-12 h-12 object-cover rounded mr-4"
              />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{webshop.name}</h2>
                <a href={webshop.url} className="text-gray-600 hover:text-gray-800">
                  {webshop.url}
                </a>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Scrapers</h3>
              <ul className="space-y-2 mt-2">
              {webshop.scrapers.map((scraper) => (
                  <li key={scraper.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-900">{scraper.info}</p>
                      <p className="text-sm text-gray-600">Last ran: {scraper.lastRan}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        scraper.status === 'running' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-800'
                      }`}
                    >
                      {scraper.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Errors</h3>
              <ul className="space-y-2 mt-2">
                {webshop.errors.slice(0, 2).map((error) => (
                  <li key={error.id} className="text-sm text-gray-600">
                    <p>{error.message}</p>
                    <p className="text-xs">{error.timestamp}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>

    </>
  );
}

export default Dashboard;

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from '@/components/Icon'

// ** Custom Components Imports
import CustomChip from '@/components/mui/chip'
import ReactApexcharts from '@/components/chartjs/react-apexcharts'



const ApexLineChart = ({ series }) => {
  // ** Hook
  const theme = useTheme();

//   const series = [
//   {
//     data: [280, 200, 220, 180, 270, 250, 70, 90, 200, 150, 160, 100, 150, 100, 50]
//   }
// ]

  // const options = {
  //   chart: {
  //     parentHeightOffset: 0,
  //     zoom: { enabled: false },
  //     toolbar: { show: false }
  //   },
  //   colors: ['#ff9f43'],
  //   stroke: { curve: 'straight' },
  //   dataLabels: { enabled: false },
  //   markers: {
  //     strokeWidth: 7,
  //     strokeOpacity: 1,
  //     colors: ['#ff9f43'],
  //     strokeColors: ['#fff']
  //   },
  //   grid: {
  //     padding: { top: -10 },
  //     borderColor: theme.palette.divider,
  //     xaxis: {
  //       lines: { show: true }
  //     }
  //   },
  //   tooltip: {
  //     custom(data) {
  //       return `<div class='bar-chart'>
  //         <span>${data.series[data.seriesIndex][data.dataPointIndex]}%</span>
  //       </div>`
  //     }
  //   },
  //   yaxis: {
  //     labels: {
  //       style: { colors: theme.palette.text.disabled }
  //     }
  //   },
  //   xaxis: {
  //     axisBorder: { show: false },
  //     axisTicks: { color: theme.palette.divider },
  //     crosshairs: {
  //       stroke: { color: theme.palette.divider }
  //     },
  //     labels: {
  //       style: { colors: theme.palette.text.disabled }
  //     },
  //     categories: [
  //       '7/12',
  //       '8/12',
  //       '9/12',
  //       '10/12',
  //       '11/12',
  //       '12/12',
  //       '13/12',
  //       '14/12',
  //       '15/12',
  //       '16/12',
  //       '17/12',
  //       '18/12',
  //       '19/12',
  //       '20/12',
  //       '21/12'
  //     ]
  //   }
  // }

  // const options = {
  //   chart: {
  //     type: 'line',
  //   },
  //   xaxis: {
  //     type: 'datetime',
  //   },
  //   yaxis: {
  //     labels: {
  //       formatter: (value) => {
  //         return value.toFixed(2);
  //       },
  //     },
  //   },
  // };

const options = {
  chart: {
    type: 'area',
    borderRadius: 10, // Add border radius to the chart
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800,
      animateGradually: {
        enabled: true,
        delay: 150,
      },
    },
  },dropShadow: { // Add dropShadow to create the appearance of rounded borders
      enabled: true,
      top: 0,
      left: 0,
      blur: 3,
      opacity: 0.5,
    },
  xaxis: {
    type: 'datetime',
    labels: {
      style: {
        colors: theme.palette.text.secondary,
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false, // Remove stripes above the dates
    },
  },
  yaxis: {
    show: true,
    labels: {
      style: {
        colors: theme.palette.text.secondary,
      },
      formatter: (value) => {
        return '€' + parseInt(value); // Remove ".00" after each number
      },
    },
  },
  grid: {
    show: false,
    borderColor: theme.palette.divider,
    strokeDashArray: 5,
    xaxis: {
      lines: {
        show: false,
      },
    },
  },
  stroke: {
    curve: 'smooth',
    width: 0,
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      type: 'vertical', // Change the gradient type
      shade: 'dark', // Change the gradient shade
      gradientToColors: [theme.palette.primary.dark, theme.palette.secondary.dark], // Add gradientToColors for matching colors
      opacityFrom: 0.7,
      opacityTo: 0.5,
      stops: [0, 90, 100],
    },
  },
  markers: {
    size: 0,
    strokeWidth: 0,
  },
  dataLabels: {
    enabled: false,
  },
  colors: [theme.palette.primary.main, theme.palette.secondary.main],
  tooltip: {
    theme: 'dark',
  },
  legend: {
    showForSingleSeries: false,
  },
};




  return <ReactApexcharts options={options} series={series} type="area" />;

}

export default ApexLineChart


  // return (

  //   <Card>
  //     <CardHeader
  //       title='Balance'
  //       subheader='Commercial networks & enterprises'
  //       sx={{
  //         flexDirection: ['column', 'row'],
  //         alignItems: ['flex-start', 'center'],
  //         '& .MuiCardHeader-action': { mb: 0 },
  //         '& .MuiCardHeader-content': { mb: [2, 0] }
  //       }}
  //       action={
  //         <Box sx={{ display: 'flex', alignItems: 'center' }}>
  //           <Typography variant='h6' sx={{ mr: 5 }}>
  //             $221,267
  //           </Typography>
  //           <CustomChip
  //             skin='light'
  //             color='success'
  //             sx={{ fontWeight: 500, borderRadius: 1, fontSize: '0.875rem' }}
  //             label={
  //               <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 1 } }}>
  //                 <Icon icon='mdi:arrow-up' fontSize='1rem' />
  //                 <span>22%</span>
  //               </Box>
  //             }
  //           />
  //         </Box>
  //       }
  //     />
  //     <CardContent>
  //       <ReactApexcharts type='line' height={400} options={options} series={series} />
  //     </CardContent>
  //   </Card>
  // )

import React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import ReactApexcharts from '@/components/chartjs/react-apexcharts';
import format from 'date-fns/format';

const ApexLineChart = ({ series }) => {
  const theme = useTheme();

  const options = {
    chart: {
      type: 'line',
      toolbar: {
        show: false,
      },
    },
    stroke: {
      width: 4,
      curve: 'smooth',
    },
    markers: {
      size: 7,
      strokeColor: '#0e172a',
      strokeWidth: 4, // Add this line
      hover: {
        size: 7,
      },
    },
    colors: ['#5555FF', '#FF55B8'],
    grid: {
      show: false,
    },
    xaxis: {
      type: 'category',
      categories: [format(new Date(), 'MM/dd/yyyy')],
      labels: {
        style: {
          fontSize: '11px',
          fontFamily: 'Helvetica Neue',
          fontWeight: 300,
          cssClass: 'apexcharts-xaxis-label',
          colors: theme.palette.text.secondary,
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
    },
legend: {
  show: true,
  position: 'top',
  horizontalAlign: 'right',
  fontSize: '12px',
  fontFamily: 'Helvetica Neue',
  fontWeight: 400,
  labels: {
    colors: theme.palette.text.primary,
  },
  formatter: function(seriesName) {
    const maxLength = 18;
    return seriesName.length > maxLength ? seriesName.substring(0, maxLength) + '...' : seriesName;
  },
},
  dataLabels: {
    enabled: true,
    offsetX: -2,
    offsetY: -6,
    style: {
      fontSize: '14px',
      opacity: 0.7,
      fontFamily: 'Helvetica, Arial, sans-serif',
      colors: [theme.palette.text.primaryRGBA],
    },
    formatter: function (val, opt) {
      return "€" + val.toFixed(0); // Format the value as you need
    },
    background: {
      enabled: false,
    }
  },
    tooltip: {
      enabled: false,
    },
    fill: {
      type: 'gradient',
      gradient: {
        type: 'vertical',
        shadeIntensity: 1,
        opacityFrom: 1,
        opacityTo: 0,
        stops: [0, 100],
      },
    },
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        maxHeight: '430px !important',
        minHeight: '430px !important',
        fontFamily: 'Helvetica Neue',
        fontSize: '14px',
        fontWeight: 300,
        display: 'block', 
      }}
    >
      <ReactApexcharts options={options} series={series} height='100%' type='line' style={{display: 'block', width: "100%", maxHeight: '430px', minHeight: '430px important', height: '430px'}} />
    </Box>
  );
};

export default ApexLineChart;

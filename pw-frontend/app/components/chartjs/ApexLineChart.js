import React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import ReactApexcharts from '@/components/chartjs/react-apexcharts';

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
      width: 3,
      curve: 'smooth',
    },
    markers: {
      size: 5,
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
      categories: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
      labels: {
        style: {
          fontSize: '11px',
          fontFamily: 'Helvetica Neue',
          fontWeight: 300,
          cssClass: 'apexcharts-xaxis-label',
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
      show: false,
    },
    tooltip: {
      enabled: false,
    },
    dataLabels: {
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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        fontFamily: 'Helvetica Neue',
        fontSize: '14px',
        fontWeight: 300,
      }}
    >
      <ReactApexcharts options={options} series={series} type='line' />
    </Box>
  );
};

export default ApexLineChart;

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import CustomIcon from '@/vercelFix/Icon'

// ** Custom Components Imports
import CustomAvatar from '@/components/mui/avatar'
import OptionsMenu from '@/components/option-menu'

const salesData = [
  {
    stats: '8,458',
    color: 'primary',
    title: 'Customers',
    icon: <CustomIcon icon='mdi:account-outline' />
  },
  {
    stats: '$28.5k',
    color: 'warning',
    title: 'Total Profit',
    icon: <CustomIcon icon='mdi:poll' />
  },
  {
    color: 'info',
    stats: '2,450k',
    title: 'Transactions',
    icon: <CustomIcon icon='mdi:trending-up' />
  }
]

const renderStats = () => {
  return salesData.map((sale, index) => (
    <Grid item xs={12} sm={4} key={index}>
      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
        <CustomAvatar skin='light' variant='rounded' color={sale.color} sx={{ mr: 4 }}>
          {sale.icon}
        </CustomAvatar>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='h6' sx={{ fontWeight: 600 }}>
            {sale.stats}
          </Typography>
          <Typography variant='caption'>{sale.title}</Typography>
        </Box>
      </Box>
    </Grid>
  ))
}

const EcommerceSalesOverview = () => {
  return (
    <Card>
      <CardHeader
        sx={{ pb: 3.25 }}
        title='Sales Overview'
        titleTypographyProps={{ variant: 'h6' }}
        action={
          <OptionsMenu
            options={['Last 28 Days', 'Last Month', 'Last Year']}
            iconButtonProps={{ size: 'small', className: 'card-more-options' }}
          />
        }
        subheader={
          <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { color: 'success.main' } }}>
            <Typography variant='caption' sx={{ mr: 1.5 }}>
              Total 42.5k Sales
            </Typography>
            <Typography variant='subtitle2' sx={{ color: 'success.main' }}>
              +18%
            </Typography>
            <CustomIcon icon='mdi:chevron-up' fontSize={20} />
          </Box>
        }
      />
      <CardContent>
        <Grid container spacing={6}>
          {renderStats()}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default EcommerceSalesOverview

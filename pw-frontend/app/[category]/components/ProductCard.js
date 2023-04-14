// ** MUI Import
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import AvatarGroup from '@mui/material/AvatarGroup'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'

import Button from '@mui/material/Button'

// ** Icon Imports
import Icon from '@/components/icon'
import Link from 'next/link';

// ** Custom Components Imports
import CustomChip from '@/components/mui/chip'
import OptionsMenu from '@/components/option-menu'

const ProductCard = ({
            name,
          brand,
          image,
          metadata,
          lastCheck,
          url,
          webshopId,
          price}) => {
  return (
    <Card>
      <CardMedia sx={{ height: 200 }} image={`https://prijs.watch/${image}`} />
      <CardContent>
        <Box sx={{ mb: 3.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomChip
              skin='light'
              size='small'
              color='success'
              label='UI Design'
              sx={{ mr: 2.5, height: 20, fontSize: '0.75rem', fontWeight: 500 }}
            />
            <CustomChip
              skin='light'
              size='small'
              color='error'
              label='React'
              sx={{ height: 20, fontSize: '0.75rem', fontWeight: 500 }}
            />
          </Box>
          <OptionsMenu
            options={['Last 28 Days', 'Last Month', 'Last Year']}
            iconButtonProps={{ size: 'small', className: 'card-more-options' }}
          />
        </Box>

        <Typography variant='h6' sx={{ mb: 1 }}>
          {name}
        </Typography>
        <Typography variant='body2' sx={{ mb: 4, fontWeight: 600 }}>
          € {price}
        </Typography>
        <Typography variant='body2' sx={{ mb: 6.25 }}>
          {metadata}
        </Typography>
        <Box sx={{ mb: 1.25, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <AvatarGroup sx={{ mr: 2 }}>
            <Avatar src='/images/avatars/3.png' alt='Olivia Sparks' />
          </AvatarGroup>
          <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 1, color: 'text.secondary' } }}>
          <Link href={url} target="_blank">
        <Button fullWidth variant='contained' endIcon={<Icon icon='mdi:arrow-right' />}>
          Ga naar webshop
        </Button>
        </Link>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ProductCard

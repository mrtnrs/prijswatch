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



import Link from 'next/link';

// ** Custom Components Imports
import CustomChip from '@/components/mui/chip'
import OptionsMenu from '@/components/option-menu'
// ** Icon Imports
import CustomIcon from '@/vercelFix/Icon';



const ProductCard = ({
            name,
          brand,
          image,
          metadata,
          lastCheck,
          url,
          webshopId,
          price}) => {


  const translate = (key) => {
  const translations = {
    color: "Kleur",
    storage: "Opslag",
    brand: "Merk",
    game: "Spel",
  };
  return translations[key] || key;
};

const metadataObject = JSON.parse(metadata);
const metadataArray = Object.entries(metadataObject);


  return (
    <Card sx={{ outline: "1px solid #ffffff26", border: "1px solid #00000069"}}>
      <CardMedia sx={{ height: 200, backgroundSize: "contain", backgroundColor: 'white' }} image={`${image}`} />
      <CardContent sx={{position: "relative", backgroundColor: "rgb(30 41 59 / 4%)"}}>
        <Box sx={{ mb: 3.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', display: 'none' }}>
          <OptionsMenu
            options={['Last 28 Days', 'Last Month', 'Last Year']}
            iconButtonProps={{ size: 'small', className: 'card-more-options' }}
          />
        </Box>

        <Typography variant='h6' sx={{ 
          mb: 1,     
        marginTop: "1rem",
        fontWeight: 700,
        fontSize: "1rem",
        paddingBottom: "1rem",
        marginBottom: "1rem",
        borderBottom: "1px solid #ffffff12" }}>
          {name}
        </Typography>
        <Typography variant='body2' 
        sx={{ 
          mb: 4, 
          fontWeight: 600,
              margin: "2rem 0px",
    backdropFilter: "blur(3px)",
    borderRadius: "12px",
    boxShadow: "rgb(0 0 0 / 50%) 0px 3px 2px",
    padding: "5px 10px",
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#10172a",
    top: '-3.1rem',
    left: "5%",
    fontSize: "1.1rem",
    backgroundColor: "rgb(254 254 255)",
    border: "1.5px solid #10172a",
    fontWeight: 900,
    letterSpacing: "-1.9px"
     }}>
          € {price}
        </Typography>
        <Typography variant='body2' sx={{ mb: 6.25 }}>
  <div>
    {metadataArray.map(([key, value], index) => (
      <CustomChip
        key={index}
        skin='light'
        size='small'
        label={`${translate(key)}: ${value}`}
        sx={{
          mr: index !== metadataArray.length - 1 ? 2.5 : 0,
          height: 20,
          fontSize: '0.75rem',
          fontWeight: 500,
        }}
      />
    ))}
  </div>
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'end' }}>
          <AvatarGroup 
          sx={{ mr: 2,
           position: "absolute", top: "-1.3rem", right: "0" }}>
            <Avatar src='/images/avatars/3.png' alt='Olivia Sparks' />
          </AvatarGroup>
          <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 1, color: 'text.secondary' } }}>
          <Link href={url} target="_blank">
        <Button fullWidth variant='contained' endIcon={<CustomIcon icon='mdi:arrow-right' />}>
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

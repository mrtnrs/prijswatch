// ** MUI Import
import { useMemo } from 'react';
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import AvatarGroup from '@mui/material/AvatarGroup'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'

import Button from '@mui/material/Button';
import Link from 'next/link';

// ** Custom Components Imports
import CustomChip from '@/components/mui/chip'
import OptionsMenu from '@/components/option-menu'
// ** Icon Imports
import CustomIcon from '@/vercelFix/Icon';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles'

import Tooltip from '@mui/material/Tooltip';


const ProductCard = ({
            name,
          brand,
          image,
          metadata,
          lastCheck,
          url,
          webshopId,
          price,
          displayMode,
          webshopNaam }) => {

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const isMid = useMediaQuery(theme => theme.breakpoints.between('md', 'lg'));
  const isUp = useMediaQuery(theme => theme.breakpoints.up('lg'));
  const isDown = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const theme = useTheme();

  const logoSrc = useMemo(() => `/webshoplogos/${webshopNaam.toLowerCase()}logo.webp`, [webshopNaam]);

  const translate = (key) => {
  const translations = {
    color: "Kleur",
    storage: "Opslag",
    brand: "Merk",
    game: "Spel",
    accessory: "Accessoire"
  };
  return translations[key] || key;
};

const getAvatarImage = (webshopId) => {
  const images = {
    "6172ce4c-aeca-4490-bc83-e9322729b72f": '/webshoplogos/dreamlandlogo.webp',
    "8144308c-2698-4b1b-a7f4-b5e4f6bed0f3": '/webshoplogos/dreamlandlogo.webp',
    "89d2675e-509b-409c-9db7-a02eae2dbcd0": '/webshoplogos/dreamlandlogo.webp',
    "c69597b9-c50d-4c26-b152-60799af42608": '/webshoplogos/dreamlandlogo.webp',
  };

  return images[webshopId] || '';
};


const metadataObject = JSON.parse(metadata);
const metadataArray = Object.entries(metadataObject);


  const GridCard = () => (
    <Card sx={{ 
      outline: "1px solid #ffffff26", 
      border: "1px solid #00000069", 
      height: displayMode === 'grid' ? '100%' : 'auto', 
      display: "flex", 
      flexDirection: displayMode === 'grid' ? "column" : "row", 
      width: displayMode === 'grid' ? 'auto' : '100%',
      marginBottom: displayMode === 'grid' ? 0 : 2,
    }}
    className='product' data-price={price}
    >
      <CardMedia sx={{ 
        height: displayMode === 'grid' ? 200 : '100%',
        backgroundSize: "contain", 
        backgroundColor: 'white', 
        width: displayMode === 'grid' ? "100%" : "20%" 
      }} image={`${image}`} />
      <CardContent sx={{
        position: "relative", 
        backgroundColor: "rgb(30 41 59 / 4%)", 
        display: "flex", 
        flexDirection: displayMode === 'grid' ? 'column' : 'row',
        flex: 1,
        alignItems: 'stretch',
        padding: displayMode === 'grid' ? 1 : 2,
        gap: displayMode === 'grid' ? 0 : 2,
        padding: '0.65rem !important',
        paddingBottom: '0.8rem !important',
      }}>
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
        lineHeight: '28px',
        fontSize: "1rem",
        paddingBottom: "1rem",
        paddingRight: '2rem',
        marginBottom: "1rem",
        borderBottom: "1px solid #ffffff12",
        maxWidth: '91%', }}>
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
    position: displayMode === 'grid' ? "absolute" : "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: theme.palette.mode === 'light' ? "rgba(76, 78, 100, 0.95)"  : "#10172a",
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
        <Typography component='div' variant='body2' sx={{ mb: 6.25 }}>
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
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', marginTop: 'auto', justifyContent: 'end' }}>
          <AvatarGroup 
          sx={{ mr: 2,
           position: displayMode === 'grid' ? "absolute" : "relative",
           top: "-1.7rem", right: "0" }}>
            <Avatar sx={{width: '60px', height: '60px', opacity: '1', transition: 'opacity .5s'}} src={logoSrc} alt='Webshop Logo' />
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
  );

  const ListCard = () => (
        <Card sx={{ 
      outline: "1px solid #ffffff26", 
      border: "1px solid #00000069", 
      minHeight: isMobile ? '5rem' : '5rem',
      display: "flex !important", 
      flexDirection: "row", 
      width: '100%',
      overflow: 'visible',
      height: '100%',
      maxWidth: isDown ? '90vw' : 'unset',
    }} className='product' data-price={price} >
      <CardMedia sx={{ 
        height: isMobile ? 'auto' : '100%',
        maxHeight: isMobile ? '200px' : 'none',
        backgroundSize: "contain", 
        backgroundColor: 'white', 
        width: isMobile ? '15%' : '20%',
        minWidth: "15%",
        borderRadius: "10px 0 0 10px",
      }} image={`${image}`} />
      <CardContent sx={{
        position: "relative", 
        backgroundColor: "rgb(30 41 59 / 4%)", 
        display: "flex", 
        flexDirection: 'row',
        flex: 1,
        alignItems: 'stretch',
        justifyContent: "space-between",
        padding: 0,
        paddingBottom: '0 !important',
        gap: displayMode === 'grid' ? 0 : 2,
        maxWidth: '85%',
        width: '85%',
        minWidth: '85%',
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : (isMid ? 'column' : 'row-reverse'),
          borderRight: "1px solid #ffffff1c", 
          padding: "0.2rem 0.5rem",
          width: isMobile ? '4rem' : '13%',
          minWidth: isMobile ? '4rem' : (isMid ? '13%' : '14%'),
          justifyContent: isMobile ? 'unset' : (isMid ? 'unset' : 'flex-end'),
          marginLeft: isUp ? '-3%' : 'unset',
        }}>
            <Typography variant='body2' 
              sx={{ 
                height: '100%',
                fontWeight: 600,
                backdropFilter: "blur(3px)",
                borderRadius: "12px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: theme.palette.mode === 'light' ? "rgba(76, 78, 100, 0.95)"  : "white",
                fontSize: isMobile ? ".8rem" : "1rem",
                fontWeight: 600,
                letterSpacing: "-1px",
                marginLeft: isMobile ? '' : (isMid ? '' : '1rem'),
              }}>
                € {price}
            </Typography>
            <AvatarGroup 
              sx={{
                height: isMobile ? '2.5rem' : (isMid ? '3rem' : '4rem'),
                width: isMid ? '3rem' : (isMobile ? '2.5rem' : '4.3rem'),
                position: isMobile ? 'absolute' : (isMid ? 'absolute' : 'relative'),
                left: isMobile ? '-1.4rem' : '-3%',
                top: isMobile ? '57%' : (isMid ? '17%' : '4.5%'),
                }}>
                  <Avatar sx={{width: '100%', minWidth: '2rem', height: '100%', maxWidth: '4rem', '& img': {opacity: "1", transition: 'opacity 5s ease-in' }}} src={logoSrc} alt='Webshop Logo' />
            </AvatarGroup>
        </Box>

          <Box sx={{ 
          flexGrow: 1, 
          display: "flex", 
          justifyContent: isMobile ? "center" : "flex-start", 
          alignItems: isDown ? 'flex-start' : "center",
          flexDirection: isDown ? 'column' : 'row', 
          width: isDown ? '50%' : '70%', minWidth: isDown ? '50%' : '70%', maxWidth: '70%'}}>
        <Typography variant='h6' sx={{ 
        fontWeight: 600,
        lineHeight: '20px',
        fontSize: ".8rem",
        minWidth: '62%',
        width: isDown ? '100%' : '62%',
        marginRight: '5px',
        paddingTop: '5px',
        paddingBottom: '5px',

        maxHeight: isDown ? '3.1rem' : 'unset',
  overflow: isDown ? 'hidden' : 'unset',


         }}>
          {name.length > 46 ? `${name.substring(0, 46)}...` : name}
        </Typography>
        <Typography component='div' variant='body2' sx={{     marginBottom: "0",
    maxHeight: "100%",
    overflow: "scroll",
    width: isDown ? "100%" : 'unset',
    paddingTop: "0.3rem",
    borderBottom: "0.3rem solid #80808000" }}>
  <Box sx={{ display: isDown ? 'flex' : 'block'}}>
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
  </Box>

        </Typography>

          </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'end', 
        minWidth: isMid ?  '12%' : '10%', 
        maxWidth: isMid ? '12%' : '10%', 
        width: isMid ? '12%' : '10%', 
        borderLeft: "1px solid #ffffff1c" }}>

          <Box sx={{ 
            display: 'flex', 
          alignItems: 'center', 
          height: "100%", 
          width: "100%", 
          '& svg': { color: 'text.secondary' }, 
          '& span': { marginLeft: '0 !important', 
          marginRight: '0 !important',
          marginLeft: isMobile ? '0' : '5px' } }}>
          <Link href={url} target="_blank" style={{    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%"}}>
    <Tooltip title="Naar webshop" placement="top">
        <Button fullWidth variant='contained' sx={{ backgroundColor: 'transparent !important', height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minWidth: "unset",
    width: "100%",
    padding: '0',
    color: theme.palette.mode === 'light' ? 'rgba(76, 78, 100, 0.95)' : '',
    paddingRight: isMobile ? '' : '5%',
    fontSize: isMobile ? '' : (isMid ? '.57rem' : "0.68rem"),
    margin: '0',
  }} endIcon={<CustomIcon icon='mdi:arrow-right' />}>
         {isMobile ? '' : 'Naar webshop'}
        </Button>
        </Tooltip>
        </Link>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

   return displayMode === 'grid' ? <GridCard /> : <ListCard />;
}

export default ProductCard

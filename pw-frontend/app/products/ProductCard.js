// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

const ProductCard = ({ product }) => {
  return (
    <Card>
      <CardMedia sx={{ height: 140 }} image={product.imageUrl} />
      <CardContent sx={{ p: theme => `${theme.spacing(4, 5)} !important` }}>
        <Typography variant='h6' sx={{ mb: 2 }}>
          {product.name}
        </Typography>
        <Typography sx={{ mb: 2 }}>{product.url}</Typography>
        <Typography variant='body2'>
          {product.id}
        </Typography>
      </CardContent>
      <Button size='large' variant='contained' sx={{ width: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
        Add To Cart
      </Button>
    </Card>
  )
}

export default ProductCard

// ** React Imports
import { useState } from 'react'
import Link from 'next/link'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Radio from '@mui/material/Radio'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import Dialog from '@mui/material/Dialog'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import RadioGroup from '@mui/material/RadioGroup'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import Box from '@mui/material/Box'
import CardHeader from '@mui/material/CardHeader'
import DialogTitle from '@mui/material/DialogTitle'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormControlLabel from '@mui/material/FormControlLabel'
import DialogContentText from '@mui/material/DialogContentText'

// ** Third Party Imports

// ** Custom Components Imports
import CustomChip from '@/components/mui/chip'

// ** Util Import
import { formatCVC, formatExpirationDate, formatCreditCardNumber } from '@/core/utils/format'


const PaymentMethodCard = ({webshops, editWebshop, handleDeleteWebshop}) => {
  // ** States
  const [name, setName] = useState('')
  const [cvc, setCvc] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [focus, setFocus] = useState()
  const [expiry, setExpiry] = useState('')
  const [openEditCard, setOpenEditCard] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [selectedCard, setSelectedCard] = useState(null)

  const webshopsAsJSON = JSON.stringify(webshops);

  const [importedWebshops, setImportedWebShops] = useState(webshops);

  const handleEditCardClickOpen = id => {
    setSelectedCard({
      cardId: id,
      focus: undefined,
      name: data[id].name,
      cvc: data[id].cardCvc,
      expiry: data[id].expiryDate,
      cardNumber: data[id].cardNumber
    })
    setOpenEditCard(true)
  }

  const handleEditCardClose = () => {
    setOpenEditCard(false)
    setTimeout(() => {
      setSelectedCard(null)
    }, 200)
  }
  const handleBlur = () => setFocus(undefined)
  const handleSelectedCardBlur = () => setFocus(undefined)

  const handleInputChange = ({ target }) => {
    if (target.name === 'cardNumber') {
      target.value = 1234
      setCardNumber(target.value)
    } else if (target.name === 'expiry') {
      target.value = formatExpirationDate(target.value)
      setExpiry(target.value)
    } else if (target.name === 'cvc') {
      target.value = 111
      setCvc(target.value)
    }
  }

  const handleResetForm = () => {
    setCvc('')
    setName('')
    setExpiry('')
    setCardNumber('')
  }

  return (
    <>
      <Card>
        <CardContent>
          <Grid container spacing={12}> 
            <Grid item xs={12} md={12}>
              <Typography sx={{ mb: 4, fontWeight: 500 }}>Webshops</Typography>

      {/* Display your webshops */}

              {webshops.map((webshop, index) => (
                <Box
                  key={index.id}
                  sx={{
                    p: 5,
                    display: 'flex',
                    borderRadius: 1,
                    flexDirection: ['column', 'row'],
                    justifyContent: ['space-between'],
                    backgroundColor: 'action.hover',
                    alignItems: ['flex-start', 'center'],
                    mb: 4,
                  }}
                >

                  <div>
                    <img height='25' alt={webshop.imgAlt} src={webshop.logo} />
                    <Box sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ fontWeight: 'bold', color: 'white' }}>{webshop.name}</Typography>
                      {webshop.cardStatus ? (
                        <CustomChip
                          skin='light'
                          size='small'
                          label={item.cardStatus}
                          color={item.badgeColor}
                          sx={{ height: 20, ml: 2, fontSize: '0.75rem', fontWeight: 600, borderRadius: '5px' }}
                        />
                      ) : null}
                    </Box>
                    <Typography sx={{ color: 'text.secondary'}}>
                    <Link href={webshop.url} target="_blank">
                      {webshop.url}
                    </Link>
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                      {webshop.id}
                    </Typography>
                    <CustomChip label='# scrapers' color='info' variant='outlined' sx={{mr: 3, mt: 3}} />
                    <CustomChip label='# products' color='info' variant='outlined' sx={{mr: 3, mt: 3}} />
                  </div>

                  <Box sx={{ mt: [3, 0], textAlign: ['start', 'end'] }}>
                    <Button variant='outlined' sx={{ mr: 3 }} onClick={() => editWebshop(webshop)}>
                      Edit
                    </Button>
                    <Button variant='outlined' color='secondary' onClick={() => handleDeleteWebshop(webshop.id)}>
                      Delete
                    </Button>
                    <Typography variant='caption' sx={{ mt: 8, display: 'block', color: 'text.secondary' }}>
                      Created at {webshop.createdAt}
                    </Typography>
                  </Box>
                </Box>
              ))}

              <Link href="/dashboard/addwebshop">
              <Button type='submit' variant='contained' sx={{ mr: 5, mt: 5 }}>
                Add Webshop
              </Button>
              </Link>
          </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}

export default PaymentMethodCard

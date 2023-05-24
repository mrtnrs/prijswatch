'use client'
// ** React Imports
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext';

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel from '@mui/material/FormControlLabel'

// ** Icon Imports
import CustomIcon from '@/vercelFix/Icon'

// ** Configs
import themeConfig from '@/core/configs/themeConfig'


// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: 450 }
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const LoginV1 = () => {

  const { signInWithEmailAndPassword, currentUser } = useAuth() // Get signInWithEmailAndPassword from AuthContext
  const router = useRouter()

// Inside LoginV1 component
useEffect(() => {
  if (currentUser) {
    router.push('/'); // Redirect to the front page or any other page of your choice
  }
}, [currentUser, router]);
  // ** State
  const [values, setValues] = useState({
    password: '',
    showPassword: false
  })

  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')


  const handleSubmit = async e => {
    e.preventDefault()
    setEmailError(false)
    setPasswordError(false)
    setErrorMessage('')

    if (email === '') {
      setEmailError(true)
    }
    if (values.password === '') {
      setPasswordError(true)
    }
    if (email && values.password) {
      console.log('check 1');
      try {
        console.log('check 2');
        await signInWithEmailAndPassword(email, values.password, rememberMe)
        router.back() // Navigate back to the previous page
      } catch (error) {
    if (error.message.startsWith('Error during sign-in')) {
      setErrorMessage("Probleem bij inloggen. Controleer je email en wachtwoord.");
    } else if (error.message === 'Email not verified. Please verify your email before logging in.') {
      setErrorMessage('Email not verified. Please verify your email before logging in.');
    } else {
      setErrorMessage('Inloggen niet gelukt. Controleer je wachtwoord en emailadres.');
    }
  }
    }
  }

  // ** Hook
  const theme = useTheme()

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }

  return (
    <Box className='content-center' sx={{ display: "flex", justifyContent: 'center', alignItems: 'center'}}>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ p: theme => `${theme.spacing(13, 7, 6.5)} !important` }}>

          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ mb: 1.5, fontWeight: 600, letterSpacing: '0.18px' }}>
              {`Welcome to ${themeConfig.templateName}! 👋🏻`}
            </Typography>
            <Typography variant='body2'>Please sign-in to your account and start the adventure</Typography>
          </Box>
          <form noValidate autoComplete='off' onSubmit={handleSubmit}>
            <TextField
        autoFocus
        fullWidth
        id='email'
        label='Email'
        sx={{ mb: 4 }}
        value={email}
        onChange={e => setEmail(e.target.value)}
        error={emailError}
        helperText={emailError ? 'Email is required' : ''}
      />
            <FormControl fullWidth>
              <InputLabel htmlFor='auth-login-password'>Password</InputLabel>
              <OutlinedInput
                label='Password'
                autoComplete="on"
                value={values.password}
                id='auth-login-password'
                onChange={handleChange('password')}
                type={values.showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      aria-label='toggle password visibility'
                    >
                      <CustomIcon icon={values.showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <Box
              sx={{ mb: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}
            >
              <FormControlLabel
        label='Remember Me'
        control={<Checkbox checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />}
        sx={{ '& .MuiFormControlLabel-label': { color: 'text.primary' } }}
      />
              <Typography
                variant='body2'
                component={Link}
                href='/pages/auth/forgot-password-v1'
                sx={{ color: 'primary.main', textDecoration: 'none' }}
              >
                Forgot Password?
              </Typography>
            </Box>
            <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 7 }}>
              Login
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography sx={{ mr: 2, color: 'text.secondary' }}>Wil je registreren?</Typography>
              <Typography
                component={Link}
                href='/registreer'
                sx={{ color: 'primary.main', textDecoration: 'none' }}
              >
                Maak account aan
              </Typography>
            </Box>
            <Divider
              sx={{
                '& .MuiDivider-wrapper': { px: 4 },
                mt: theme => `${theme.spacing(5)} !important`,
                mb: theme => `${theme.spacing(7.5)} !important`
              }}
            >
              or
            </Divider>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconButton href='/' component={Link} sx={{ color: '#497ce2' }} onClick={e => e.preventDefault()}>
                <CustomIcon icon='mdi:facebook' />
              </IconButton>
              <IconButton href='/' component={Link} sx={{ color: '#1da1f2' }} onClick={e => e.preventDefault()}>
                <CustomIcon icon='mdi:twitter' />
              </IconButton>
              <IconButton
                href='/'
                component={Link}
                onClick={e => e.preventDefault()}
                sx={{ color: theme => (theme.palette.mode === 'light' ? '#272727' : 'grey.300') }}
              >
                <CustomIcon icon='mdi:github' />
              </IconButton>
              <IconButton href='/' component={Link} sx={{ color: '#db4437' }} onClick={e => e.preventDefault()}>
                <CustomIcon icon='mdi:google' />
              </IconButton>
            </Box>
            {errorMessage && (
        <Typography variant='body2' sx={{ color: 'error.main', mb: 2 }}>
          {errorMessage}
        </Typography>
      )}
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

export default LoginV1

'use client'
// ** React Imports
import { useState, Fragment, useEffect, useRef } from 'react'
import { signUpUserWithEmailAndPassword, getCurrentUser, auth } from "./../../firebase/auth.js";
import { sendEmailVerification } from "firebase/auth";

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel from '@mui/material/FormControlLabel'
import { FormHelperText } from '@mui/material';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Alert from '@mui/material/Alert';

// ** Icon Imports
import CustomIcon from '@/vercelFix/Icon'

// ** Configs
import themeConfig from '@/core/configs/themeConfig'
import { useRouter } from 'next/navigation'

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const RegisterV1 = () => {
  // ** States
  const router = useRouter();
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [privacyError, setPrivacyError] = useState('');
  const [firebaseError, setFirebaseError] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [open, setOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const [values, setValues] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false,
    agreedTerms: false,
  });

const [errors, setErrors] = useState({
  email: null,
  password: null,
  confirmPassword: null,
});

  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  // ** Hook
  const theme = useTheme()

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

const handleChange = (prop) => (event) => {
  setValues({ ...values, [prop]: event.target.value });

  if (prop === 'email') {
    setErrors({ ...errors, email: validateEmail(event.target.value) ? '' : 'Invalid email' });
  } else if (prop === 'password') {
    setErrors({ ...errors, password: event.target.value.length >= 6 ? '' : 'Password must be at least 6 characters long' });
  } else if (prop === 'confirmPassword') {
    if (!event.target.value) {
      setErrors({ ...errors, confirmPassword: 'Confirm password is required' });
    } else {
      setErrors({ ...errors, confirmPassword: event.target.value === values.password ? '' : 'Passwords do not match' });
    }
  } else if (prop === 'agreedTerms') {
    setValues({ ...values, agreedTerms: event.target.checked });
    setPrivacyError(event.target.checked ? '' : 'You must accept the privacy policy and terms.');
  }
};
  
  const handleClickOpen = () => {
  setOpen(true);
};

const handleClose = () => {
  setOpen(false);
};


  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword, showConfirmPassword: !values.confirmPassword })
  }

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }

const onFormDataSubmit = async (event) => {
  event.preventDefault();
  setFormSubmitted(true);

  if (values.password !== values.confirmPassword) {
    setErrors((prevErrors) => ({
      ...prevErrors,
      confirmPassword: "Passwords do not match",
    }));
    return;
  }

  if (!values.agreedTerms) {
    setPrivacyError("You must accept the privacy policy and terms.");
    return;
  }

  if (errors.email || errors.password || errors.confirmPassword || privacyError) {
    return;
  }

  try {
    await signUpUserWithEmailAndPassword(values.email, values.password);

    const actionCodeSettings = {
      url: window.location.origin,
      handleCodeInApp: true,
    };

    await sendEmailVerification(auth.currentUser, actionCodeSettings);
    setOpen(true);
  } catch (error) {
    console.error("Firebase error:", error);
    setFirebaseError(error.message);
  }
};




  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        setUserEmail(auth.currentUser.email);
      }
    });
  }, [auth]);

  return (
<div>
{formSubmitted && (
  (Object.keys(errors).length > 0 || privacyError || firebaseError) && (
  <Alert severity="error" sx={{ my: 2 }}>
    {Object.values(errors).map((error, index) => (
      <Typography key={index} variant="body2" color="error">
        {error}
      </Typography>
    ))}
    {privacyError && (
      <Typography variant="body2" color="error">
        {privacyError}
      </Typography>
    )}
    {firebaseError && (
      <Typography variant="body2" color="error">
        Kan niet registeren. Misschien wil je  <Link href="/login" style={{textDecoration: 'underline'}}>inloggen?</Link>
      </Typography>
    )}
  </Alert>
  )
)}
    <Box className='content-center' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ p: theme => `${theme.spacing(15.5, 7, 6.5)} !important` }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={47} fill='none' height={26} viewBox='0 0 268 150' xmlns='http://www.w3.org/2000/svg'>
              <rect
                rx='25.1443'
                width='50.2886'
                height='143.953'
                fill={theme.palette.primary.main}
                transform='matrix(-0.865206 0.501417 0.498585 0.866841 195.571 0)'
              />
              <rect
                rx='25.1443'
                width='50.2886'
                height='143.953'
                fillOpacity='0.4'
                fill='url(#paint0_linear_7821_79167)'
                transform='matrix(-0.865206 0.501417 0.498585 0.866841 196.084 0)'
              />
              <rect
                rx='25.1443'
                width='50.2886'
                height='143.953'
                fill={theme.palette.primary.main}
                transform='matrix(0.865206 0.501417 -0.498585 0.866841 173.147 0)'
              />
              <rect
                rx='25.1443'
                width='50.2886'
                height='143.953'
                fill={theme.palette.primary.main}
                transform='matrix(-0.865206 0.501417 0.498585 0.866841 94.1973 0)'
              />
              <rect
                rx='25.1443'
                width='50.2886'
                height='143.953'
                fillOpacity='0.4'
                fill='url(#paint1_linear_7821_79167)'
                transform='matrix(-0.865206 0.501417 0.498585 0.866841 94.1973 0)'
              />
              <rect
                rx='25.1443'
                width='50.2886'
                height='143.953'
                fill={theme.palette.primary.main}
                transform='matrix(0.865206 0.501417 -0.498585 0.866841 71.7728 0)'
              />
              <defs>
                <linearGradient
                  y1='0'
                  x1='25.1443'
                  x2='25.1443'
                  y2='143.953'
                  id='paint0_linear_7821_79167'
                  gradientUnits='userSpaceOnUse'
                >
                  <stop />
                  <stop offset='1' stopOpacity='0' />
                </linearGradient>
                <linearGradient
                  y1='0'
                  x1='25.1443'
                  x2='25.1443'
                  y2='143.953'
                  id='paint1_linear_7821_79167'
                  gradientUnits='userSpaceOnUse'
                >
                  <stop />
                  <stop offset='1' stopOpacity='0' />
                </linearGradient>
              </defs>
            </svg>
            <Typography variant='h6' sx={{ ml: 2, lineHeight: 1, fontWeight: 700, fontSize: '1.5rem !important' }}>
              {themeConfig.templateName}
            </Typography>
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h6' sx={{ mb: 1.5, letterSpacing: '0.18px', fontWeight: 600 }}>
              Registreer en stel gepersonaliseerde alerts in
            </Typography>
            <Typography variant='body2'>Wees als eerste op de hoogte van prijsdalingen en kortingen!</Typography>
          </Box>
          <form noValidate autoComplete='off' onSubmit={(e) => {e.preventDefault(); onFormDataSubmit()}}>
            <TextField
              fullWidth
              type="email"
              required
              label="Email"
              value={values.email}
              onChange={handleChange("email")}
              error={Boolean(errors.email)}
              helperText={errors.email}
              sx={{ mb: 4 }}
              inputRef={emailRef}
            />

            <FormControl fullWidth>
              <InputLabel htmlFor='auth-register-password'>Password</InputLabel>
              <OutlinedInput
    label='Password'
    value={values.password}
    id='auth-register-password'
    required
    onChange={handleChange('password')}
    type={values.showPassword ? 'text' : 'password'}
    error={Boolean(errors.password)}
    helperText={errors.password}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      aria-label='toggle password visibility'
                    >
                      <CustomIcon icon={values.showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} fontSize={20} />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
              <FormControl fullWidth sx={{ mt: 4 }}>
  <InputLabel htmlFor="auth-register-confirmPassword">Confirm password</InputLabel>
  <OutlinedInput
    label="Confirm password"
    required
    value={values.confirmPassword}
    id="auth-register-confirmPassword"
    onChange={handleChange("confirmPassword")}
    type={values.showPassword ? "text" : "password"}
    error={Boolean(errors.confirmPassword)}
  />
  <FormHelperText error={Boolean(errors.confirmPassword)}>{errors.confirmPassword}</FormHelperText>
</FormControl>
            <FormControlLabel
  control={<Checkbox />}
  label={
    <Fragment>
      <span>Ik ga akkoord met de </span>
      <Typography
        href='/'
        variant='body2'
        component={Link}
        sx={{ color: 'primary.main', textDecoration: 'none' }}
      >
        privacy policy & voorwaarden
      </Typography>
    </Fragment>
  }
  onChange={handleChange("agreedTerms")}
  error={Boolean(privacyError)}
  helperText={privacyError}
/>

            <Button 
            fullWidth 
            size='large' 
            type='submit' 
            variant='contained'
            onClick={onFormDataSubmit}
             sx={{ mb: 7 }}>
              Registreer
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography sx={{ mr: 2, color: 'text.secondary' }}>Heb je al een account?</Typography>
              <Typography
                component={Link}
                href='/login'
                sx={{ color: 'primary.main', textDecoration: 'none' }}
              >
                Inloggen
              </Typography>
            </Box>
            <Divider
              sx={{
                '& .MuiDivider-wrapper': { px: 4 },
                mt: theme => `${theme.spacing(5)} !important`,
                mb: theme => `${theme.spacing(7.5)} !important`
              }}
            >
              of
            </Divider>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconButton href='/' component={Link} sx={{ color: '#497ce2' }} onClick={e => e.preventDefault()}>
                <CustomIcon icon='mdi:facebook' />
              </IconButton>
              <IconButton href='/' component={Link} sx={{ color: '#db4437' }} onClick={e => e.preventDefault()}>
                <CustomIcon icon='mdi:google' />
              </IconButton>
            </Box>
          </form>
        </CardContent>
      </Card>
      <Dialog open={open} onClose={handleClose}>
  <DialogTitle>Verifieer je emailadres</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Een link om je account te activeren is verstuurd naar:
      <strong> {userEmail || ''}</strong><br/> Klik op de link om door te gaan.
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose} variant="contained">
      OVERSLAAN
    </Button>
  </DialogActions>
</Dialog>
    </Box>
    </div>
  )
}
// RegisterV1.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default RegisterV1

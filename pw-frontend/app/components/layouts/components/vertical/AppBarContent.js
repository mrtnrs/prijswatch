// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import CustomIcon from '@/vercelFix/Icon'

// ** Components
import Autocomplete from '@/components/layouts/components/Autocomplete.js'
import ModeToggler from '@/core/layouts/components/shared-components/ModeToggler'
import UserDropdown from '@/core/layouts/components/shared-components/UserDropdown'
import LanguageDropdown from '@/core/layouts/components/shared-components/LanguageDropdown'
import NotificationDropdown from '@/core/layouts/components/shared-components/NotificationDropdown'
import ShortcutsDropdown from '@/core/layouts/components/shared-components/ShortcutsDropdown'
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAuth } from '@/context/AuthContext';

import { styled, useTheme } from '@mui/material/styles'
import Link from 'next/link';
import Typography from '@mui/material/Typography';

const notifications = [
  {
    meta: 'Today',
    avatarAlt: 'Flora',
    title: 'Get price alerts 🔔',
    avatarImg: '/images/avatars/4.png',
    subtitle: 'Register to set up'
  }
]

const StyledLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
}))

const AppBarContent = props => {
  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const { currentUser } = useAuth();

  if (!isMobile) {
    return null;
  }

  const isAdmin = currentUser && currentUser.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        {hidden && !settings.navHidden ? (
          <IconButton color='inherit' sx={{ ml: -2.75 }} onClick={toggleNavVisibility}>
            <CustomIcon icon='mdi:menu' />
          </IconButton>
        ) : null}
        <Autocomplete hidden={hidden} settings={settings} />
      </Box>
              <StyledLink href='/'>
          <Typography variant="logoStyle" sx={{ textAlign: { lg: 'left' } }}>prijswatch</Typography>
        </StyledLink>
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
        {/* <LanguageDropdown settings={settings} saveSettings={saveSettings} /> */}
        <ModeToggler settings={settings} saveSettings={saveSettings} />
      {isAdmin && <NotificationDropdown settings={settings} notifications={notifications} />}
      {isAdmin && <UserDropdown settings={settings} />}
      </Box>
    </Box>
  )
}

export default AppBarContent


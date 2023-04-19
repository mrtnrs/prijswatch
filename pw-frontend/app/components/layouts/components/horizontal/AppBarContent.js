// ** MUI Imports
import Box from '@mui/material/Box'

// ** Components
import Autocomplete from '../Autocomplete'
import ModeToggler from '@/core/layouts/components/shared-components/ModeToggler'
import UserDropdown from '@/core/layouts/components/shared-components/UserDropdown'
import LanguageDropdown from '@/core/layouts/components/shared-components/LanguageDropdown'
import NotificationDropdown from '@/core/layouts/components/shared-components/NotificationDropdown'
import ShortcutsDropdown from '@/core/layouts/components/shared-components/ShortcutsDropdown'
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAuth } from '@/context/AuthContext';

const notifications = [
  {
    meta: 'Today',
    avatarAlt: 'Flora',
    title: 'Congratulation Flora! 🎉',
    avatarImg: '/images/avatars/4.png',
    subtitle: 'Won the monthly best seller badge'
  }
]


const AppBarContent = props => {
  // ** Props
  const { hidden, settings, saveSettings } = props
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  const { currentUser } = useAuth();

  if (isMobile) {
    return null;
  }

  const isAdmin = currentUser && currentUser.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;


  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Autocomplete hidden={hidden} settings={settings} />
      {/* <LanguageDropdown settings={settings} saveSettings={saveSettings} /> */}
      <ModeToggler settings={settings} saveSettings={saveSettings} />
      {isAdmin && <NotificationDropdown settings={settings} notifications={notifications} />}
      {isAdmin && <UserDropdown settings={settings} />}
    </Box>
  )
}

export default AppBarContent

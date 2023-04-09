// ** MUI Imports
import Box from '@mui/material/Box'

// ** Components
import Autocomplete from '../Autocomplete'
import ModeToggler from '@/core/layouts/components/shared-components/ModeToggler'
import UserDropdown from '@/core/layouts/components/shared-components/UserDropdown'
import LanguageDropdown from '@/core/layouts/components/shared-components/LanguageDropdown'
import NotificationDropdown from '@/core/layouts/components/shared-components/NotificationDropdown'
import ShortcutsDropdown from '@/core/layouts/components/shared-components/ShortcutsDropdown'

const notifications = [
  {
    meta: 'Today',
    avatarAlt: 'Flora',
    title: 'Congratulation Flora! 🎉',
    avatarImg: '/images/avatars/4.png',
    subtitle: 'Won the monthly best seller badge'
  },
  {
    meta: 'Yesterday',
    avatarColor: 'primary',
    subtitle: '5 hours ago',
    avatarText: 'Robert Austin',
    title: 'New user registered.'
  },
  {
    meta: '11 Aug',
    avatarAlt: 'message',
    title: 'New message received 👋🏻',
    avatarImg: '/images/avatars/5.png',
    subtitle: 'You have 10 unread messages'
  },
  {
    meta: '25 May',
    title: 'Paypal',
    avatarAlt: 'paypal',
    subtitle: 'Received Payment',
    avatarImg: '/images/misc/paypal.png'
  },
  {
    meta: '19 Mar',
    avatarAlt: 'order',
    title: 'Received Order 📦',
    avatarImg: '/images/avatars/3.png',
    subtitle: 'New order received from John'
  },
  {
    meta: '27 Dec',
    avatarAlt: 'chart',
    subtitle: '25 hrs ago',
    avatarImg: '/images/misc/chart.png',
    title: 'Finance report has been generated'
  }
]


const AppBarContent = props => {
  // ** Props
  const { hidden, settings, saveSettings } = props

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Autocomplete hidden={hidden} settings={settings} />
      {/* <LanguageDropdown settings={settings} saveSettings={saveSettings} /> */}
      <ModeToggler settings={settings} saveSettings={saveSettings} />
      <NotificationDropdown settings={settings} notifications={notifications} />
      <UserDropdown settings={settings} />
    </Box>
  )
}

export default AppBarContent

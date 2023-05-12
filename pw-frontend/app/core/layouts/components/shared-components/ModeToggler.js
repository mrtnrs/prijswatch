import { useContext } from 'react';
import SettingsContext from '@/vercelFix/context/SettingsContext';

// ** MUI Imports
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import CustomIcon from '@/vercelFix/Icon'

const ModeToggler = () => {
  // ** Access context
  const { settings, saveSettings } = useContext(SettingsContext);

  const handleModeChange = mode => {
    saveSettings({ ...settings, mode: mode })
  }

  const handleModeToggle = () => {
    if (settings.mode === 'light') {
      handleModeChange('dark')
    } else {
      handleModeChange('light')
    }
  }

  return (
    <IconButton color='inherit' aria-haspopup='true' onClick={handleModeToggle}>
      <CustomIcon icon={settings.mode === 'dark' ? 'mdi:weather-sunny' : 'mdi:weather-night'} />
    </IconButton>
  )
}

export default ModeToggler

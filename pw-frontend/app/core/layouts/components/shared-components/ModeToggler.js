// ** MUI Imports
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import CustomIcon from '@/vercelFix/Icon'

const ModeToggler = props => {
  // ** Props
  const { settings, saveSettings } = props

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

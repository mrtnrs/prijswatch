// ** Icon Imports
import CustomIcon from '@/vercelFix/Icon'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

// ** Custom Components Imports
import OptionsMenu from '@/components/option-menu'

const LanguageDropdown = ({ settings, saveSettings }) => {
  // ** Hook
  const { i18n } = useTranslation()

  // ** Vars
  const { layout } = settings

  const handleLangItemClick = lang => {
   // i18n.changeLanguage(lang)
  }

  return (
    <OptionsMenu
      icon={<CustomIcon icon='mdi:translate' />}
      menuProps={{ sx: { '& .MuiMenu-paper': { mt: 4, minWidth: 130 } } }}
      iconButtonProps={{ color: 'inherit', sx: { ...(layout === 'vertical' ? { mr: 0.75 } : { mx: 0.75 }) } }}
      options={[
        {
          text: 'English',
          menuItemProps: {
            sx: { py: 2 },
            selected: i18n.language === 'en',
            onClick: () => {
              handleLangItemClick('en')
              saveSettings({ ...settings, direction: 'ltr' })
            }
          }
        },
        {
          text: 'French',
          menuItemProps: {
            sx: { py: 2 },
            selected: i18n.language === 'fr',
            onClick: () => {
              handleLangItemClick('fr')
              saveSettings({ ...settings, direction: 'ltr' })
            }
          }
        }
      ]}
    />
  )
}

export default LanguageDropdown

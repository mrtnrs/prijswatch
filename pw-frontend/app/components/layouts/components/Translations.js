// ** Third Party Import
//import { useTranslation } from 'react-i18next'

const Translations = ({ text }) => {
  // ** Hook
 // const { t } = useTranslation()
  const { t } = text;

 // return <>{`${t(text)}`}</>
  return text

}

export default Translations

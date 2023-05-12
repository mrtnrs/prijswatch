'use client'
// ** React Imports
import { createContext, useState, useEffect } from 'react'
import  {categoryStructure} from '@/utils/categoryStructure';


// ** ThemeConfig Import
import themeConfig from '@/core/configs/themeConfig'

const initialSettings = {
  themeColor: 'primary',
  mode: themeConfig.mode,
  skin: themeConfig.skin,
  footer: themeConfig.footer,
  layout: themeConfig.layout,
  lastLayout: themeConfig.layout,
  direction: themeConfig.direction,
  navHidden: themeConfig.navHidden,
  appBarBlur: themeConfig.appBarBlur,
  navCollapsed: themeConfig.navCollapsed,
  contentWidth: themeConfig.contentWidth,
  toastPosition: themeConfig.toastPosition,
  verticalNavToggleType: themeConfig.verticalNavToggleType,
  appBar: themeConfig.layout === 'horizontal' && themeConfig.appBar === 'hidden' ? 'fixed' : themeConfig.appBar
}

const staticSettings = {
  appBar: initialSettings.appBar,
  footer: initialSettings.footer,
  layout: initialSettings.layout,
  navHidden: initialSettings.navHidden,
  lastLayout: initialSettings.lastLayout,
  toastPosition: initialSettings.toastPosition
}

const restoreSettings = () => {
  let settings = null
  try {
    const storedData = window.localStorage.getItem('settings')
    if (storedData) {
      settings = { ...initialSettings, ...JSON.parse(storedData) }
    } else {
      settings = initialSettings
    }
  } catch (err) {
    console.error(err)
  }

  return settings
}


// set settings in localStorage
const storeSettings = settings => {
  const initSettings = Object.assign({}, settings)
  delete initSettings.appBar
  delete initSettings.footer
  delete initSettings.layout
  delete initSettings.navHidden
  delete initSettings.lastLayout
  delete initSettings.toastPosition
  window.localStorage.setItem('settings', JSON.stringify(initSettings))
}

// ** Create Context
const SettingsContext = createContext({
  saveSettings: () => null,
  settings: initialSettings
});

export default SettingsContext;

export const SettingsProvider = ({ children, pageSettings }) => {
  // ** State
  const [settings, setSettings] = useState(restoreSettings());
  const [categoryStructureFinn, setCategoryStructureFinn] = useState([]);

  console.log('categoryStructure', categoryStructure);

  useEffect(() => {
  fetchCategoryTree();
}, [categoryStructure]);


    useEffect(() => {
    const restoredSettings = restoreSettings();
    if (restoredSettings) {
      setSettings({ ...restoredSettings });
    }
  }, []);

  useEffect(() => {
    if (settings.layout === 'horizontal' && settings.mode === 'semi-dark') {
      saveSettings({ ...settings, mode: 'light' })
    }
    if (settings.layout === 'horizontal' && settings.appBar === 'hidden') {
      saveSettings({ ...settings, appBar: 'fixed' })
    }
  }, [settings.layout])

const fetchCategoryTree = async () => {
  console.log('useEffect page');
  console.log('Category structure initialized 1');
  console.log(typeof categoryStructure);
  const werkPls = await categoryStructure.init();
  console.log('werkPls', werkPls);
  setCategoryStructureFinn(categoryStructure.tree);
  console.log('Category structure initialized');
};



  const saveSettings = updatedSettings => {
    storeSettings(updatedSettings)
    setSettings(updatedSettings)
  }

  return <SettingsContext.Provider value={{ settings, saveSettings, categoryStructureFinn }}>{children}</SettingsContext.Provider>
}

export const SettingsConsumer = SettingsContext.Consumer

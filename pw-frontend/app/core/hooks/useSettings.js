import { useContext } from 'react'
import  SettingsContext from '@/core/context/settingsContext'

export const useCategoryStructure = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useCategoryStructure must be used within a SettingsProvider');
  }
  return context.categoryStructure;
};

export const useSettings = () => useContext(SettingsContext)

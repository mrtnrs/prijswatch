'use client'
// ** React Import
import { useEffect, useRef } from 'react'
import { useMediaQuery } from '@mui/material';

// ** Layout Components
import VerticalLayout from './VerticalLayout'
import HorizontalLayout from './HorizontalLayout'

const Layout = props => {
  // ** Props
  const { hidden, children, settings, saveSettings } = props
  const isLargeScreen = useMediaQuery((theme) => theme.breakpoints.up('lg'));

useEffect(() => {
    if (!isLargeScreen) {
      saveSettings({ ...settings, layout: 'vertical' });
    } else {
      saveSettings({ ...settings, layout: settings.lastLayout });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLargeScreen]);

  if (isLargeScreen && settings.layout === 'horizontal') {
    return <HorizontalLayout {...props}>{children}</HorizontalLayout>;
  }

  return <VerticalLayout {...props}>{children}</VerticalLayout>;
};

export default Layout

// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Fab from '@mui/material/Fab'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

// ** Icon Imports
import CustomIcon from '@/vercelFix/Icon'

// ** Theme Config Import
import themeConfig from '@/core/configs/themeConfig'

// ** Components
import AppBar from './components/vertical/appBar'
import Customizer from '@/core/customizer'
import Navigation from './components/vertical/navigation'
import Footer from './components/shared-components/footer'
import ScrollToTop from '@/core/scroll-to-top'

const VerticalLayoutWrapper = styled('div')({
  height: '100%',
  display: 'flex'
})

const MainContentWrapper = styled(Box)({
  flexGrow: 1,
  minWidth: 0,
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column'
})

const ContentWrapper = styled('main')(({ theme }) => ({
  flexGrow: 1,
  width: '100%',
  padding: theme.spacing(6),
  transition: 'padding .25s ease-in-out',
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4)
  }
}))

const VerticalLayout = props => {
  // ** Props
  const { hidden, settings, children, scrollToTop, footerProps, contentHeightFixed, verticalLayoutProps } = props
  const [loaded, setLoaded] = useState(false);

  // ** Vars
  const { skin, navHidden, contentWidth } = settings
  const { navigationSize, disableCustomizer, collapsedNavigationSize } = themeConfig
  const navWidth = navigationSize
  const navigationBorderWidth = skin === 'bordered' ? 1 : 0
  const collapsedNavWidth = collapsedNavigationSize

  // ** States
  const [navVisible, setNavVisible] = useState(false)

  // ** Toggle Functions
  const toggleNavVisibility = () => setNavVisible(!navVisible)

  useEffect(() => {
  setLoaded(true);
}, []);

  return (
    <>
    <VerticalLayoutWrapper className="layout-wrapper">
      {navHidden && !(navHidden && settings.lastLayout === "horizontal") ? null : loaded && (
        <Navigation
          navWidth={navWidth}
          navVisible={navVisible}
          setNavVisible={setNavVisible}
          collapsedNavWidth={collapsedNavWidth}
          toggleNavVisibility={toggleNavVisibility}
          navigationBorderWidth={navigationBorderWidth}
          navMenuContent={verticalLayoutProps?.navMenu?.content || null}
          navMenuBranding={verticalLayoutProps?.navMenu?.branding || null}
          menuLockedIcon={verticalLayoutProps?.navMenu?.lockedIcon || null}
          verticalNavItems={verticalLayoutProps?.navMenu?.navItems || []}
          navMenuProps={verticalLayoutProps?.navMenu?.componentProps || {}}
          menuUnlockedIcon={verticalLayoutProps?.navMenu?.unlockedIcon || null}
          afterNavMenuContent={verticalLayoutProps?.navMenu?.afterContent || null}
          beforeNavMenuContent={verticalLayoutProps?.navMenu?.beforeContent || null}
          hidden={hidden}
          style={{
            width: hidden ? '0px' : navVisible ? `${navWidth}px` : `${collapsedNavWidth}px`,
            minWidth: hidden ? '0px' : navVisible ? `${navWidth}px` : `${collapsedNavWidth}px`,
            display: "none",
          }}
          {...props}
        />
      )}
        <MainContentWrapper
          className='layout-content-wrapper'
          sx={{ ...(contentHeightFixed && { maxHeight: '100vh' }) }}
        >
          <AppBar
            toggleNavVisibility={toggleNavVisibility}
            appBarContent={verticalLayoutProps?.appBar?.content}
            appBarProps={verticalLayoutProps?.appBar?.componentProps}
            {...props}
          />

          <ContentWrapper
            className='layout-page-content'
            sx={{
              ...(contentHeightFixed && {
                overflow: 'hidden',
                '& > :first-of-type': { height: '100%' }
              }),
              ...(contentWidth === 'boxed' && {
                mx: 'auto',
                '@media (min-width:1440px)': { maxWidth: 1440 },
                '@media (min-width:1200px)': { maxWidth: '100%' }
              })
            }}
          >
            {children}
          </ContentWrapper>

          <Footer footerStyles={footerProps?.sx} footerContent={footerProps?.content} {...props} />
        </MainContentWrapper>
      </VerticalLayoutWrapper>

      {scrollToTop ? (
        scrollToTop(props)
      ) : (
        <ScrollToTop className='mui-fixed'>
          <Fab color='primary' size='small' aria-label='scroll back to top'>
            <CustomIcon icon='mdi:arrow-up' />
          </Fab>
        </ScrollToTop>
      )}
    </>
  )
}

export default VerticalLayout

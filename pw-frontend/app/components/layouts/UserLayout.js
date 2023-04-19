import { useMemo } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import Layout from '@/core/layouts/Layout';
import VerticalNavItems from '@/core/navigation/vertical';
import HorizontalNavItems from '@/core/navigation/horizontal';
import HorizontalAppBarContent from './components/horizontal/AppBarContent';
import VerticalAppBarContent from './components/vertical/AppBarContent';
import { useSettings } from '@/core/hooks/useSettings';

const UserLayout = ({ children, contentHeightFixed }) => {
  const { settings, saveSettings } = useSettings();
  const hidden = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  const layoutProps = useMemo(() => {
    if (hidden) {
      return {
        verticalLayoutProps: {
          navMenu: {
            navItems: VerticalNavItems(),
          },
          appBar: {
            content: (props) => (
              <VerticalAppBarContent
                hidden={hidden}
                settings={settings}
                saveSettings={saveSettings}
                toggleNavVisibility={props.toggleNavVisibility}
              />
            ),
          },
        },
      };
    } else {
      return {
        horizontalLayoutProps: {
          navMenu: {
            navItems: HorizontalNavItems(),
          },
          appBar: {
            content: () => (
              <HorizontalAppBarContent
                hidden={hidden}
                settings={settings}
                saveSettings={saveSettings}
              />
            ),
          },
        },
      };
    }
  }, [hidden, saveSettings, settings]);

  if (hidden && settings.layout === 'horizontal') {
    settings.layout = 'vertical';
  }

  return (
    <Layout
      hidden={hidden}
      settings={settings}
      saveSettings={saveSettings}
      contentHeightFixed={contentHeightFixed}
      {...layoutProps}
    >
      {children}
    </Layout>
  );
};

export default UserLayout;

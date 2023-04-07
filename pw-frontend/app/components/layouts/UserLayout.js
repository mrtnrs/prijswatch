// Importing the necessary hooks and components
import useMediaQuery from '@mui/material/useMediaQuery';
import Layout from '@/core/layouts/Layout';
import VerticalNavItems from '@/core/navigation/vertical';
import HorizontalNavItems from '@/core/navigation/horizontal';
import ServerSideHorizontalNavItems from './components/horizontal/ServerSideNavItems';
import HorizontalAppBarContent from './components/horizontal/AppBarContent';
import VerticalAppBarContent from './components/vertical/AppBarContent';
import { useSettings } from '@/core/hooks/useSettings';

const UserLayout = ({ children, contentHeightFixed }) => {
  // Using the useSettings hook to access and modify the current settings
  const { settings, saveSettings } = useSettings();

  // The 'hidden' variable will be true if the screen size is below 'lg' breakpoint
  const hidden = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  // If the screen size is below 'lg' and the layout is horizontal, switch to vertical layout
  if (hidden && settings.layout === 'horizontal') {
    settings.layout = 'vertical';
  }

  // Rendering the Layout component with horizontal layout props
  if (settings.layout === 'horizontal') {
    return (
      <Layout
        hidden={hidden}
        settings={settings}
        saveSettings={saveSettings}
        contentHeightFixed={contentHeightFixed}
        {...(settings.layout === 'horizontal' && {
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
        })}
      >
        {children}
      </Layout>
    );
  } else {
    // Rendering the Layout component with vertical layout props
    return (
      <Layout
        hidden={hidden}
        settings={settings}
        saveSettings={saveSettings}
        contentHeightFixed={contentHeightFixed}
        verticalLayoutProps={{
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
        }}
      >
        {children}
      </Layout>
    );
  }
};

export default UserLayout;

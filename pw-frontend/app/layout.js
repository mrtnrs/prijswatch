'use client'
import './styles/globals.css'
import UserLayout from '@/components/layouts/UserLayout'

import { SettingsConsumer, SettingsProvider } from '@/vercelFix/context/SettingsContext'
import { AuthProvider } from '@/context/AuthContext'
import ThemeComponent from '@/core/theme/ThemeComponent'

import '@/core/configs/i18n'
import { Toaster } from 'react-hot-toast'
import ReactHotToast from '@/core/react-hot-toast'
import { GoogleAnalytics } from "nextjs-google-analytics";
import { categoryStructure } from '@/utils/categoryStructure';

import { MetaProvider } from '@/context/MetaContext';
import MetaWrapper from '@/context/MetaWrapper';

export default function RootLayout({ Component, pageProps, children, session }) {

  return (
    <AuthProvider>
      <SettingsProvider>
      <MetaProvider>
            <SettingsConsumer>
              {({ settings }) => {
                return (
                  <ThemeComponent settings={settings}>
                  <html>
                  <meta property="og:locale" content="nl_BE" />
                  <meta name="robots" content="index,follow" />
                  <MetaWrapper />
                  <body>
                  <GoogleAnalytics trackPageViews />
                    <UserLayout>{children}</UserLayout>
                    <ReactHotToast>
                      <Toaster position={settings.toastPosition} toastOptions={{ className: 'react-hot-toast' }} />
                    </ReactHotToast>
                  </body>
                  </html>
                  </ThemeComponent>
                )
              }}
          </SettingsConsumer>
          </MetaProvider>
      </SettingsProvider>
    </AuthProvider>
  )
}
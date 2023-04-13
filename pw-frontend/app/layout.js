'use client'
import './styles/globals.css'
// import Navigation from './components/Navigation';
import Footer from './components/Footer';
// import "./api/auth/[...nextauth]";
import UserLayout from '@/components/layouts/UserLayout'

import { SettingsConsumer, SettingsProvider } from '@/core/context/SettingsContext'
import { AuthProvider } from '@/context/AuthContext'
import ThemeComponent from '@/core/theme/ThemeComponent'

import '@/core/configs/i18n'
import { Toaster } from 'react-hot-toast'
import ReactHotToast from '@/core/react-hot-toast'
import { GoogleAnalytics } from "nextjs-google-analytics";

import { categoryStructure } from '@/utils/categoryStructure';

// export const metadata = {
//   title: 'Create Next App',
//   description: 'Generated by create next app',
// }


export default function RootLayout({ Component, pageProps, children, session }) {

  return (
    <AuthProvider>
      <SettingsProvider>
            <SettingsConsumer>
              {({ settings }) => {
                return (
                  <ThemeComponent settings={settings}>
                  <html>

                  <body>
                  <GoogleAnalytics trackPageViews />
                    <UserLayout>{children}</UserLayout>
                    <Footer />
                    <ReactHotToast>
                      <Toaster position={settings.toastPosition} toastOptions={{ className: 'react-hot-toast' }} />
                    </ReactHotToast>
                  </body>
                  </html>
                  </ThemeComponent>
                )
              }}
          </SettingsConsumer>
      </SettingsProvider>
    </AuthProvider>
  )
}
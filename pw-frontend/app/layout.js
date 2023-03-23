'use client'
import './styles/globals.css'
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import { SessionProvider } from "next-auth/react"
import "./api/auth/[...nextauth]";


// export const metadata = {
//   title: 'Create Next App',
//   description: 'Generated by create next app',
// }

export default function RootLayout({ children, session }) {
  return (
<html lang="en">
      <SessionProvider session={session}>
        <body>
        <Navigation />
        <div className="container mx-auto px-4">{children}</div>
        <Footer />
        </body>
      </SessionProvider>
    </html>
  )
}

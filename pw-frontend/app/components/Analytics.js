// Analytics.tsx
"use client"
import { usePathname, useSearchParams } from "next/navigation"
import Script from "next/script"

export default function Analytics() {
  const GA_TRACKING_ID = process.env.GA_MEASUREMENT_ID;
  const pathname = usePathname()

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}');
        `}
      </Script>
    </>
  )
}
/* app/layout.jsx -------------------------------------------------- */
import './globals.scss';

import Providers         from '@/components/provider';
import GoogleAnalytics   from '@/components/analytics/GoogleAnalytics';
import MicrosoftClarity  from '@/components/analytics/MicrosoftClarity';

/* Global tags Next.js can manage */
export const metadata = {
  title:       'AGE Fabrics',
  description: 'Wholesale fabric dealer – premium woven, knit & denim',
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  openGraph: {
    type:        'website',
    url:         process.env.NEXT_PUBLIC_SITE_URL,
    title:       'AGE Fabrics',
    description: 'Wholesale fabric dealer – premium woven, knit & denim',
    locale:      'en_US',
    siteName:    'AGE Fabrics',
  },
  icons: {
    icon:  '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* ① Inline critical Font-Awesome reset */}
      <style>{`
        .fa { font-family: var(--fa-style-family,'Font Awesome 6 Pro'); font-weight:var(--fa-style,900);}
        .fa, .fa-brands, .fa-light, .fa-regular, .fa-solid, .fa-thin,
        .fab, .fad, .fal, .far, .fas, .fat {
          -moz-osx-font-smoothing: grayscale;
          -webkit-font-smoothing: antialiased;
          display: var(--fa-display, inline-block);
          font-style: normal;
          font-variant: normal;
          line-height: 1;
          text-rendering: auto;
        }
      `}</style>

      {/* ② Preload CSS & fonts */}
      <link rel="stylesheet" href="/assets/css/font-awesome-pro.css" />
      <link rel="preload" href="/assets/fonts/fa-regular-400.woff2"  as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="preload" href="/assets/fonts/fa-brands-400.woff2"   as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="preload" href="/assets/fonts/fa-solid-900.woff2"    as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="preload" href="/assets/fonts/fa-light-300.woff2"    as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="preload" href="/assets/fonts/Jost/Jost-VariableFont_wght.ttf"
                            as="font" type="font/ttf"  crossOrigin="anonymous" />
      <link rel="preload" href="/assets/fonts/Jost/Jost-Italic-VariableFont_wght.ttf"
                            as="font" type="font/ttf"  crossOrigin="anonymous" />

      {/* ③ Analytics scripts (client-side) */}
      <GoogleAnalytics />
      <MicrosoftClarity />

      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

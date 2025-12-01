import './globals.css';
import Header from '../components/Header';
import CookieConsent from '../components/CookieConsent';
import Script from 'next/script';

export const metadata = {
  title: 'The Christmas Build-Up',
  description:
    'An interactive Advent experience from Faith in Kids with daily readings, videos, and a digital stickerbook.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/img/Icon-32.png" />
        <link rel="stylesheet" href="/css/bs.css" />
        <link rel="stylesheet" href="/css/index.css" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HF5BTW2KP6"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', { analytics_storage: 'denied' });
            gtag('js', new Date());
            gtag('config', 'G-HF5BTW2KP6');
          `}
        </Script>
      </head>
      <body className="advent-body">
        <div className="min-h-screen flex flex-col">
          <Header />
          <main id="content" className="flex-1 w-full">
            {children}
          </main>
          <CookieConsent />
        </div>
      </body>
    </html>
  );
}

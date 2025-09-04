import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WiFi Sniffer Pro - Android Network & Human Detection',
  description: 'Advanced Android-style WiFi network scanner and human detection tool',
  keywords: 'wifi scanner, network analyzer, human detection, android, security tools',
  authors: [{ name: 'WiFi Sniffer Pro' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  themeColor: '#22c55e',
  manifest: '/manifest.json'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#22c55e" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} antialiased bg-gray-950 text-white min-h-screen overflow-x-hidden`}>
        <div id="root" className="relative min-h-screen">
          {children}
        </div>
        
        {/* PWA Service Worker */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
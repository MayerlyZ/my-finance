import type { Metadata, Viewport } from 'next';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import BottomNav from '@/components/BottomNav';
import ClientWrapper from '@/components/ClientWrapper';
import { ToastContainer } from 'react-toastify';

export const metadata: Metadata = {
  title: 'Mi Organizador Financiero',
  description: 'Registra, analiza y controla tus finanzas personales',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#eef2ff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ClientWrapper>
          <div className="app-container">
            {children}
            <BottomNav />
          </div>
        </ClientWrapper>
        <ToastContainer
          position="top-center"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover={false}
          theme="colored"
          style={{ top: '16px', fontSize: '14px' }}
        />
      </body>
    </html>
  );
}

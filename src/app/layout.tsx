import type { Metadata } from "next";
import { ReactQueryProvider } from './ReactQueryProvider';
import montserrat from '@/fonts/montserrat';
import NavBar from '@/components/modules/NavBar/NavBar';
import "./globals.css";

export const metadata: Metadata = {
  title: "Dev Reed Steck",
  description: "Welcome to My Portfolio & Site",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryProvider>
      <html lang="en">
        <head>
          <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        </head>
        <body className={montserrat.className} style={{ minHeight: '100vh' }} >
          <NavBar />

          {children}
        </body>
      </html>
    </ReactQueryProvider>
  );
}

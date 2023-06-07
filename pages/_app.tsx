import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from 'next-themes';
import { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import { DefaultLayout } from '../components/templates/Layout';
import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import Script from 'next/script';

function MyApp({ Component, pageProps }: AppProps<{ session: Session }>) {
  return (
    <SessionProvider session={pageProps.session}>
      <ThemeProvider
        attribute="class"
        enableSystem={true}
        defaultTheme="system"
      >
        <Script src="https://example.com/script.js" />
        <DefaultLayout>
          <Component {...pageProps} />
        </DefaultLayout>
        <Toaster position="bottom-center" />
      </ThemeProvider>
      <Analytics />
    </SessionProvider>
  );
}

export default MyApp;

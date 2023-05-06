import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from 'next-themes';
import { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import { DefaultLayout } from '../components/templates/DefaultLayout';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider
        attribute="class"
        enableSystem={true}
        defaultTheme="system"
      >
        <DefaultLayout>
          <Component {...pageProps} />
        </DefaultLayout>
        <Toaster position="bottom-center" />
      </ThemeProvider>
      <Analytics />
    </>
  );
}

export default MyApp;

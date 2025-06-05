import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from 'next-themes';
import { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import { DefaultLayout } from '../components/templates/Layout';
import '../styles/globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import Script from 'next/script';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider publishableKey={process.env.CLERK_PUBLISHABLE_KEY}>
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
    </ClerkProvider>
  );
}

export default MyApp;

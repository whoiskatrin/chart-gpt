import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from 'next-themes';
import { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import { DefaultLayout } from '../components/templates/Layout';
import '../styles/globals.css';
import { createClient } from '@supabase/supabase-js';
import { SessionProvider } from 'next-auth/react';

const supabaseUrl = process.env.SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
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
    </SessionProvider>
  );
}

export default MyApp;

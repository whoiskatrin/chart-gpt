import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Script from 'next/script';
import useSWR from 'swr';

export default function Pricing() {
  const { data: session } = useSession();

  const fetcher = (url: string) => fetch(url).then(res => res.json());
  const { data } = useSWR('/api/remaining', fetcher);

  return (
    <div className="flex mx-auto max-w-7xl overflow-visible flex-col items-center justify-center">
      <Head>
        <title>Buy ChartGPT Credits</title>
      </Head>
      <Script src="https://js.stripe.com/v3/pricing-table.js" />
      <Script src="https://cdn.paritydeals.com/banner.js" />
      <Script async src="https://js.stripe.com/v3/buy-button.js" />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4">
        <h1 className="mx-auto max-w-4xl text-center mt-2 text-4xl font-bold tracking-tight text-black dark:text-white sm:text-5xl">
          Buy ChartGPT Credits
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-black dark:text-white mb-10">
          You currently have{' '}
          <span className="font-semibold text-black dark:text-white">
            {data?.remainingGenerations}{' '}
            {data?.remainingGenerations > 1 || data?.remainingGenerations === 0
              ? 'credits'
              : 'credit'}
          </span>
          . Purchase more below.
        </p>
      </main>
      <div className="w-full bg-white dark:bg-black border-1 border-black">
        {session && ( // TODO: very unfortunate styling here, fix maybe?
          <stripe-pricing-table
            pricing-table-id="prctbl_1N4kyFKeboA3fgq8N81kqV9E"
            publishable-key="pk_live_51N4hjKKeboA3fgq8Ha08TqSvG1srWppQol3plyCk6T54RdqHRbRWqEuUUEiaf3a6fZnwdg7n8MtfRlBpH4yJPCEV00EhvjJViA"
            customer-email={session.user?.email}
          />
        )}
      </div>
    </div>
  );
}

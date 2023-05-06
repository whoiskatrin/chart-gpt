import { useUser } from '@supabase/auth-helpers-react';
import Script from 'next/script';
import Head from 'next/head';
import useSWR from 'swr';

export default function Pricing() {
  const user = useUser();

  const fetcher = (url: string) => fetch(url).then(res => res.json());
  const { data } = useSWR('/api/remaining', fetcher);

  return (
    <div className="flex mx-auto max-w-7xl overflow-visible flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Buy RoomGPT Credits</title>
      </Head>
      <Script src="https://js.stripe.com/v3/pricing-table.js" />
      <Script src="https://cdn.paritydeals.com/banner.js" />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mb-0 mb-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Buy RoomGPT Credits
            </p>
          </div>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-500 mb-10">
          You currently have{' '}
          <span className="font-semibold text-gray-400">
            {data?.remainingGenerations}{' '}
            {data?.remainingGenerations > 1 ? 'credits' : 'credit'}
          </span>
          . Purchase more below.
        </p>
      </main>
      <div className="w-full">
        {user?.email && (
          // @ts-ignore
          <stripe-pricing-table
            pricing-table-id="prctbl_1MobnNK4W9ejG97elHjeFCEq"
            publishable-key="pk_live_51HGpOvK4W9ejG97eYSm02d1hgagCOAAcKQCtH7258w6fA8wxo2PRv2xs2wSUG2xkV2YLBc0h3HxKITTFeJGtWai500o6bqGFHF"
            client-reference-id={user.email}
            customer-email={user.email}
          />
        )}
      </div>
      <script async src="https://js.stripe.com/v3/buy-button.js"></script>
      <div className="mx-auto max-w-7xl px-6 lg:px-8 bg-black">
        <div className="mx-auto max-w-4xl text-center">
          {user?.email && (
            // @ts-ignore
            // @ts-ignore
            <stripe-buy-button
              buy-button-id="buy_btn_1N4lRqKeboA3fgq8s4TSJfpG"
              publishable-key="pk_live_51N4hjKKeboA3fgq8Ha08TqSvG1srWppQol3plyCk6T54RdqHRbRWqEuUUEiaf3a6fZnwdg7n8MtfRlBpH4yJPCEV00EhvjJViA"
            />
          )}
        </div>
      </div>
    </div>
  );
}

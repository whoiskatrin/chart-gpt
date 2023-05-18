import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { Card, Icon, Metric, Subtitle, Title } from '@tremor/react';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Slider } from '../components/ui/slider';

const StripePublishableKey = 'pk_live_H2uqC2vnrj0pndUTpBzN8fNp00p8rKqkRL';

const BuyButtons = [
  {
    numberOfCredits: 20,
    'buy-button-id': 'buy_btn_1N9Bt4HyROTSbUdIU2QexjRG',
    cost: 5,
  },
  {
    numberOfCredits: 100,
    'buy-button-id': 'buy_btn_1N9BvTHyROTSbUdIRr8dK4TQ',
    cost: 20,
  },
  {
    numberOfCredits: 250,
    'buy-button-id': 'buy_btn_1N9BwRHyROTSbUdIVxG5VI64',
    cost: 35,
  },
  {
    numberOfCredits: 750,
    'buy-button-id': 'buy_btn_1N9BxFHyROTSbUdI1Ozu2umg',
    cost: 80,
  },
];

export default function Pricing() {
  const { data: session } = useSession();
  const [credits, setCredits] = useState([100]);
  const [button, setButton] = useState<JSX.Element | null>(
    <stripe-buy-button
      buy-button-id={BuyButtons[1]['buy-button-id']}
      publishable-key={StripePublishableKey}
    />
  );

  useEffect(
    () =>
      setButton(
        credits[0] <= 20 ? (
          <stripe-buy-button
            buy-button-id={BuyButtons[0]['buy-button-id']}
            publishable-key={StripePublishableKey}
          />
        ) : credits[0] <= 100 ? (
          <stripe-buy-button
            buy-button-id={BuyButtons[1]['buy-button-id']}
            publishable-key={StripePublishableKey}
          />
        ) : credits[0] <= 250 ? (
          <stripe-buy-button
            buy-button-id={BuyButtons[2]['buy-button-id']}
            publishable-key={StripePublishableKey}
          />
        ) : credits[0] <= 750 ? (
          <stripe-buy-button
            buy-button-id={BuyButtons[3]['buy-button-id']}
            publishable-key={StripePublishableKey}
          />
        ) : null
      ),
    [credits]
  );

  const fetcher = (url: string) => fetch(url).then(res => res.json());
  const { data } = useSWR('/api/remaining', fetcher);

  return (
    <div className="flex mx-auto max-w-7xl overflow-visible flex-col items-center justify-center">
      <Head>
        <title>Buy ChartGPT Credits</title>
      </Head>
      <Script src="https://cdn.paritydeals.com/banner.js" />
      <Script async src="https://js.stripe.com/v3/buy-button.js" />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4">
        <h1 className="mx-auto max-w-4xl text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
          Buy ChartGPT Credits
        </h1>
        <Title className="text-zinc-500 dark:text-zinc-400 font-normal mt-6">
          You currently have{' '}
          <span className="font-semibold text-zinc-900 dark:text-white">
            {data?.remainingGenerations}{' '}
            {data?.remainingGenerations > 1 || data?.remainingGenerations === 0
              ? 'credits'
              : 'credit'}
          </span>
          . Purchase more below.
        </Title>
      </main>

      <Title className="dark:text-zinc-200 my-6">
        How many Chart Generations do you need?
      </Title>
      <div>
        <div className="flex items-baseline space-x-2">
          <Metric className="dark:text-zinc-100">{credits} credits</Metric>
          <Subtitle className="dark:text-zinc-400">
            $
            {credits[0] <= 20
              ? BuyButtons[0]['cost']
              : credits[0] <= 100
              ? BuyButtons[1]['cost']
              : credits[0] <= 250
              ? BuyButtons[2]['cost']
              : credits[0] <= 750
              ? BuyButtons[3]['cost']
              : null}{' '}
            one time
          </Subtitle>
        </div>
        <Slider
          defaultValue={[100]}
          min={20}
          max={750}
          step={10}
          className="max-w-[288px] my-6"
          value={credits}
          onValueChange={setCredits}
        />
        {/* TODO: Handle the scenario of logged out, need to prompt to sign in */}
        {session && (
          <>
            <div className={clsx({ hidden: !(credits[0] <= 20) })}>
              <stripe-buy-button
                buy-button-id={BuyButtons[0]['buy-button-id']}
                publishable-key={StripePublishableKey}
              />
            </div>
            <div
              className={clsx({
                hidden: !(credits[0] > 20 && credits[0] <= 100),
              })}
            >
              <stripe-buy-button
                buy-button-id={BuyButtons[1]['buy-button-id']}
                publishable-key={StripePublishableKey}
              />
            </div>
            <div
              className={clsx({
                hidden: !(credits[0] > 100 && credits[0] <= 250),
              })}
            >
              <stripe-buy-button
                buy-button-id={BuyButtons[2]['buy-button-id']}
                publishable-key={StripePublishableKey}
              />
            </div>
            <div
              className={clsx({
                hidden: !(credits[0] > 250 && credits[0] <= 750),
              })}
            >
              <stripe-buy-button
                buy-button-id={BuyButtons[3]['buy-button-id']}
                publishable-key={StripePublishableKey}
              />
            </div>
          </>
        )}
      </div>

      <Card className="max-w-[400px] dark:bg-black dark:ring-zinc-800 mt-16">
        <Title className="dark:text-white">What’s included?</Title>
        <ul className="space-y-2 mt-3">
          <li>
            <Icon
              icon={CheckCircleIcon}
              variant="light"
              size="xs"
              color="emerald"
              className="mr-2 dark:bg-emerald-300/20"
            />
            <span className="text-zinc-600 dark:text-zinc-400 dark:text-zinc text-base font-normal">
              Open source interface
            </span>
          </li>
          <li>
            <Icon
              icon={CheckCircleIcon}
              variant="light"
              size="xs"
              color="emerald"
              className="mr-2 dark:bg-emerald-300/20"
            />
            <span className="text-zinc-600 dark:text-zinc-400 dark:text-zinc text-base font-normal">
              .PNG download
            </span>
          </li>
          <li>
            <Icon
              icon={CheckCircleIcon}
              variant="light"
              size="xs"
              color="emerald"
              className="mr-2 dark:bg-emerald-300/20"
            />
            <span className="text-zinc-600 dark:text-zinc-400 dark:text-zinc text-base font-normal">
              PowerPoint exports
            </span>
            <span className="ml-1 text-zinc-400 dark:text-zinc-500 text-base font-normal italic">
              (coming soon)
            </span>
          </li>
        </ul>
      </Card>
    </div>
  );
}

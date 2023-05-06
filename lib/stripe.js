import { loadStripe } from '@stripe/stripe-js';

export const getStripe = async () => {
  const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const stripe = await loadStripe(stripePublicKey);
  return stripe;
};

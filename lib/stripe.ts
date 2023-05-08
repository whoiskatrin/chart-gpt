import { loadStripe } from '@stripe/stripe-js';

export const getStripe = async () => {
  const stripePublicKey = process.env.STRIPE_SECRET_KEY ?? '';
  const stripe = await loadStripe(stripePublicKey);
  return stripe;
};

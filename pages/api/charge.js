import { supabase } from '../pages/_app';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { payment_method_id, user, creditsToBuy } = req.body;

    try {
      // Calculate the amount based on the credits the user wants to purchase
      const amount = creditsToBuy * 100; // Example: 1000 cents (10 USD)

      // Create the payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        payment_method: payment_method_id,
        confirm: true,
        capture_method: 'automatic',
      });

      // Update the user_credits table with the purchased credits
      const { data: updatedUserCredits, error } = await supabase
        .from('user_credits')
        .update({ credits: user.credits + creditsToBuy })
        .eq('user_id', user.id);

      if (error) {
        throw new Error(error.message);
      }

      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}

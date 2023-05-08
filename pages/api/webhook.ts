import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';
import { supabase } from '../../lib/supabase';
import { getUserIdByEmail, addUserCredits } from '../../utils/helper';
import { v4 as uuidv4 } from 'uuid';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET ?? '';

export const webhook = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const reqBuffer = await buffer(req);
    const payload = reqBuffer.toString();
    const signature = req.headers['stripe-signature']!;

    let event;

    // Verify if event came from stripe
    try {
      event = stripe.webhooks.constructEvent(
        payload,
        signature,
        endpointSecret
      );
    } catch (err: any) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log('✅ Success:', event.id);

    if (
      event.type === 'payment_intent.succeeded' ||
      event.type === 'checkout.session.completed'
    ) {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`💰 PaymentIntent: ${JSON.stringify(paymentIntent)}`);

      // @ts-ignore
      const userEmail = paymentIntent.customer_details.email;
      let creditAmount = 0;

      // @ts-ignore
      switch (paymentIntent.amount_subtotal) {
        case 500:
          creditAmount = 20;
          break;
        case 2000:
          creditAmount = 100;
          break;
        case 3500:
          creditAmount = 250;
          break;
        case 8000:
          creditAmount = 750;
          break;
      }

      const row_id = getUserIdByEmail(userEmail);
      // Update user_credits in users table after purchase
      addUserCredits(row_id, creditAmount);

      // Insert purchase record in Supabase
      await supabase.from('purchases').insert([
        {
          id: uuidv4(),
          user_id: row_id,
          credit_amount: creditAmount,
          created_at: paymentIntent.created,
          status: paymentIntent.status,
        },
      ]);

      await supabase
        .from('users')
        .update({ credits: { increment: creditAmount } })
        .eq('email', userEmail);
    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(
        `❌ Payment failed: ${paymentIntent.last_payment_error?.message}`
      );
    } else if (event.type === 'charge.succeeded') {
      const charge = event.data.object as Stripe.Charge;
      console.log(`💵 Charge id: ${charge.id}`);
    } else {
      console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default webhook;

import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';
import Cors from 'micro-cors';
import { supabase } from '../../lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET || '';

const cors = Cors({
  allowMethods: ['POST', 'HEAD'],
});

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature']!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buf.toString(),
        sig,
        webhookSecret
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      if (err! instanceof Error) console.log(err);
      console.log(`❌ Error message: ${errorMessage}`);
      res.status(400).send(`Webhook Error: ${errorMessage}`);
      return;
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

      // Update user_credits in Supabase
      await supabase
        .from('purchases')
        .update({ credits: { increment: creditAmount } })
        .eq('email', userEmail);

      // Insert purchase record in Supabase
      await supabase.from('purchases').insert([
        {
          creditAmount: creditAmount,
          userEmail: userEmail,
        },
      ]);
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

export default cors(webhookHandler as any);

import { useState, FC } from 'react';
import { supabase } from '../pages/_app';
import { getStripe } from '../lib/stripe';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

interface ErrorResponse {
  error: {
    message: string;
  };
}

const CheckoutForm: FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement!,
    });

    if (error) {
      setError(error.message || 'An error occurred');
      setProcessing(false);
    } else {
      // Call your backend to create the charge and update the user_credits table
      const response = await fetch('/api/charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_method_id: paymentMethod!.id }),
      });

      if (response.ok) {
        // Update user_credits in the frontend, e.g., using a context provider or local state
      } else {
        setError('Payment failed');
      }

      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button disabled={!stripe || processing} type="submit">
        {processing ? 'Processing…' : 'Purchase Credits'}
      </button>
      {error && <div>{error}</div>}
    </form>
  );
};

const PurchaseCredits: FC = () => {
  const stripePromise = getStripe();

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default PurchaseCredits;
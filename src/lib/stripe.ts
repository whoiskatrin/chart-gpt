import { loadStripe, Stripe } from '@stripe/stripe-js'
import { CreditSystemService } from './creditSystem'

let stripePromise: Promise<Stripe | null>

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '')
  }
  return stripePromise
}

export interface CheckoutSessionRequest {
  packageId: string
  userId: string
  userEmail: string
}

export interface CheckoutSessionResponse {
  sessionId: string
  url: string
}

export class StripeService {
  static async createCheckoutSession(
    packageId: string,
    userId: string,
    userEmail: string
  ): Promise<{ sessionId?: string; error?: string }> {
    try {
      const creditPackage = CreditSystemService.getPackageById(packageId)
      if (!creditPackage) {
        return { error: 'Invalid package selected' }
      }

      // In a real application, this would call your backend API
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageId,
          userId,
          userEmail,
          priceId: creditPackage.stripePriceId,
          credits: creditPackage.credits,
          amount: Math.round(creditPackage.price * 100), // Convert to cents
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        return { error: error || 'Failed to create checkout session' }
      }

      const { sessionId } = await response.json()
      return { sessionId }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      return { error: 'Failed to create checkout session' }
    }
  }

  static async redirectToCheckout(sessionId: string): Promise<{ error?: string }> {
    try {
      const stripe = await getStripe()
      if (!stripe) {
        return { error: 'Stripe not loaded' }
      }

      const { error } = await stripe.redirectToCheckout({ sessionId })
      
      if (error) {
        console.error('Stripe redirect error:', error)
        return { error: error.message }
      }

      return {}
    } catch (error) {
      console.error('Error redirecting to checkout:', error)
      return { error: 'Failed to redirect to checkout' }
    }
  }

  static async handleSuccessfulPayment(
    sessionId: string,
    userId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // In a real application, this would call your backend to verify the payment
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          userId,
        }),
      })

      if (!response.ok) {
        return { success: false, error: 'Failed to verify payment' }
      }

      const { credits, packageName } = await response.json()

      // Add credits to user account
      const result = await CreditSystemService.addCredits(
        userId,
        credits,
        `Purchase: ${packageName}`,
        sessionId
      )

      return { success: result.success, error: result.error }
    } catch (error) {
      console.error('Error handling successful payment:', error)
      return { success: false, error: 'Failed to process payment' }
    }
  }

  // For demo purposes - simulate successful payment
  static async simulatePayment(
    packageId: string,
    userId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const creditPackage = CreditSystemService.getPackageById(packageId)
      if (!creditPackage) {
        return { success: false, error: 'Invalid package' }
      }

      // Simulate adding credits
      const result = await CreditSystemService.addCredits(
        userId,
        creditPackage.credits,
        `Demo Purchase: ${creditPackage.name}`,
        `demo_${Date.now()}`
      )

      return { success: result.success, error: result.error }
    } catch (error) {
      console.error('Error simulating payment:', error)
      return { success: false, error: 'Failed to simulate payment' }
    }
  }

  static formatPrice(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  static calculateSavings(regularPrice: number, discountedPrice: number): string {
    const savings = ((regularPrice - discountedPrice) / regularPrice) * 100
    return `${Math.round(savings)}%`
  }
}

// Stripe Webhook Types (for backend reference)
export interface StripeWebhookEvent {
  type: string
  data: {
    object: {
      id: string
      customer_email: string
      metadata: {
        userId: string
        packageId: string
        credits: string
      }
      amount_total: number
      payment_status: string
    }
  }
}

export const STRIPE_WEBHOOK_EVENTS = {
  CHECKOUT_SESSION_COMPLETED: 'checkout.session.completed',
  PAYMENT_INTENT_SUCCEEDED: 'payment_intent.succeeded',
  PAYMENT_INTENT_PAYMENT_FAILED: 'payment_intent.payment_failed',
} as const
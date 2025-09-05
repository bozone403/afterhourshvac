import { loadStripe, Stripe } from '@stripe/stripe-js';

// This will be updated after deployment
let API_BASE_URL = 'https://afterhours-stripe-backend.onrender.com';

// Initialize Stripe with your publishable key
let stripePromise: Promise<Stripe | null>;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
  }
  return stripePromise;
};

interface PaymentIntentParams {
  amount: number;
  description?: string;
  metadata?: Record<string, string>;
  customerEmail?: string;
}

export const stripeService = {
  // Initialize with the deployed backend URL
  initialize(backendUrl: string) {
    API_BASE_URL = backendUrl;
  },

  // Create a payment intent for custom payment flows
  async createPaymentIntent(params: PaymentIntentParams) {
    try {
      const response = await fetch(`${API_BASE_URL}/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: params.amount,
          description: params.description,
          metadata: params.metadata || {},
          customer_email: params.customerEmail
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create payment intent');
      }
      
      return response.json();
    } catch (error) {
      console.error('Stripe Service Error:', error);
      throw error;
    }
  },

  // Handle direct payment with Stripe Elements
  async handlePayment(amount: number, paymentMethod: any, metadata = {}) {
    const stripe = await getStripe();
    if (!stripe) throw new Error('Stripe not initialized');

    // Create payment intent
    const { clientSecret } = await this.createPaymentIntent({
      amount,
      metadata
    });

    // Confirm the payment
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod.id,
      receipt_email: paymentMethod.billing_details.email,
    });

    if (error) {
      throw error;
    }

    return paymentIntent;
  },

  // Redirect to Stripe Checkout
  async redirectToCheckout(priceId: string, successUrl: string, cancelUrl: string, metadata = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          successUrl: `${window.location.origin}${successUrl}`,
          cancelUrl: `${window.location.origin}${cancelUrl}`,
          metadata
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Checkout Error:', error);
      throw error;
    }
  }
};

export default stripeService;
